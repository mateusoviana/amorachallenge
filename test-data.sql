-- Inserir usuários de teste
INSERT INTO users (name, email, password, user_type) VALUES
('João Silva', 'joao@teste.com', 'senha123', 'buyer'),
('Maria Santos', 'maria@teste.com', 'senha123', 'realtor'),
('Pedro Costa', 'pedro@teste.com', 'senha123', 'buyer');

-- Inserir grupos de teste
INSERT INTO groups (name, description, is_public, admin_id) VALUES
('Grupo Familiar', 'Imóveis compartilhados com a família', false, (SELECT id FROM users WHERE email = 'joao@teste.com')),
('Investimentos', 'Portfólio de investimentos imobiliários', false, (SELECT id FROM users WHERE email = 'maria@teste.com'));

-- Inserir membros nos grupos
INSERT INTO group_members (group_id, user_id, role) VALUES
((SELECT id FROM groups WHERE name = 'Grupo Familiar'), (SELECT id FROM users WHERE email = 'joao@teste.com'), 'admin'),
((SELECT id FROM groups WHERE name = 'Investimentos'), (SELECT id FROM users WHERE email = 'maria@teste.com'), 'admin'),
((SELECT id FROM groups WHERE name = 'Investimentos'), (SELECT id FROM users WHERE email = 'pedro@teste.com'), 'member');

-- Inserir apartamentos de teste
INSERT INTO apartments (title, description, price, address, neighborhood, city, state, bedrooms, bathrooms, parking_spaces, area, is_public, owner_id, images) VALUES
('Apartamento Moderno no Centro', 'Apartamento recém-reformado com acabamento de luxo', 450000, 'Rua das Flores, 123', 'Centro', 'São Paulo', 'SP', 2, 2, 1, 75, false, (SELECT id FROM users WHERE email = 'joao@teste.com'), ARRAY['https://via.placeholder.com/300x200']),
('Cobertura Duplex', 'Cobertura com vista panorâmica da cidade', 1200000, 'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP', 3, 3, 2, 120, true, (SELECT id FROM users WHERE email = 'maria@teste.com'), ARRAY['https://via.placeholder.com/300x200']);

-- Relacionar apartamentos com grupos
INSERT INTO apartment_groups (apartment_id, group_id) VALUES
((SELECT id FROM apartments WHERE title = 'Apartamento Moderno no Centro'), (SELECT id FROM groups WHERE name = 'Grupo Familiar')),
((SELECT id FROM apartments WHERE title = 'Cobertura Duplex'), (SELECT id FROM groups WHERE name = 'Investimentos'));