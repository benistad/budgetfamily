'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, CreditCard, TrendingDown } from 'lucide-react'
import Link from 'next/link'

type TypeDepense = 'prelevement' | 'paiement_recurrent' | 'virement_recurrent'

interface Depense {
  nom: string
  montant: number
  type: TypeDepense
  date: string
}

interface SumeriaData {
  depenses: Depense[]
}

const typeLabels: Record<TypeDepense, string> = {
  prelevement: 'Prélèvement',
  paiement_recurrent: 'Paiement récurrent CB',
  virement_recurrent: 'Virement récurrent'
}

const typeColors: Record<TypeDepense, string> = {
  prelevement: 'bg-purple-100 text-purple-700 border-purple-300',
  paiement_recurrent: 'bg-blue-100 text-blue-700 border-blue-300',
  virement_recurrent: 'bg-orange-100 text-orange-700 border-orange-300'
}

export default function SumeriaPage() {
  const [sumeria, setSumeria] = useState<SumeriaData>({
    depenses: []
  })
  
  const [newDepense, setNewDepense] = useState({ 
    nom: '', 
    montant: '', 
    type: 'prelevement' as TypeDepense 
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSumeria()
  }, [])

  const fetchSumeria = async () => {
    try {
      const response = await fetch('/api/sumeria')
      const data = await response.json()
      setSumeria({
        depenses: data.depenses || []
      })
    } catch (error) {
      console.error('Error fetching Sumeria:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSumeria = async (updatedData: SumeriaData) => {
    setSaving(true)
    try {
      const response = await fetch('/api/sumeria', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      const data = await response.json()
      setSumeria({
        depenses: data.depenses || []
      })
    } catch (error) {
      console.error('Error saving Sumeria:', error)
    } finally {
      setSaving(false)
    }
  }

  const addDepense = () => {
    if (newDepense.nom && newDepense.montant) {
      const updatedData = {
        ...sumeria,
        depenses: [...sumeria.depenses, {
          nom: newDepense.nom,
          montant: parseFloat(newDepense.montant),
          type: newDepense.type,
          date: new Date().toISOString()
        }]
      }
      saveSumeria(updatedData)
      setNewDepense({ nom: '', montant: '', type: 'prelevement' })
    }
  }

  const removeDepense = (index: number) => {
    const updatedData = {
      ...sumeria,
      depenses: sumeria.depenses.filter((_, i) => i !== index)
    }
    saveSumeria(updatedData)
  }

  const totalDepenses = sumeria.depenses.reduce((sum, depense) => sum + depense.montant, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Sumeria</h1>
            <div className="w-6"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">Compte joint Benoit & Marine</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Résumé */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Résumé
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Dépenses</span>
              <span className="text-2xl font-bold text-red-600">-{totalDepenses.toFixed(2)} €</span>
            </div>
            <div className="text-sm text-gray-500">
              {sumeria.depenses.length} dépense{sumeria.depenses.length > 1 ? 's' : ''} enregistrée{sumeria.depenses.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Dépenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
            Dépenses
          </h2>
          
          <div className="space-y-3 mb-4">
            {sumeria.depenses.map((depense, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-gray-900">{depense.nom}</div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${typeColors[depense.type]}`}>
                      {typeLabels[depense.type]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{depense.montant.toFixed(2)} €</div>
                </div>
                <button
                  onClick={() => removeDepense(index)}
                  disabled={saving}
                  className="text-red-500 hover:text-red-700 p-2 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {sumeria.depenses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune dépense enregistrée
              </div>
            )}
          </div>

          {/* Formulaire d'ajout */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ajouter une dépense</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom de la dépense"
                value={newDepense.nom}
                onChange={(e) => setNewDepense({ ...newDepense, nom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Montant"
                  value={newDepense.montant}
                  onChange={(e) => setNewDepense({ ...newDepense, montant: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                
                <select
                  value={newDepense.type}
                  onChange={(e) => setNewDepense({ ...newDepense, type: e.target.value as TypeDepense })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                >
                  <option value="prelevement">Prélèvement</option>
                  <option value="paiement_recurrent">Paiement récurrent CB</option>
                  <option value="virement_recurrent">Virement récurrent</option>
                </select>
              </div>
              
              <button
                onClick={addDepense}
                disabled={saving || !newDepense.nom || !newDepense.montant}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter la dépense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
