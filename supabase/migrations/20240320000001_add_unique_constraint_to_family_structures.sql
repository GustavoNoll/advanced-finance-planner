-- Adiciona restrição única para policy_id na tabela family_structures
ALTER TABLE family_structures
ADD CONSTRAINT family_structures_policy_id_unique UNIQUE (policy_id); 