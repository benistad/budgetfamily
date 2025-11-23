import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { personne: string } }
) {
  try {
    const { personne } = params

    if (personne !== 'benoit' && personne !== 'marine') {
      return NextResponse.json({ error: 'Personne invalide' }, { status: 400 })
    }

    // Chercher le budget existant
    let { data: budget, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('personne', personne)
      .single()

    // Si pas trouvé, créer un nouveau budget
    if (error && error.code === 'PGRST116') {
      const { data: newBudget, error: insertError } = await supabase
        .from('budgets')
        .insert({
          personne,
          charges: [],
          revenus: [],
          virement_famille: 0
        })
        .select()
        .single()

      if (insertError) throw insertError
      budget = newBudget
    } else if (error) {
      throw error
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { personne: string } }
) {
  try {
    const { personne } = params
    const body = await request.json()

    if (personne !== 'benoit' && personne !== 'marine') {
      return NextResponse.json({ error: 'Personne invalide' }, { status: 400 })
    }

    // Upsert: update si existe, insert sinon
    const { data: budget, error } = await supabase
      .from('budgets')
      .upsert({
        personne,
        charges: body.charges,
        revenus: body.revenus,
        virement_famille: body.virementFamille
      }, {
        onConflict: 'personne'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
