'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, Euro, TrendingUp, TrendingDown, Home, Edit2, Check, X } from 'lucide-react'
import Link from 'next/link'

interface Charge {
  nom: string
  montant: number
  date: string
  pointe?: boolean
}

interface Revenu {
  nom: string
  montant: number
  date: string
  pointe?: boolean
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
  const [editingChargeIndex, setEditingChargeIndex] = useState<number | null>(null)
  const [editingRevenuIndex, setEditingRevenuIndex] = useState<number | null>(null)
  const [editChargeData, setEditChargeData] = useState<Charge | null>(null)
  const [editRevenuData, setEditRevenuData] = useState<Revenu | null>(null)

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
        virementFamille: data.virement_famille || data.virementFamille || 0
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBudget)
      })
      const data = await response.json()
      setBudget({
        charges: data.charges || [],
        revenus: data.revenus || [],
        virementFamille: data.virement_famille || data.virementFamille || 0
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
          date: new Date().toISOString()
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
          date: new Date().toISOString()
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

  const startEditCharge = (index: number) => {
    setEditingChargeIndex(index)
    setEditChargeData({ ...budget.charges[index] })
  }

  const cancelEditCharge = () => {
    setEditingChargeIndex(null)
    setEditChargeData(null)
  }

  const saveEditCharge = () => {
    if (editingChargeIndex !== null && editChargeData) {
      const updatedCharges = [...budget.charges]
      updatedCharges[editingChargeIndex] = editChargeData
      saveBudget({ ...budget, charges: updatedCharges })
      setEditingChargeIndex(null)
      setEditChargeData(null)
    }
  }

  const startEditRevenu = (index: number) => {
    setEditingRevenuIndex(index)
    setEditRevenuData({ ...budget.revenus[index] })
  }

  const cancelEditRevenu = () => {
    setEditingRevenuIndex(null)
    setEditRevenuData(null)
  }

  const saveEditRevenu = () => {
    if (editingRevenuIndex !== null && editRevenuData) {
      const updatedRevenus = [...budget.revenus]
      updatedRevenus[editingRevenuIndex] = editRevenuData
      saveBudget({ ...budget, revenus: updatedRevenus })
      setEditingRevenuIndex(null)
      setEditRevenuData(null)
    }
  }

  const updateVirementFamille = (montant: number) => {
    const updatedBudget = {
      ...budget,
      virementFamille: montant
    }
    saveBudget(updatedBudget)
  }

  const togglePointeCharge = (index: number) => {
    const updatedCharges = [...budget.charges]
    updatedCharges[index] = {
      ...updatedCharges[index],
      pointe: !updatedCharges[index].pointe
    }
    saveBudget({ ...budget, charges: updatedCharges })
  }

  const togglePointeRevenu = (index: number) => {
    const updatedRevenus = [...budget.revenus]
    updatedRevenus[index] = {
      ...updatedRevenus[index],
      pointe: !updatedRevenus[index].pointe
    }
    saveBudget({ ...budget, revenus: updatedRevenus })
  }

  const resetPointage = () => {
    const updatedCharges = budget.charges.map(c => ({ ...c, pointe: false }))
    const updatedRevenus = budget.revenus.map(r => ({ ...r, pointe: false }))
    saveBudget({ ...budget, charges: updatedCharges, revenus: updatedRevenus })
  }

  const totalCharges = budget.charges.reduce((sum, charge) => sum + charge.montant, 0)
  const totalRevenus = budget.revenus.reduce((sum, revenu) => sum + revenu.montant, 0)
  const solde = totalRevenus - totalCharges - budget.virementFamille
  
  const chargesPointees = budget.charges.filter(c => c.pointe).reduce((sum, c) => sum + c.montant, 0)
  const revenusPointes = budget.revenus.filter(r => r.pointe).reduce((sum, r) => sum + r.montant, 0)
  const chargesNonPointees = totalCharges - chargesPointees
  const revenusNonPointes = totalRevenus - revenusPointes

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Euro className="w-5 h-5 mr-2" />
              Résumé
            </h2>
            <button
              onClick={resetPointage}
              disabled={saving}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm"
            >
              Remettre le pointage à zéro
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Colonne Totaux */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 mb-2">Totaux</h3>
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
            
            {/* Colonne Pointage */}
            <div className="space-y-3 border-l pl-6">
              <h3 className="font-semibold text-gray-700 mb-2">Pointage</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenus pointés</span>
                <span className="text-lg font-semibold text-green-600">+{revenusPointes.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Charges pointées</span>
                <span className="text-lg font-semibold text-red-600">-{chargesPointees.toFixed(2)} €</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Reste à pointer (revenus)</span>
                  <span>+{revenusNonPointes.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <span>Reste à pointer (charges)</span>
                  <span>-{chargesNonPointees.toFixed(2)} €</span>
                </div>
              </div>
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
              <div key={index} className="bg-green-50 p-3 rounded-lg">
                {editingRevenuIndex === index && editRevenuData ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editRevenuData.nom}
                      onChange={(e) => setEditRevenuData({ ...editRevenuData, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nom du revenu"
                    />
                    <input
                      type="number"
                      value={editRevenuData.montant}
                      onChange={(e) => setEditRevenuData({ ...editRevenuData, montant: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Montant"
                      step="0.01"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEditRevenu} disabled={saving} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Valider
                      </button>
                      <button onClick={cancelEditRevenu} disabled={saving} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center gap-2">
                        <X className="w-4 h-4" />
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={revenu.pointe || false}
                        onChange={() => togglePointeRevenu(index)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${revenu.pointe ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {revenu.nom}
                        </div>
                        <div className={`text-sm ${revenu.pointe ? 'text-gray-400' : 'text-gray-600'}`}>
                          {revenu.montant.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditRevenu(index)} disabled={saving} className="text-blue-500 hover:text-blue-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => removeRevenu(index)} disabled={saving} className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
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
              <div key={index} className="bg-red-50 p-3 rounded-lg">
                {editingChargeIndex === index && editChargeData ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editChargeData.nom}
                      onChange={(e) => setEditChargeData({ ...editChargeData, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nom de la charge"
                    />
                    <input
                      type="number"
                      value={editChargeData.montant}
                      onChange={(e) => setEditChargeData({ ...editChargeData, montant: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Montant"
                      step="0.01"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEditCharge} disabled={saving} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Valider
                      </button>
                      <button onClick={cancelEditCharge} disabled={saving} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center gap-2">
                        <X className="w-4 h-4" />
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={charge.pointe || false}
                        onChange={() => togglePointeCharge(index)}
                        className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${charge.pointe ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {charge.nom}
                        </div>
                        <div className={`text-sm ${charge.pointe ? 'text-gray-400' : 'text-gray-600'}`}>
                          {charge.montant.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditCharge(index)} disabled={saving} className="text-blue-500 hover:text-blue-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => removeCharge(index)} disabled={saving} className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
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
