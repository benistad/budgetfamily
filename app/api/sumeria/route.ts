import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

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
