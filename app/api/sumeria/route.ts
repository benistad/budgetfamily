import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncVirementRecurrent } from '@/lib/virementSync'

const SUMERIA_ID = '00000000-0000-0000-0000-000000000002'

export async function GET() {
  try {
    const { data: sumeria, error } = await supabase
      .from('sumeria')
      .select('*')
      .eq('id', SUMERIA_ID)
      .single()

    if (error) throw error

    return NextResponse.json(sumeria)
  } catch (error) {
    console.error('Error fetching Sumeria:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Synchroniser les virements récurrents vers d'autres comptes
    if (body.depenses && Array.isArray(body.depenses)) {
      for (const depense of body.depenses) {
        await syncVirementRecurrent(depense, 'sumeria')
      }
    }

    const { data: sumeria, error } = await supabase
      .from('sumeria')
      .update({ 
        depenses: body.depenses
      })
      .eq('id', SUMERIA_ID)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(sumeria)
  } catch (error) {
    console.error('Error updating Sumeria:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
