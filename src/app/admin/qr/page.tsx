'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export default function QRPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [portalUrl, setPortalUrl] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user && user.role !== 'admin') {
      router.push('/pos');
      return;
    }

    // Generar URL del portal
    const baseUrl = window.location.origin;
    setPortalUrl(`${baseUrl}/portal`);
  }, [user, isLoading, router]);

  if (isLoading || !user || !portalUrl) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Código QR del Portal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Imprime este código para que los clientes consulten sus puntos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Código QR del Portal de Clientes
            </h2>

            {/* QR Code */}
            <div className="bg-white p-8 rounded-xl inline-block mb-6 shadow-lg">
              <QRCode
                value={portalUrl}
                size={300}
                level="H"
                fgColor="#000000"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                📱 URL del Portal
              </p>
              <code className="text-blue-700 dark:text-blue-400 break-all">
                {portalUrl}
              </code>
            </div>

            <button
              onClick={handlePrint}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>🖨️</span>
              Imprimir QR
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📋 Instrucciones de Uso
            </h3>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>
                  Imprime este código QR en un tamaño visible (A4 recomendado)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>
                  Coloca el QR en un lugar accesible en tu tienda (cerca de la caja, entrada, etc.)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>
                  Los clientes escanean el QR con su celular
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>
                  Ingresan su DNI y pueden ver sus puntos o registrarse
                </span>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
              <span>✨</span>
              Beneficios
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-400">
              <li>✅ Clientes consultan sus puntos 24/7</li>
              <li>✅ Registro automático desde sus celulares</li>
              <li>✅ No requiere app, funciona en cualquier navegador</li>
              <li>✅ Código estático, no caduca</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            text-align: center;
            padding: 2cm;
          }
        }
      `}</style>

      {/* Hidden Print Area */}
      <div className="print-area hidden print:block">
        <h1 className="text-4xl font-bold mb-4">Consulta tus Puntos</h1>
        <p className="text-xl mb-8">Escanea este código con tu celular</p>
        <div className="inline-block bg-white p-8 rounded-xl">
          <QRCode value={portalUrl} size={400} level="H" />
        </div>
        <p className="text-2xl font-bold mt-8">Pointify</p>
        <p className="text-lg mt-2">{portalUrl}</p>
      </div>
    </div>
  );
}
