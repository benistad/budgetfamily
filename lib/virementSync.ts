import { supabase } from './supabase'

const HELLOBANK_ID = '00000000-0000-0000-0000-000000000001'
const SUMERIA_ID = '00000000-0000-0000-0000-000000000002'
const BRED_ID = '00000000-0000-0000-0000-000000000003'

interface Depense {
  nom: string
  montant: number
  type: string
  date: string
  compteDestination?: string
}

interface Revenu {
  nom: string
  montant: number
  date: string
}

/**
 * Synchronise les virements récurrents entre comptes
 * Ajoute automatiquement un revenu dans le compte destination
 */
export async function syncVirementRecurrent(
  depense: Depense,
  compteSource: 'hellobank' | 'sumeria' | 'bred'
) {
  // Ne synchroniser que si c'est un virement récurrent avec une destination
  if (depense.type !== 'virement_recurrent' || !depense.compteDestination || depense.compteDestination === 'aucun') {
    return
  }

  const destination = depense.compteDestination
  const revenuName = `Virement de ${compteSource.toUpperCase()}: ${depense.nom}`

  try {
    if (destination === 'hellobank' || destination === 'sumeria' || destination === 'bred') {
      // Destination est un compte joint
      const tableId = destination === 'hellobank' ? HELLOBANK_ID : 
                      destination === 'sumeria' ? SUMERIA_ID : BRED_ID

      // Récupérer le compte destination
      const { data: compte, error: fetchError } = await supabase
        .from(destination)
        .select('*')
        .eq('id', tableId)
        .single()

      if (fetchError) throw fetchError

      // Vérifier si le revenu existe déjà
      const revenus = compte.revenus || []
      const existingIndex = revenus.findIndex((r: Revenu) => r.nom === revenuName)

      let updatedRevenus
      if (existingIndex >= 0) {
        // Mettre à jour le revenu existant
        updatedRevenus = [...revenus]
        updatedRevenus[existingIndex] = {
          nom: revenuName,
          montant: depense.montant,
          date: depense.date
        }
      } else {
        // Ajouter un nouveau revenu
        updatedRevenus = [...revenus, {
          nom: revenuName,
          montant: depense.montant,
          date: depense.date
        }]
      }

      // Mettre à jour le compte destination
      await supabase
        .from(destination)
        .update({ revenus: updatedRevenus })
        .eq('id', tableId)

    } else if (destination === 'benoit' || destination === 'marine') {
      // Destination est un budget personnel
      const { data: budget, error: fetchError } = await supabase
        .from('budgets')
        .select('*')
        .eq('personne', destination)
        .single()

      if (fetchError) throw fetchError

      // Vérifier si le revenu existe déjà
      const revenus = budget.revenus || []
      const existingIndex = revenus.findIndex((r: Revenu) => r.nom === revenuName)

      let updatedRevenus
      if (existingIndex >= 0) {
        // Mettre à jour le revenu existant
        updatedRevenus = [...revenus]
        updatedRevenus[existingIndex] = {
          nom: revenuName,
          montant: depense.montant,
          date: depense.date
        }
      } else {
        // Ajouter un nouveau revenu
        updatedRevenus = [...revenus, {
          nom: revenuName,
          montant: depense.montant,
          date: depense.date
        }]
      }

      // Mettre à jour le budget personnel
      await supabase
        .from('budgets')
        .update({ revenus: updatedRevenus })
        .eq('personne', destination)
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation du virement:', error)
    // Ne pas bloquer l'opération principale en cas d'erreur
  }
}

/**
 * Nettoie les revenus automatiques d'un compte quand un virement est supprimé
 */
export async function cleanupVirementRecurrent(
  depense: Depense,
  compteSource: 'hellobank' | 'sumeria' | 'bred'
) {
  if (depense.type !== 'virement_recurrent' || !depense.compteDestination || depense.compteDestination === 'aucun') {
    return
  }

  const destination = depense.compteDestination
  const revenuName = `Virement de ${compteSource.toUpperCase()}: ${depense.nom}`

  try {
    if (destination === 'hellobank' || destination === 'sumeria' || destination === 'bred') {
      const tableId = destination === 'hellobank' ? HELLOBANK_ID : 
                      destination === 'sumeria' ? SUMERIA_ID : BRED_ID

      const { data: compte, error: fetchError } = await supabase
        .from(destination)
        .select('*')
        .eq('id', tableId)
        .single()

      if (fetchError) throw fetchError

      const revenus = compte.revenus || []
      const updatedRevenus = revenus.filter((r: Revenu) => r.nom !== revenuName)

      await supabase
        .from(destination)
        .update({ revenus: updatedRevenus })
        .eq('id', tableId)

    } else if (destination === 'benoit' || destination === 'marine') {
      const { data: budget, error: fetchError } = await supabase
        .from('budgets')
        .select('*')
        .eq('personne', destination)
        .single()

      if (fetchError) throw fetchError

      const revenus = budget.revenus || []
      const updatedRevenus = revenus.filter((r: Revenu) => r.nom !== revenuName)

      await supabase
        .from('budgets')
        .update({ revenus: updatedRevenus })
        .eq('personne', destination)
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage du virement:', error)
  }
}
