-- Add payment_mode to financial_goals table
ALTER TABLE financial_goals 
ADD COLUMN payment_mode TEXT NOT NULL DEFAULT 'none';

-- Add payment_mode to events table
ALTER TABLE events 
ADD COLUMN payment_mode TEXT NOT NULL DEFAULT 'none';

-- Create indexes for better query performance
CREATE INDEX idx_financial_goals_payment_mode ON financial_goals(payment_mode);
CREATE INDEX idx_events_payment_mode ON events(payment_mode);

-- Migrate existing data
UPDATE financial_goals 
SET payment_mode = CASE 
    WHEN installment_project = true THEN 'installment'
    ELSE 'none'
END;

UPDATE events 
SET payment_mode = CASE 
    WHEN installment_project = true THEN 'installment'
    ELSE 'none'
END;

-- Add check constraints to ensure valid values
ALTER TABLE financial_goals 
ADD CONSTRAINT financial_goals_payment_mode_check 
CHECK (payment_mode IN ('none', 'installment', 'repeat'));

ALTER TABLE events 
ADD CONSTRAINT events_payment_mode_check 
CHECK (payment_mode IN ('none', 'installment', 'repeat'));

-- Remove old column after migration
ALTER TABLE financial_goals DROP COLUMN installment_project;
ALTER TABLE events DROP COLUMN installment_project; 