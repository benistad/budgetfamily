import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Keep-alive endpoint pour maintenir la base Supabase active.
 * Les projets Supabase gratuits sont mis en pause après 7 jours d'inactivité.
 * 
 * Configurez un cron job externe (cron-job.org, UptimeRobot, GitHub Actions)
 * pour appeler cette route toutes les 24h ou moins.
 * 
 * Exemple avec cron-job.org:
 * - URL: https://votre-domaine.com/api/keep-alive
 * - Méthode: GET
 * - Fréquence: Toutes les 24 heures
 */
// Support HEAD pour UptimeRobot et autres services de monitoring
export async function HEAD() {
  return new Response(null, { status: 200 })
}

export async function GET() {
  try {
    // Requête simple pour garder la connexion active
    const { data, error } = await supabase
      .from('transactions')
      .select('id')
      .limit(1)

    if (error) {
      console.error('[Keep-Alive] Erreur Supabase:', error.message)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    console.log('[Keep-Alive] Ping Supabase réussi')
    return NextResponse.json({
      success: true,
      message: 'Supabase is alive',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Keep-Alive] Erreur:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
