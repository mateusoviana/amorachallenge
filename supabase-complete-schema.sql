-- ================================
-- SCHEMA COMPLETO aMORA
-- ================================

-- ================================
-- ENUMs
-- ================================
DO $$ BEGIN
CREATE TYPE user_type_enum AS ENUM ('buyer', 'realtor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
CREATE TYPE group_role_enum AS ENUM ('admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ================================
-- Tabela de usuários
-- ================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL DEFAULT 'senha123',
    user_type user_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- Tabela de grupos
-- ================================
CREATE TABLE IF NOT EXISTS groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- Tabela de membros dos grupos
-- ================================
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role group_role_enum DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- ================================
-- Tabela de apartamentos
-- ================================
CREATE TABLE IF NOT EXISTS apartments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    condominium_fee INTEGER DEFAULT 0,
    iptu INTEGER DEFAULT 0,
    address VARCHAR NOT NULL,
    neighborhood VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    state VARCHAR(2) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    parking_spaces INTEGER NOT NULL,
    area DECIMAL(8,2) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- Relacionamento apartamento-grupo
-- ================================
CREATE TABLE IF NOT EXISTS apartment_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(apartment_id, group_id)
);

-- ================================
-- Tabela de reações de apartamentos
-- ================================
CREATE TABLE IF NOT EXISTS apartment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL CHECK (reaction IN ('love', 'like', 'unsure', 'dislike', 'hate')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que cada usuário só pode ter uma reação por apartamento por grupo
    UNIQUE(apartment_id, group_id, user_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_apartment_reactions_apartment_group 
ON apartment_reactions(apartment_id, group_id);

CREATE INDEX IF NOT EXISTS idx_apartment_reactions_user 
ON apartment_reactions(user_id);

-- Desabilitar RLS para simplificar (não usando auth do Supabase)
ALTER TABLE apartment_reactions DISABLE ROW LEVEL SECURITY;

-- ================================
-- Tabela de comentários de apartamentos
-- ================================
CREATE TABLE IF NOT EXISTS apartment_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_apartment_comments_apartment_group 
ON apartment_comments(apartment_id, group_id);

CREATE INDEX IF NOT EXISTS idx_apartment_comments_user 
ON apartment_comments(user_id);

-- Desabilitar RLS para simplificar
ALTER TABLE apartment_comments DISABLE ROW LEVEL SECURITY;

-- ================================
-- Tabela de critérios de alerta
-- ================================
CREATE TABLE IF NOT EXISTS alert_criteria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    price_min DECIMAL(12,2),
    price_max DECIMAL(12,2),
    area_min DECIMAL(8,2),
    area_max DECIMAL(8,2),
    bedrooms INTEGER[],
    bathrooms INTEGER[],
    parking_spaces INTEGER[],
    cities TEXT[],
    neighborhoods TEXT[],
    email_notifications BOOLEAN DEFAULT true,
    whatsapp_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- Tabela de matches de alerta
-- ================================
CREATE TABLE IF NOT EXISTS alert_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id UUID NOT NULL REFERENCES alert_criteria(id) ON DELETE CASCADE,
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    match_score INTEGER DEFAULT 100,
    notification_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    whatsapp_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(alert_id, apartment_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_alert_criteria_user ON alert_criteria(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_matches_alert ON alert_matches(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_matches_apartment ON alert_matches(apartment_id);

-- Desabilitar RLS
ALTER TABLE alert_criteria DISABLE ROW LEVEL SECURITY;
ALTER TABLE alert_matches DISABLE ROW LEVEL SECURITY;

-- ================================
-- Função e triggers de updated_at
-- ================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apartments_updated_at ON apartments;
CREATE TRIGGER update_apartments_updated_at
    BEFORE UPDATE ON apartments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apartment_reactions_updated_at ON apartment_reactions;
CREATE TRIGGER update_apartment_reactions_updated_at
    BEFORE UPDATE ON apartment_reactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apartment_comments_updated_at ON apartment_comments;
CREATE TRIGGER update_apartment_comments_updated_at
    BEFORE UPDATE ON apartment_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_alert_criteria_updated_at ON alert_criteria;
CREATE TRIGGER update_alert_criteria_updated_at
    BEFORE UPDATE ON alert_criteria
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- Comentários das colunas
-- ================================
COMMENT ON COLUMN apartments.condominium_fee IS 'Taxa de condomínio mensal em reais';
COMMENT ON COLUMN apartments.iptu IS 'Valor do IPTU anual em reais';

-- ================================
-- Dados de teste
-- ================================
INSERT INTO users (name, email, password, user_type) VALUES
('João Silva', 'joao@email.com', 'senha123', 'realtor'),
('Maria Santos', 'maria@email.com', 'senha123', 'buyer'),
('Pedro Oliveira', 'pedro@email.com', 'senha123', 'buyer'),
('Ana Costa', 'ana@email.com', 'senha123', 'realtor')
ON CONFLICT (email) DO UPDATE SET 
  password = EXCLUDED.password,
  user_type = EXCLUDED.user_type;