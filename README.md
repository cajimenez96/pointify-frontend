# Pointify Frontend - Sistema de Puntos de Lealtad

Frontend del sistema Pointify construido con **Next.js 16 (App Router)** y **TailAdmin Template**.

---

## 📁 Estructura del Proyecto

```
pointify-frontend/
├── src/
│   ├── app/                    # Rutas de Next.js (App Router)
│   │   ├── auth/
│   │   │   └── signin/
│   │   │       └── page.tsx    # ✅ Página de inicio de sesión
│   │   ├── admin/              # Vistas protegidas para administradores
│   │   │   ├── layout.tsx      # ✅ Layout con sidebar (requiere auth)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # ✅ Panel de estadísticas
│   │   │   ├── customers/
│   │   │   │   └── page.tsx    # ✅ Lista de clientes
│   │   │   └── settings/
│   │   │       └── page.tsx    # ✅ Configuración de recompensas
│   │   ├── pos/                # Vista del cajero
│   │   │   ├── layout.tsx      # ✅ Layout simplificado sin sidebar
│   │   │   └── page.tsx        # ✅ Formulario para agregar puntos
│   │   ├── portal/             # Portal público del cliente
│   │   │   ├── layout.tsx      # ✅ Layout público mobile-first
│   │   │   └── page.tsx        # ✅ Consulta de puntos / Registro
│   │   ├── globals.css         # Estilos globales de TailAdmin
│   │   ├── layout.tsx          # Layout raíz (envuelve con AuthProvider)
│   │   └── favicon.ico
│   ├── components/             # Componentes reutilizables
│   │   ├── (TailAdmin)/        # Componentes del template
│   │   │   ├── Sidebar/
│   │   │   ├── Header/
│   │   │   ├── Tables/
│   │   │   └── ...
│   │   └── Toast.tsx           # ✅ Componente de notificaciones
│   ├── context/
│   │   └── AuthContext.tsx     # ✅ Contexto de autenticación (JWT)
│   ├── lib/
│   │   └── api.ts              # ✅ Cliente Axios configurado
│   ├── layout/                 # Layouts del template
│   │   └── DefaultLayout.tsx   # Layout con sidebar para admin
│   └── hooks/                  # Custom hooks
├── public/                     # Archivos estáticos
├── .env.local                  # ✅ Variables de entorno
├── package.json
└── README.md                   # Este archivo
```

---

## 🚀 Lista de Funcionalidades

### Autenticación
- [x] Login con DNI y contraseña
- [x] Almacenamiento de token JWT en localStorage
- [x] Redirección automática según rol (admin → dashboard, cajero → POS)
- [x] Protección de rutas privadas
- [x] Logout funcional

### Panel de Administración (`/admin`)
- [x] Dashboard con tarjetas de estadísticas
  - Total de clientes
  - Total de transacciones
  - Total de puntos emitidos
- [x] Lista de clientes registrados (`/admin/customers`)
- [x] Configuración de recompensas (`/admin/settings`)
  - Modificar meta de puntos
  - Cambiar nombre del premio
- [x] Sidebar de navegación
- [x] Header con logout

### Vista del Cajero (`/pos`)
- [x] Formulario simplificado para agregar puntos
  - Input de DNI del cliente
  - Input de código de venta
- [x] Mensajes de éxito/error con feedback visual
- [x] Alert cuando el cliente alcanza la meta de puntos
- [x] Layout sin sidebar (interfaz simplificada)

### Portal del Cliente (`/portal`)
- [x] Consulta de puntos por DNI
- [x] Tarjeta visual de recompensa con:
  - Puntos actuales del cliente
  - Barra de progreso hacia el premio
  - Nombre del premio configurado
  - Porcentaje de progreso
- [x] Formulario de registro para nuevos clientes
- [x] Diseño mobile-first y responsive
- [x] Sin autenticación requerida (acceso público)

---

## 🔧 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# URL del API backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Otras variables (opcional)
# NEXT_PUBLIC_APP_NAME=Pointify
```

### Descripción de Variables

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL base del API de NestJS. Debe apuntar al backend. | `http://localhost:3000` |

> **Nota:** Las variables que comienzan con `NEXT_PUBLIC_` son accesibles en el cliente (navegador).

---

## 📦 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ 
- npm o pnpm
- Backend de Pointify ejecutándose en `http://localhost:3000`

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Crear archivo de variables de entorno:**
   ```bash
   cp .env.example .env.local
   # O crear manualmente .env.local con el contenido de arriba
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir el navegador:**
   - Frontend: http://localhost:3001 (o el puerto asignado)
   - Login: http://localhost:3001/auth/signin
   - Portal público: http://localhost:3001/portal

### Datos de Prueba

Usuarios pre-creados (después de ejecutar `npm run seed` en el backend):

| Rol | DNI | Contraseña | Redirige a |
|-----|-----|------------|------------|
| Admin | `12345678` | `admin123` | `/admin/dashboard` |
| Cajero | `87654321` | `cashier123` | `/pos` |

---

## 🎨 Mejoras UX/UI Implementadas

### 1. Notificaciones Toast

Sistema de notificaciones no invasivas para feedback al usuario.

**Biblioteca:** `react-hot-toast`

**Implementación:**
```tsx
// En cualquier componente
import toast from 'react-hot-toast';

// Éxito
toast.success('¡Puntos agregados exitosamente!');

// Error
toast.error('Cliente no encontrado');

// Cargando
const toastId = toast.loading('Procesando...');
// Luego
toast.success('¡Listo!', { id: toastId });
```

### 2. Estados de Carga

Botones con indicadores de carga para mejor retroalimentación.

**Ejemplo:**
```tsx
const [loading, setLoading] = useState(false);

<button 
  disabled={loading}
  className="bg-blue-600 text-white py-3 px-6 rounded-lg disabled:opacity-50"
>
  {loading ? 'Procesando...' : 'Agregar Punto'}
</button>
```

### 3. Validación de Formularios

Mensajes de error en español integrados en DTOs del backend.

### 4. Diseño Responsive

- Portal del cliente optimizado para móviles
- Dashboard adaptable a tablets y desktop
- POS usable en pantallas táctiles

---

## 📂 Archivos Clave Modificados del Template

### Archivos Mantenidos de TailAdmin

- ✅ `/src/layout/DefaultLayout.tsx` - Layout con sidebar
- ✅ `/src/components/Sidebar/` - Menú lateral
- ✅ `/src/components/Header/` - Cabecera con perfil
- ✅ `/src/components/Tables/` - Componentes de tabla
- ✅ `/src/components/FormElements/` - Inputs y forms
- ✅ `/src/app/globals.css` - Estilos globales

### Archivos Eliminados/Ignorados

- ❌ Demo de calendarios
- ❌ Páginas de ejemplo (charts, ui elements)
- ❌ Full-width pages demo
- ❌ Componentes no utilizados (DataStats, etc.)

---

## 🔌 Integración con el Backend

### Cliente API (`lib/api.ts`)

Instancia de Axios configurada automáticamente:

```typescript
import api from '@/lib/api';

// Ejemplo: Login
const response = await api.post('/auth/login', { dni, password });

// Ejemplo: Agregar puntos (requiere token)
const result = await api.post('/transactions/add', { dni, saleCode });
```

**Características:**
- Agrega automáticamente el token JWT a las peticiones
- Lee el token desde `localStorage`
- Maneja CORS correctamente
- Base URL configurable desde `.env.local`

### Contexto de Autenticación

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  // user contiene: { id, dni, name, role }
  // login(dni, password) - retorna Promise
  // logout() - limpia sesión
  // isLoading - true mientras verifica token inicial
}
```

---

## 🛣️ Rutas del Sistema

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Redirige a login o dashboard según sesión |
| `/auth/signin` | Público | Página de inicio de sesión |
| `/admin/dashboard` | Admin | Panel de estadísticas |
| `/admin/customers` | Admin | Lista de clientes |
| `/admin/settings` | Admin | Configuración del sistema |
| `/pos` | Cajero/Admin | Formulario para agregar puntos |
| `/portal` | Público | Portal del cliente (consulta/registro) |

---

## 🐛 Troubleshooting

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"

**Causa:** El backend no está ejecutándose.

**Solución:**
```bash
cd ../pointify-api
npm run start:dev
```

### Error: "401 Unauthorized" en peticiones protegidas

**Causa:** Token JWT expirado o inválido.

**Solución:**
1. Cerrar sesión
2. Volver a iniciar sesión
3. El token se actualiza automáticamente

### Los estilos de TailAdmin no se ven

**Causa:** TailwindCSS no compiló los estilos.

**Solución:**
```bash
npm run dev  # Reiniciar el servidor de desarrollo
```

---

## 📈 Próximos Pasos (Roadmap)

### Funcionalidades Pendientes
- [ ] Generación de QR estático para el portal
- [ ] Botón de canje de recompensas para cajeros
- [ ] Notificaciones por email cuando se alcanza el premio
- [ ] Gráficos en dashboard (distribución de puntos)
- [ ] Historial de transacciones por cliente
- [ ] Exportar lista de clientes a CSV
- [ ] Multi-tienda (soporte para varias sucursales)
- [ ] PWA para instalar portal en móvil

### Mejoras Técnicas
- [ ] Tests unitarios con Jest
- [ ] Tests E2E con Playwright
- [ ] Optimización de imágenes con Next.js Image
- [ ] Server-side rendering para SEO
- [ ] Caché de peticiones con SWR o React Query

---

## 📚 Recursos Adicionales

- [Documentación de Next.js 16](https://nextjs.org/docs)
- [TailAdmin Template](https://github.com/TailAdmin/free-nextjs-admin-dashboard)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [React Hot Toast](https://react-hot-toast.com/)

---

## 🤝 Soporte

Para dudas técnicas o reportar bugs, contacta al equipo de desarrollo.

**Backend API:** http://localhost:3000/api (Documentación Swagger interactiva)

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026
