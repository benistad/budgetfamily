import Link from 'next/link'
import { Users, Building2 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Familial</h1>
          <p className="text-gray-600">Gérez votre budget prévisionnel</p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/benoit"
            className="block w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary-500"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Budget de Benoit</h2>
            <p className="text-gray-600">Gérer les charges, revenus et contribution famille</p>
          </Link>

          <Link 
            href="/marine"
            className="block w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary-500"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Budget de Marine</h2>
            <p className="text-gray-600">Gérer les charges, revenus et contribution famille</p>
          </Link>

          <Link 
            href="/hellobank"
            className="block w-full bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-cyan-400"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Hello Bank</h2>
            </div>
            <p className="text-cyan-100">Compte joint - Gérer les dépenses communes</p>
          </Link>

          <Link 
            href="/sumeria"
            className="block w-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-gray-600"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Sumeria</h2>
            </div>
            <p className="text-gray-300">Compte joint - Gérer les dépenses communes</p>
          </Link>

          <Link 
            href="/bred"
            className="block w-full bg-gradient-to-r from-red-600 to-rose-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-red-400"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">BRED</h2>
            </div>
            <p className="text-red-100">Compte joint - Virements famille inclus</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
