import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const BRED_ID = '00000000-0000-0000-0000-000000000003'

export async function GET() {
  try {
    // Récupérer les virements famille de Benoit et Marine
    const { data: benoitBudget } = await supabase
      .from('budgets')
      .select('virement_famille')
      .eq('personne', 'benoit')
      .single()

    const { data: marineBudget } = await supabase
      .from('budgets')
      .select('virement_famille')
      .eq('personne', 'marine')
      .single()

    // Récupérer le compte BRED
    const { data: bred, error } = await supabase
      .from('bred')
      .select('*')
      .eq('id', BRED_ID)
      .single()

    if (error) throw error

    // Synchroniser les virements famille
    const updatedRevenus = Array.isArray(bred.revenus) ? [...bred.revenus] : []
    
    // Mettre à jour ou ajouter le virement de Benoit
    const benoitIndex = updatedRevenus.findIndex((r: any) => r.nom === 'Virement Famille Benoit')
    if (benoitBudget && benoitBudget.virement_famille > 0) {
      if (benoitIndex >= 0) {
        updatedRevenus[benoitIndex].montant = benoitBudget.virement_famille
      } else {
        updatedRevenus.push({
          nom: 'Virement Famille Benoit',
          montant: benoitBudget.virement_famille,
          date: new Date().toISOString()
        })
      }
    }
    
    // Mettre à jour ou ajouter le virement de Marine
    const marineIndex = updatedRevenus.findIndex((r: any) => r.nom === 'Virement Famille Marine')
    if (marineBudget && marineBudget.virement_famille > 0) {
      if (marineIndex >= 0) {
        updatedRevenus[marineIndex].montant = marineBudget.virement_famille
      } else {
        updatedRevenus.push({
          nom: 'Virement Famille Marine',
          montant: marineBudget.virement_famille,
          date: new Date().toISOString()
        })
      }
    }
    
    // Mettre à jour les revenus si nécessaire
    if (JSON.stringify(bred.revenus) !== JSON.stringify(updatedRevenus)) {
      const { data: updatedBred } = await supabase
        .from('bred')
        .update({ revenus: updatedRevenus })
        .eq('id', BRED_ID)
        .select()
        .single()
      
      return NextResponse.json(updatedBred)
    }

    return NextResponse.json(bred)
  } catch (error) {
    console.error('Error fetching Bred:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: bred, error } = await supabase
      .from('bred')
      .update({ 
        depenses: body.depenses,
        revenus: body.revenus
      })
      .eq('id', BRED_ID)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(bred)
  } catch (error) {
    console.error('Error updating Bred:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
