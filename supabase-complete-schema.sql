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