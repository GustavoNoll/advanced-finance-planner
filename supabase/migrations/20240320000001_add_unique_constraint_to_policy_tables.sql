-- Adiciona restrições únicas para policy_id em todas as tabelas relacionadas
ALTER TABLE professional_information
ADD CONSTRAINT professional_information_policy_id_unique UNIQUE (policy_id);

ALTER TABLE family_structures
ADD CONSTRAINT family_structures_policy_id_unique UNIQUE (policy_id);

ALTER TABLE budgets
ADD CONSTRAINT budgets_policy_id_unique UNIQUE (policy_id);

ALTER TABLE patrimonial_situations
ADD CONSTRAINT patrimonial_situations_policy_id_unique UNIQUE (policy_id);

ALTER TABLE life_information
ADD CONSTRAINT life_information_policy_id_unique UNIQUE (policy_id);

ALTER TABLE investment_preferences
ADD CONSTRAINT investment_preferences_policy_id_unique UNIQUE (policy_id); 