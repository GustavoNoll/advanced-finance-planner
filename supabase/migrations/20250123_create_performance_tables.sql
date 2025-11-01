-- Consolidated performance table
CREATE TABLE consolidated_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  institution TEXT,
  report_date TEXT,
  period TEXT,
  initial_assets NUMERIC,
  movement NUMERIC,
  taxes NUMERIC,
  final_assets NUMERIC,
  financial_gain NUMERIC,
  yield NUMERIC,
  CONSTRAINT consolidated_performance_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Performance data table
CREATE TABLE performance_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  institution TEXT,
  report_date TEXT,
  asset TEXT,
  position NUMERIC,
  asset_class TEXT,
  rate TEXT,
  maturity_date DATE,
  issuer TEXT,
  period TEXT,
  yield NUMERIC,
  CONSTRAINT performance_data_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Triggers to update updated_at
CREATE TRIGGER update_consolidated_performance_updated_at
    BEFORE UPDATE ON consolidated_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_data_updated_at
    BEFORE UPDATE ON performance_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes to improve query performance
CREATE INDEX idx_consolidated_performance_profile_id ON consolidated_performance(profile_id);
CREATE INDEX idx_consolidated_performance_period ON consolidated_performance(period);
CREATE INDEX idx_performance_data_profile_id ON performance_data(profile_id);
CREATE INDEX idx_performance_data_period ON performance_data(period);
CREATE INDEX idx_performance_data_report_date ON performance_data(report_date);

