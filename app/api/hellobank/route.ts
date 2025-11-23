import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncVirementRecurrent } from '@/lib/virementSync'

const HELLOBANK_ID = '00000000-0000-0000-0000-000000000001'

export async function GET() {
  try {
    const { data: helloBank, error } = await supabase
      .from('hellobank')
      .select('*')
      .eq('id', HELLOBANK_ID)
      .single()

    if (error) throw error

    return NextResponse.json(helloBank)
  } catch (error) {
    console.error('Error fetching HelloBank:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Synchroniser les virements récurrents vers d'autres comptes
    if (body.depenses && Array.isArray(body.depenses)) {
      for (const depense of body.depenses) {
        await syncVirementRecurrent(depense, 'hellobank')
      }
    }

    const { data: helloBank, error } = await supabase
      .from('hellobank')
      .update({
        depenses: body.depenses,
        revenus: body.revenus
      })
      .eq('id', HELLOBANK_ID)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(helloBank)
  } catch (error) {
    console.error('Error updating HelloBank:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
