-- Budget Familial - Supabase Schema
-- À exécuter dans l'éditeur SQL de Supabase

-- Table pour les budgets individuels (Benoit et Marine)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personne VARCHAR(50) NOT NULL UNIQUE,
  charges JSONB DEFAULT '[]'::jsonb,
  revenus JSONB DEFAULT '[]'::jsonb,
  virement_famille DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour Hello Bank
CREATE TABLE IF NOT EXISTS hellobank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  revenus JSONB DEFAULT '[]'::jsonb,
  depenses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour Sumeria
CREATE TABLE IF NOT EXISTS sumeria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  depenses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour BRED
CREATE TABLE IF NOT EXISTS bred (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  revenus JSONB DEFAULT '[]'::jsonb,
  depenses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur la colonne personne pour les budgets
CREATE INDEX IF NOT EXISTS idx_budgets_personne ON budgets(personne);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hellobank_updated_at BEFORE UPDATE ON hellobank
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sumeria_updated_at BEFORE UPDATE ON sumeria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bred_updated_at BEFORE UPDATE ON bred
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer une ligne par défaut pour chaque compte joint (si elle n'existe pas)
INSERT INTO hellobank (id, revenus, depenses) 
VALUES ('00000000-0000-0000-0000-000000000001', '[]'::jsonb, '[]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO sumeria (id, depenses) 
VALUES ('00000000-0000-0000-0000-000000000002', '[]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO bred (id, revenus, depenses) 
VALUES ('00000000-0000-0000-0000-000000000003', '[]'::jsonb, '[]'::jsonb)
ON CONFLICT DO NOTHING;

-- Commentaires pour documentation
COMMENT ON TABLE budgets IS 'Budgets individuels de Benoit et Marine';
COMMENT ON TABLE hellobank IS 'Compte joint Hello Bank';
COMMENT ON TABLE sumeria IS 'Compte joint Sumeria';
COMMENT ON TABLE bred IS 'Compte joint BRED avec virements famille';
