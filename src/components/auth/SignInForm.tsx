"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Iniciando sesión...');

    try {
      await login(dni, password);
      toast.success('¡Bienvenido!', { id: toastId });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div>
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-4">
              <span className="text-5xl">🏆</span>
            </div>
            <h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 sm:text-title-lg">
              Pointify
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-1">
              Sistema de Puntos de Lealtad
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Ingresa con tu DNI y contraseña
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* DNI Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ingresa tu DNI"
                  required
                  disabled={loading}
                  maxLength={8}
                  autoComplete="off"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={loading}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="w-full text-base py-3.5"
                  variant="primary"
                >
                  Iniciar Sesión
                </LoadingButton>
              </div>
            </div>
          </form>

          {/* Info de usuarios de prueba */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Usuarios de Prueba:
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>
                <strong>Admin:</strong> DNI: 12345678 | Pass: admin123
              </li>
              <li>
                <strong>Cajero:</strong> DNI: 87654321 | Pass: cashier123
              </li>
            </ul>
          </div>

          {/* Link al portal público */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Eres cliente?{" "}
              <Link
                href="/portal"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Consulta tus puntos aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
