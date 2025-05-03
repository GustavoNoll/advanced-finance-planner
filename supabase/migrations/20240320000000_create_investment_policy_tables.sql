-- Tabela principal de políticas de investimento
CREATE TABLE investment_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Informações profissionais
CREATE TABLE professional_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES investment_policies(id) ON DELETE CASCADE,
    occupation TEXT NOT NULL,
    work_description TEXT NOT NULL,
    work_location TEXT NOT NULL,
    work_regime TEXT NOT NULL CHECK (work_regime IN ('pj', 'clt', 'public_servant')),
    tax_declaration_method TEXT NOT NULL CHECK (tax_declaration_method IN ('simplified', 'complete', 'exempt')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Estrutura familiar
CREATE TABLE family_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES investment_policies(id) ON DELETE CASCADE,
    marital_status TEXT,
    spouse_name TEXT,
    spouse_birth_date DATE,
    has_children BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Filhos
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_structure_id UUID REFERENCES family_structures(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orçamento
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES investment_policies(id) ON DELETE CASCADE,
    incomes JSONB DEFAULT '[]'::jsonb,
    expenses JSONB DEFAULT '[]'::jsonb,
    bonus DECIMAL(15,2) DEFAULT 0,
    dividends DECIMAL(15,2) DEFAULT 0,
    savings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Situação patrimonial
CREATE TABLE patrimonial_situations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES investment_policies(id) ON DELETE CASCADE,
    investments JSONB DEFAULT '{
        "properties": [],
        "liquid_investments": [],
        "participations": []
    }'::jsonb,
    personal_assets JSONB DEFAULT '{
        "properties": [],
        "vehicles": [],
        "valuable_goods": []
    }'::jsonb,
    liabilities JSONB DEFAULT '{
        "financing": [],
        "debts": []
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Informações de vida
CREATE TABLE life_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES investment_policies(id) ON DELETE CASCADE,
    life_stage TEXT NOT NULL CHECK (life_stage IN ('accumulation', 'enjoyment', 'consolidation')),
    hobbies JSONB DEFAULT '[]'::jsonb,
    objectives JSONB DEFAULT '[]'::jsonb,
    insurances JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Preferências de investimento
CREATE TABLE investment_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES investment_policies(id) ON DELETE CASCADE,
    target_return_review TEXT,
    max_bond_maturity TEXT,
    fgc_event_feeling TEXT,
    max_fund_liquidity TEXT,
    max_acceptable_loss TEXT,
    target_return_ipca_plus TEXT,
    stock_investment_mode TEXT,
    real_estate_funds_mode TEXT,
    platforms_used JSONB DEFAULT '[]'::jsonb,
    asset_restrictions JSONB DEFAULT '[]'::jsonb,
    areas_of_interest JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar o updated_at
CREATE TRIGGER update_investment_policies_updated_at
    BEFORE UPDATE ON investment_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_information_updated_at
    BEFORE UPDATE ON professional_information
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_structures_updated_at
    BEFORE UPDATE ON family_structures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at
    BEFORE UPDATE ON children
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patrimonial_situations_updated_at
    BEFORE UPDATE ON patrimonial_situations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_life_information_updated_at
    BEFORE UPDATE ON life_information
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_preferences_updated_at
    BEFORE UPDATE ON investment_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();