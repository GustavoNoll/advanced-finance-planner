-- Remove calculated fields from investment_plans table
-- These fields are now calculated dynamically using MicroPlanCalculations

-- First, drop the view that depends on these columns
DROP VIEW IF EXISTS user_profiles_investment CASCADE;

-- Remove the calculated fields that are no longer needed
ALTER TABLE investment_plans 
DROP COLUMN IF EXISTS future_value,
DROP COLUMN IF EXISTS present_future_value,
DROP COLUMN IF EXISTS inflation_adjusted_income,
DROP COLUMN IF EXISTS required_monthly_deposit;

-- Recreate the view with active micro plan data
CREATE VIEW user_profiles_investment AS
WITH last_financial_record AS (
         SELECT DISTINCT ON (ufr_1.user_id) ufr_1.id,
            ufr_1.user_id,
            ufr_1.record_year,
            ufr_1.record_month,
            ufr_1.starting_balance,
            ufr_1.monthly_contribution,
            ufr_1.monthly_return_rate,
            ufr_1.ending_balance,
            ufr_1.growth_percentage,
            ufr_1.target_rentability,
            ufr_1.created_at,
            ufr_1.monthly_return
           FROM user_financial_records ufr_1
          ORDER BY ufr_1.user_id, ufr_1.record_year DESC, ufr_1.record_month DESC, ufr_1.created_at DESC
        ), financial_metrics AS (
         SELECT ufr_1.user_id,
            count(*) AS total_records,
            sum(ufr_1.monthly_contribution) AS total_contributions,
            sum(ufr_1.ending_balance - ufr_1.starting_balance) AS total_returns,
            avg(ufr_1.monthly_return_rate) AS average_monthly_return_rate,
            max(ufr_1.created_at) AS last_activity_date,
                CASE
                    WHEN max(ufr_1.created_at) < (now() - '6 mons'::interval) THEN true
                    ELSE false
                END AS is_inactive
           FROM user_financial_records ufr_1
          GROUP BY ufr_1.user_id
        ), active_micro_plans AS (
         SELECT DISTINCT ON (mip.life_investment_plan_id) 
            mip.life_investment_plan_id,
            mip.id as micro_plan_id,
            mip.monthly_deposit,
            mip.desired_income,
            mip.expected_return,
            mip.inflation,
            mip.effective_date,
            mip.created_at as micro_plan_created_at
           FROM micro_investment_plans mip
          WHERE mip.effective_date <= CURRENT_DATE
          ORDER BY mip.life_investment_plan_id, mip.effective_date DESC, mip.created_at DESC
        ), plan_metrics AS (
         SELECT ip.user_id,
            ip.created_at AS last_plan_review_date,
            ip.created_at + '1 year'::interval AS next_plan_review_date,
                CASE
                    WHEN (ip.final_age::numeric - EXTRACT(year FROM age(now(), p_1.birth_date::timestamp with time zone))) <= 5::numeric THEN true
                    ELSE false
                END AS near_retirement,
                CASE
                    WHEN amp.monthly_deposit > COALESCE(lfr.monthly_contribution, 0::numeric) THEN true
                    ELSE false
                END AS below_required_contribution
           FROM investment_plans ip
             JOIN profiles p_1 ON ip.user_id = p_1.id
             LEFT JOIN last_financial_record lfr ON ip.user_id = lfr.user_id
             LEFT JOIN active_micro_plans amp ON ip.id = amp.life_investment_plan_id
        )
 SELECT u.id,
    u.email,
    p.id AS profile_id,
    p.is_broker,
    p.name AS profile_name,
    p.broker_id,
    p.birth_date,
    i.id AS investment_plan_id,
    amp.micro_plan_id,
    amp.monthly_deposit AS current_monthly_deposit,
    amp.desired_income AS current_desired_income,
    amp.expected_return AS current_expected_return,
    amp.inflation AS current_inflation,
    amp.effective_date AS micro_plan_effective_date,
    amp.micro_plan_created_at,
    ufr.id AS financial_record_id,
    ufr.record_year,
    ufr.record_month,
    ufr.starting_balance,
    ufr.monthly_contribution,
    ufr.monthly_return_rate,
    ufr.ending_balance,
    ufr.growth_percentage,
    ufr.target_rentability,
    ufr.created_at AS financial_created_at,
    fm.total_records,
    fm.total_contributions,
    fm.total_returns,
    fm.average_monthly_return_rate,
    fm.last_activity_date,
    fm.is_inactive,
    pm.last_plan_review_date,
    pm.next_plan_review_date,
    pm.near_retirement,
    pm.below_required_contribution,
        CASE
            WHEN ufr.created_at IS NULL THEN true
            WHEN ufr.created_at < (now() - '1 mon'::interval) THEN true
            ELSE false
        END AS needs_plan_review,
        CASE
            WHEN ufr.record_month IS NULL OR ufr.record_year IS NULL THEN NULL::numeric
            ELSE EXTRACT(month FROM age(now(), make_date(ufr.record_year, ufr.record_month, 1)::timestamp with time zone))
        END AS months_without_records,
        CASE
            WHEN ufr.monthly_return_rate < 0.5 THEN true
            ELSE false
        END AS has_low_returns
   FROM auth.users u
     JOIN profiles p ON u.id = p.id
     LEFT JOIN investment_plans i ON u.id = i.user_id
     LEFT JOIN active_micro_plans amp ON i.id = amp.life_investment_plan_id
     LEFT JOIN last_financial_record ufr ON u.id = ufr.user_id
     LEFT JOIN financial_metrics fm ON u.id = fm.user_id
     LEFT JOIN plan_metrics pm ON u.id = pm.user_id
  WHERE p.is_broker = false AND p.id IS NOT NULL;

-- Add comment to document the change
COMMENT ON TABLE investment_plans IS 'Investment plans with calculated fields removed - calculations now done dynamically using MicroPlanCalculations';
COMMENT ON VIEW user_profiles_investment IS 'View combining user profiles with their active investment plans and current micro plan data (micro plan with effective_date <= current_date, ordered by most recent)';
