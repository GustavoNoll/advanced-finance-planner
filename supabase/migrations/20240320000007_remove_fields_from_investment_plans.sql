-- Remove campos monthly_deposit, desired_income, expected_return, inflation da tabela investment_plans
-- Estes campos agora estão na tabela micro_investment_plans

-- Remover as colunas da tabela investment_plans
ALTER TABLE investment_plans 
DROP COLUMN IF EXISTS monthly_deposit,
DROP COLUMN IF EXISTS desired_income,
DROP COLUMN IF EXISTS expected_return,
DROP COLUMN IF EXISTS inflation;

-- Comentário explicativo
COMMENT ON TABLE investment_plans IS 'Tabela principal de planos de investimento. Os campos monthly_deposit, desired_income, expected_return e inflation foram movidos para micro_investment_plans para permitir múltiplas configurações ao longo do tempo.';
