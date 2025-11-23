'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, Euro, TrendingUp, TrendingDown, Home } from 'lucide-react'
import Link from 'next/link'

interface Charge {
  _id?: string
  nom: string
  montant: number
  date: Date
}

interface Revenu {
  _id?: string
  nom: string
  montant: number
  date: Date
}

interface BudgetData {
  charges: Charge[]
  revenus: Revenu[]
  virementFamille: number
}

interface BudgetPageProps {
  personne: 'benoit' | 'marine'
}

export default function BudgetPage({ personne }: BudgetPageProps) {
  const [budget, setBudget] = useState<BudgetData>({
    charges: [],
    revenus: [],
    virementFamille: 0
  })
  
  const [newCharge, setNewCharge] = useState({ nom: '', montant: '' })
  const [newRevenu, setNewRevenu] = useState({ nom: '', montant: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const nom = personne.charAt(0).toUpperCase() + personne.slice(1)

  useEffect(() => {
    fetchBudget()
  }, [personne])

  const fetchBudget = async () => {
    try {
      const response = await fetch(`/api/budget/${personne}`)
      const data = await response.json()
      setBudget({
        charges: data.charges || [],
        revenus: data.revenus || [],
        virementFamille: data.virementFamille || 0
      })
    } catch (error) {
      console.error('Error fetching budget:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveBudget = async (updatedBudget: BudgetData) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/budget/${personne}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBudget)
      })
      const data = await response.json()
      setBudget({
        charges: data.charges || [],
        revenus: data.revenus || [],
        virementFamille: data.virementFamille || 0
      })
    } catch (error) {
      console.error('Error saving budget:', error)
    } finally {
      setSaving(false)
    }
  }

  const addCharge = () => {
    if (newCharge.nom && newCharge.montant) {
      const updatedBudget = {
        ...budget,
        charges: [...budget.charges, {
          nom: newCharge.nom,
          montant: parseFloat(newCharge.montant),
          date: new Date()
        }]
      }
      saveBudget(updatedBudget)
      setNewCharge({ nom: '', montant: '' })
    }
  }

  const removeCharge = (index: number) => {
    const updatedBudget = {
      ...budget,
      charges: budget.charges.filter((_, i) => i !== index)
    }
    saveBudget(updatedBudget)
  }

  const addRevenu = () => {
    if (newRevenu.nom && newRevenu.montant) {
      const updatedBudget = {
        ...budget,
        revenus: [...budget.revenus, {
          nom: newRevenu.nom,
          montant: parseFloat(newRevenu.montant),
          date: new Date()
        }]
      }
      saveBudget(updatedBudget)
      setNewRevenu({ nom: '', montant: '' })
    }
  }

  const removeRevenu = (index: number) => {
    const updatedBudget = {
      ...budget,
      revenus: budget.revenus.filter((_, i) => i !== index)
    }
    saveBudget(updatedBudget)
  }

  const updateVirementFamille = (montant: number) => {
    const updatedBudget = {
      ...budget,
      virementFamille: montant
    }
    saveBudget(updatedBudget)
  }

  const totalCharges = budget.charges.reduce((sum, charge) => sum + charge.montant, 0)
  const totalRevenus = budget.revenus.reduce((sum, revenu) => sum + revenu.montant, 0)
  const solde = totalRevenus - totalCharges - budget.virementFamille

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
            <h1 className="text-2xl font-bold text-gray-900">Budget de {nom}</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Résumé */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Euro className="w-5 h-5 mr-2" />
            Résumé
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenus</span>
              <span className="text-lg font-semibold text-green-600">+{totalRevenus.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Charges</span>
              <span className="text-lg font-semibold text-red-600">-{totalCharges.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Virement Famille</span>
              <span className="text-lg font-semibold text-orange-600">-{budget.virementFamille.toFixed(2)} €</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-gray-900 font-semibold">Solde</span>
              <span className={`text-xl font-bold ${solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {solde >= 0 ? '+' : ''}{solde.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Revenus */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Revenus
          </h2>
          
          <div className="space-y-3 mb-4">
            {budget.revenus.map((revenu, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{revenu.nom}</div>
                  <div className="text-sm text-gray-600">{revenu.montant.toFixed(2)} €</div>
                </div>
                <button
                  onClick={() => removeRevenu(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nom du revenu"
              value={newRevenu.nom}
              onChange={(e) => setNewRevenu({ ...newRevenu, nom: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Montant"
              value={newRevenu.montant}
              onChange={(e) => setNewRevenu({ ...newRevenu, montant: e.target.value })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={addRevenu}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Charges */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
            Charges
          </h2>
          
          <div className="space-y-3 mb-4">
            {budget.charges.map((charge, index) => (
              <div key={index} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{charge.nom}</div>
                  <div className="text-sm text-gray-600">{charge.montant.toFixed(2)} €</div>
                </div>
                <button
                  onClick={() => removeCharge(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nom de la charge"
              value={newCharge.nom}
              onChange={(e) => setNewCharge({ ...newCharge, nom: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Montant"
              value={newCharge.montant}
              onChange={(e) => setNewCharge({ ...newCharge, montant: e.target.value })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={addCharge}
              disabled={saving}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Virement Famille */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-orange-600" />
            Virement Famille
          </h2>
          
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={budget.virementFamille}
              onChange={(e) => updateVirementFamille(parseFloat(e.target.value) || 0)}
              className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Montant du virement"
            />
            <span className="text-2xl font-semibold text-orange-600">{budget.virementFamille.toFixed(2)} €</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Montant du virement mensuel vers le compte familial
          </p>
        </div>
      </div>
    </div>
  )
}
