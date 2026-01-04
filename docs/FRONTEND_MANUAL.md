# Manual del Frontend - Pointify

**Sistema de Puntos de Lealtad - Guía Completa de Usuario**

---

## 📋 Introducción

Este manual explica cómo funcionan las interfaces de usuario de Pointify, desde la perspectiva del **Cajero** (quien agrega puntos) y del **Cliente** (quien consulta sus puntos).

**Tecnologías**: Next.js 16 + React 19 + TailAdmin + TypeScript

---

## 👥 Flujos de Usuario

### 1. Flow del Cajero (Point Loading)

**Actor**: Empleado con acceso (Admin o Cashier)

**Objetivo**: Agregar puntos a un cliente al procesar una venta.

#### Paso a Paso

1. **Login** (`/signin`)
   - Ingresar DNI (solo números, 8 dígitos)
   - Ingresar contraseña
   - Click "Iniciar Sesión"
   - **Redirección automática**:
     - Si es Admin → `/admin/dashboard`
     - Si es Cajero → `/pos`

2. **Vista POS** (`/pos`)
   - **Input 1**: DNI del cliente
   - **Input 2**: Código de venta (del sistema POS externo)
   - Click "Agregar Punto"

3. **Escenarios Posibles**:
   
   **A. Cliente Registrado - Sin Premio**
   ```
   ✅ Toast: "Puntos agregados exitosamente"
   📊 Card: "Juan Pérez - 8 puntos - Total: 15"
   ```

   **B. Cliente Registrado - Con Premio**
   ```
   🎉 Toast: "¡PREMIO GANADO! Entregar Café Gratis a Juan Pérez"
   🏆 Card especial: "Premio Alcanzado"
   📊 Puntos mostrados: 0 (reseteo automático)
   ```

   **C. Cliente NO Registrado (Shadow)**
   ```
   ✅ Toast: "Puntos agregados exitosamente"
   📊 Card: "Cliente 11223344 - 1 punto"
   💡 El cliente puede completar sus datos desde el portal
   ```

4. **Errores Comunes**:
   - "Código de venta ya procesado" → Usar código único
   - "La campaña no está activa" → Contactar admin
   - "La campaña ha finalizado" → Contactar admin

---

### 2. Flow del Cliente (Consultation & Registration)

**Actor**: Cliente final (sin credenciales)

**Acceso**: QR Code estático impreso en la tienda → `https://pointify.app/portal`

#### Paso a Paso

1. **Escanear QR Code**
   - Cliente escanea QR en su celular
   - Abre directamente `/portal`

2. **Consultar DNI**
   - Ingresar DNI (8 dígitos)
   - Click "Ver mis Puntos"

3. **Escenarios**:

   **A. Cliente Registrado**
   ```
   Vista:
   ┌─────────────────────────────┐
   │  ¡Hola, Juan Pérez!         │
   │                              │
   │  Puntos Actuales: 8          │
   │  Meta: 10 pts               │
   │                              │
   │  Progreso: ████████░░ 80%   │
   │  Te faltan 2 puntos para    │
   │  Café Gratis                │
   └─────────────────────────────┘
   ```

   Si alcanzó la meta:
   ```
   ┌─────────────────────────────┐
   │  🎉 ¡Premio listo!          │
   │  Acércate a la tienda       │
   │  para canjear tu            │
   │  Café Gratis                │
   └─────────────────────────────┘
   ```

   **B. Cliente NO Registrado / Shadow**
   ```
   Vista:
   ┌─────────────────────────────┐
   │  DNI no registrado          │
   │  Completa tus datos         │
   │                              │
   │  [Nombre Completo *]        │
   │  [Teléfono]                 │
   │  [Email]                    │
   │                              │
   │  [✓ Registrarme]            │
   └─────────────────────────────┘
   ```

   Después de registrarse:
   - Los puntos shadow se mantienen
   - Se muestra el dashboard normal

---

## 📁 Estructura del Proyecto

### Organización de Carpetas

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # ✅ Layout raíz (AuthProvider, Toaster)
│   │
│   ├── signin/                    # ✅ Login - DNI + Password
│   │   └── page.tsx
│   │
│   ├── portal/                    # ✅ Portal del Cliente (Público)
│   │   └── page.tsx               # Consulta + Registro
│   │
│   ├── pos/                       # ✅ Vista del Cajero
│   │   └── page.tsx               # Agregar puntos
│   │
│   └── admin/                     # ✅ Panel de Administración
│       ├── dashboard/
│       │   └── page.tsx           # Métricas del sistema
│       ├── customers/
│       │   └── page.tsx           # Lista de clientes
│       └── settings/
│           └── page.tsx           # Configuración de campaña
│
├── components/                    # Componentes reutilizables
│   ├── LoadingSpinner.tsx         # Spinner animado
│   ├── LoadingButton.tsx          # Botón con estado loading
│   ├── LoadingOverlay.tsx         # Overlay global
│   └── auth/
│       └── SignInForm.tsx         # Form de login
│
├── context/
│   └── AuthContext.tsx            # ✅ Estado global de autenticación
│
├── services/
│   └── api.ts                     # ✅ Cliente Axios con interceptores
│
├── types/
│   └── api.ts                     # Tipos TypeScript del backend
│
└── hooks/
    └── useFormState.ts            # Hook para forms con toasts
```

---

## 🔌 Conexión con el Backend

### Archivo: `src/services/api.ts`

Este es el **puente** entre el frontend y el backend.

#### Configuración Automática

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:3000
  timeout: 10000,
});
```

#### Interceptor de Request

**Función**: Agregar token JWT automáticamente.

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Esto significa que **NO necesitas agregar manualmente** el header en cada request.

#### Interceptor de Response

**Función**: Detectar errores globales.

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado → Logout automático
      localStorage.clear();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
```

---

### Uso en Componentes

#### Ejemplo: Agregar Puntos (POS)

```typescript
import api, { getErrorMessage } from '@/services/api';
import toast from 'react-hot-toast';

const handleSubmit = async () => {
  try {
    const response = await api.post('/transactions/add', {
      dni: '11223344',
      saleCode: 'SALE001'
    });

    const data = response.data;
    toast.success(data.message);

    if (data.rewardReached) {
      // Mostrar alerta especial de premio
      toast.success(`🎉 ${data.client.name} ganó!`, { duration: 6000 });
    }
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
```

#### Helper: `getErrorMessage()`

Traduce errores técnicos a mensajes en español:

```typescript
// Error del backend
error.response.data.message = "Cliente no encontrado"

// getErrorMessage() retorna:
"Cliente no encontrado"

// Si es error de red:
"Error de conexión. Verifica que el backend esté ejecutándose."
```

---

## 🎨 Componentes de UX

### Toast Notifications

Configuradas globalmente en `layout.tsx`:

```typescript
<Toaster
  position="top-right"
  toastOptions={{
    success: { style: { background: '#10B981' } },
    error: { style: { background: '#EF4444' } }
  }}
/>
```

Uso:

```typescript
import toast from 'react-hot-toast';

toast.success('¡Operación exitosa!');
toast.error('Algo salió mal');
toast.loading('Procesando...');
```

### LoadingButton

Botón que muestra estado de carga:

```typescript
<LoadingButton
  loading={isLoading}
  onClick={handleSubmit}
  variant="primary"
>
  Guardar
</LoadingButton>
```

Internamente cambia a:

```
[Loading = false]: "Guardar"
[Loading = true]:  "⏳ Cargando..."
```

---

## 🔐 Autenticación (AuthContext)

### Flujo Completo

```
1. Usuario ingresa DNI + Password en /signin
2. SignInForm llama a login(dni, password)
3. AuthContext hace POST /auth/login
4. Backend retorna { access_token, user }
5. AuthContext guarda en localStorage
6. AuthContext setea user en el estado
7. AuthContext redirige según role:
   - admin → /admin/dashboard
   - cashier → /pos
8. En cada request, api.ts agrega el token
```

### Uso en Componentes

```typescript
import { useAuth } from '@/context/AuthContext';

function Component() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Por favor inicia sesión</p>;
  }

  return (
    <div>
      <p>Hola, {user.name}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

---

## 📱 Vistas Detalladas

### Vista POS (`/pos`)

**Propósito**: Agregar puntos rápidamente en la caja.

**Lógica del Componente**:

```typescript
// 1. Form con DNI + SaleCode
const [dni, setDni] = useState('');
const [saleCode, setSaleCode] = useState('');

// 2. Submit
const handleSubmit = async (e) => {
  e.preventDefault();
  const toastId = toast.loading('Procesando...');

  try {
    const response = await api.post('/transactions/add', { dni, saleCode });
    toast.success(response.data.message, { id: toastId });

    // 3. Mostrar resultado
    setLastResult(response.data);

    // 4. Limpiar form
    setDni('');
    setSaleCode('');
  } catch (error) {
    toast.error(getErrorMessage(error), { id: toastId });
  }
};
```

**UI Features**:
- Solo números en DNI
- Código de venta en mayúsculas
- Card de resultado con animación
- Alerta especial si `rewardReached = true`

---

### Portal del Cliente (`/portal`)

**Propósito**: Consulta pública de puntos + registro.

**Estados del Componente**:

```typescript
type Step = 'input' | 'display' | 'register';
const [step, setStep] = useState<Step>('input');
```

**Lógica**:

```typescript
const handleCheckDni = async () => {
  try {
    const client = await api.get(`/clients/${dni}`);
    setClient(client.data);
    setStep('display'); // Mostrar puntos
  } catch (error) {
    if (error.response?.status === 404) {
      setStep('register'); // Formulario de registro
    }
  }
};
```

**UI Features**:
- Gradiente de fondo atractivo
- Barra de progreso animada
- Mensaje dinámico: "Te faltan X puntos"
- Alerta verde si puede canjear premio

---

### Admin Dashboard (`/admin/dashboard`)

**Propósito**: Vista general del programa.

**Datos Mostrados**:

```typescript
const [stats, setStats] = useState<DashboardStats | null>(null);

useEffect(() => {
  const response = await api.get('/dashboard/stats');
  setStats(response.data);
}, []);
```

**Cards**:
1. Total Clientes (icono 👥)
2. Total Transacciones (icono 💳)
3. Puntos Emitidos (icono ⭐)

**Tabla**:
- Últimas transacciones
- Columnas: Cliente, Código, Puntos, Fecha

---

### Admin Settings (`/admin/settings`)

**Propósito**: Configurar campaña de puntos.

**Form Editable**:

```typescript
const [formData, setFormData] = useState({
  pointsTarget: 10,
  rewardName: 'Café Gratis',
  minPurchaseAmount: 0,
  isActive: true,
  campaignStartDate: null,
  campaignEndDate: null,
});

const handleSubmit = async () => {
  await api.put('/settings', formData);
  toast.success('Configuración actualizada');
};
```

**UI Features**:
- Vista previa en vivo del premio
- Cards informativos (reglas, monto mínimo)
- Botón "Descartar" para resetear cambios

---

## 🚀 Guía de Deploy (Producción)

### 1. Build del Frontend

```bash
cd pointify-frontend
npm run build
```

Genera carpeta `.next/` con código optimizado.

### 2. Variables de Entorno

Crear `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.pointify.app
```

### 3. Ejecutar en Producción

```bash
npm start
```

### 4. Deploy en Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar env var en Vercel Dashboard:
# NEXT_PUBLIC_API_URL = https://api.pointify.app
```

---

## 🔧 Variables de Entorno

### `.env.local` (Desarrollo)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Pointify
```

### Acceso en Código

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**IMPORTANTE**: Solo variables con prefijo `NEXT_PUBLIC_` son accesibles en el cliente.

---

## 🐛 Troubleshooting

### Error: "Module not found: axios"

```bash
npm install axios
```

### Error: "useAuth must be used within AuthProvider"

Verificar que `layout.tsx` tiene:

```typescript
<AuthProvider>
  {children}
</AuthProvider>
```

### Toast no se muestra

Verificar que `layout.tsx` incluye:

```typescript
import { Toaster } from 'react-hot-toast';

<Toaster position="top-right" />
```

### Frontend no conecta con backend

1. Verificar que backend está corriendo en puerto 3000
2. Revisar `.env.local` tiene `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. Reiniciar servidor de Next.js: `npm run dev`

---

## 📚 Recursos Adicionales

- [Next.js Docs](https://nextjs.org/docs)
- [React Hot Toast](https://react-hot-toast.com/)
- [Axios Docs](https://axios-http.com/docs/intro)

---

**Versión**: 2.0 (Con Campaign Logic)  
**Fecha**: Enero 2026  
**Stack**: Next.js 16 + TailAdmin
