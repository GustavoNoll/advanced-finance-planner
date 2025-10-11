-- Enhanced broker dashboard view with advanced metrics
-- This view provides comprehensive data for broker analysis and client management

DROP VIEW IF EXISTS user_profiles_investment CASCADE;

CREATE VIEW user_profiles_investment AS
WITH last_financial_record AS (
    SELECT DISTINCT ON (ufr_1.user_id) 
        ufr_1.id,
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
), 
financial_metrics AS (
    SELECT 
        ufr_1.user_id,
        count(*) AS total_records,
        sum(ufr_1.monthly_contribution) AS total_contributions,
        sum(ufr_1.ending_balance - ufr_1.starting_balance) AS total_returns,
        avg(ufr_1.monthly_return_rate) AS average_monthly_return_rate,
        max(ufr_1.created_at) AS last_activity_date,
        min(ufr_1.created_at) AS first_activity_date,
        -- Advanced performance metrics (monthly_return_rate is stored as percentage, so divide by 100)
        stddev(ufr_1.monthly_return_rate / 100.0) AS return_volatility,
        min(ufr_1.monthly_return_rate / 100.0) AS worst_month_return,
        max(ufr_1.monthly_return_rate / 100.0) AS best_month_return,
        -- Consistency metrics
        count(CASE WHEN ufr_1.monthly_contribution > 0 THEN 1 END) AS months_with_contributions,
        avg(CASE WHEN ufr_1.monthly_contribution > 0 THEN ufr_1.monthly_contribution END) AS avg_contribution_when_contributing,
        -- Risk metrics (monthly_return_rate is stored as percentage, so divide by 100)
        CASE 
            WHEN stddev(ufr_1.monthly_return_rate / 100.0) > 0 
            THEN avg(ufr_1.monthly_return_rate / 100.0) / stddev(ufr_1.monthly_return_rate / 100.0) 
            ELSE 0 
        END AS sharpe_ratio,
        -- Activity status (based on last month's data)
        CASE
            WHEN max(ufr_1.created_at) IS NULL THEN 'inactive'
            WHEN max(ufr_1.created_at) < (now() - '12 mons'::interval) THEN 'inactive'
            WHEN max(ufr_1.created_at) < (now() - '6 mons'::interval) THEN 'at_risk'
            WHEN max(ufr_1.created_at) < (now() - '3 mons'::interval) THEN 'stale'
            ELSE 'active'
        END AS activity_status,
        -- Growth trajectory
        CASE 
            WHEN count(*) >= 3 THEN
                (SELECT ending_balance FROM user_financial_records 
                 WHERE user_id = ufr_1.user_id 
                 ORDER BY record_year DESC, record_month DESC, created_at DESC LIMIT 1) -
                (SELECT ending_balance FROM user_financial_records 
                 WHERE user_id = ufr_1.user_id 
                 ORDER BY record_year ASC, record_month ASC, created_at ASC LIMIT 1)
            ELSE 0
        END AS total_growth,
        -- Recent performance (last 3 months) - monthly_return_rate is stored as percentage
        avg(CASE 
            WHEN ufr_1.created_at >= (now() - '3 mons'::interval) 
            THEN ufr_1.monthly_return_rate / 100.0
        END) AS recent_avg_return,
        -- Contribution consistency
        CASE 
            WHEN count(*) >= 6 THEN
                count(CASE WHEN ufr_1.monthly_contribution > 0 THEN 1 END)::float / count(*)::float
            ELSE 0
        END AS contribution_consistency
    FROM user_financial_records ufr_1
    GROUP BY ufr_1.user_id
), 
active_micro_plans AS (
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
), 
plan_metrics AS (
    SELECT 
        ip.user_id,
        ip.created_at AS last_plan_review_date,
        ip.created_at + '1 year'::interval AS next_plan_review_date,
        ip.plan_type,
        ip.final_age,
        ip.initial_amount,
        ip.currency,
        -- Age and retirement calculations
        EXTRACT(year FROM age(now(), p_1.birth_date::timestamp with time zone)) AS current_age,
        (ip.final_age::numeric - EXTRACT(year FROM age(now(), p_1.birth_date::timestamp with time zone))) AS years_to_retirement,
        CASE
            WHEN (ip.final_age::numeric - EXTRACT(year FROM age(now(), p_1.birth_date::timestamp with time zone))) <= 5::numeric THEN true
            ELSE false
        END AS near_retirement,
        -- Contribution adequacy
        CASE
            WHEN amp.monthly_deposit > COALESCE(lfr.monthly_contribution, 0::numeric) THEN true
            ELSE false
        END AS below_required_contribution,
        -- Plan maturity
        CASE
            WHEN ip.created_at < (now() - '2 years'::interval) THEN 'mature'
            WHEN ip.created_at < (now() - '1 year'::interval) THEN 'established'
            ELSE 'new'
        END AS plan_maturity
    FROM investment_plans ip
    JOIN profiles p_1 ON ip.user_id = p_1.id
    LEFT JOIN last_financial_record lfr ON ip.user_id = lfr.user_id
    LEFT JOIN active_micro_plans amp ON ip.id = amp.life_investment_plan_id
    LEFT JOIN financial_metrics fm ON ip.user_id = fm.user_id
),
-- Client engagement metrics
engagement_metrics AS (
    SELECT 
        p.id as user_id,
        -- Time since last activity
        EXTRACT(epoch FROM (now() - COALESCE(fm.last_activity_date, p.created_at))) / 86400 AS days_since_last_activity,
        -- Engagement score (0-100) based on financial records frequency and contribution consistency
        CASE
            WHEN fm.total_records IS NULL OR fm.total_records = 0 THEN 0
            ELSE LEAST(100, ROUND(
                -- Base score from record frequency (0-60 points)
                (COUNT(CASE WHEN ufr.record_year = EXTRACT(year FROM now()) 
                           AND ufr.record_month >= EXTRACT(month FROM now()) - 5 
                           AND ufr.record_month <= EXTRACT(month FROM now()) - 1
                           THEN 1 END) * 60.0 / 6) +
                -- Bonus for contribution consistency (0-40 points)
                (CASE 
                    WHEN pm.below_required_contribution = false AND fm.contribution_consistency >= 0.8 THEN 40
                    WHEN pm.below_required_contribution = false AND fm.contribution_consistency >= 0.6 THEN 30
                    WHEN pm.below_required_contribution = false AND fm.contribution_consistency >= 0.4 THEN 20
                    WHEN pm.below_required_contribution = false THEN 10
                    ELSE 0
                END), 0
            ))
        END AS engagement_score,
        -- Priority level for broker attention
        CASE
            WHEN fm.last_activity_date IS NULL THEN 'urgent'
            WHEN fm.last_activity_date < (now() - '90 days'::interval) THEN 'high'
            WHEN fm.last_activity_date < (now() - '30 days'::interval) THEN 'medium'
            WHEN pm.below_required_contribution = true THEN 'medium'
            WHEN pm.near_retirement = true THEN 'high'
            ELSE 'low'
        END AS priority_level
    FROM profiles p
    LEFT JOIN financial_metrics fm ON p.id = fm.user_id
    LEFT JOIN plan_metrics pm ON p.id = pm.user_id
    LEFT JOIN user_financial_records ufr ON p.id = ufr.user_id
    WHERE p.is_broker = false
    GROUP BY p.id, fm.last_activity_date, fm.total_records, fm.contribution_consistency, pm.below_required_contribution, pm.near_retirement
)
SELECT 
    u.id,
    u.email,
    p.id AS profile_id,
    p.is_broker,
    p.name AS profile_name,
    p.broker_id,
    p.birth_date,
    p.created_at AS profile_created_at,
    p.last_active_at,
    -- Investment plan data
    i.id AS investment_plan_id,
    amp.micro_plan_id,
    amp.monthly_deposit AS current_monthly_deposit,
    amp.desired_income AS current_desired_income,
    amp.expected_return AS current_expected_return,
    amp.inflation AS current_inflation,
    amp.effective_date AS micro_plan_effective_date,
    amp.micro_plan_created_at,
    -- Financial record data
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
    -- Financial metrics
    fm.total_records,
    fm.total_contributions,
    fm.total_returns,
    fm.average_monthly_return_rate,
    fm.last_activity_date,
    fm.first_activity_date,
    fm.return_volatility,
    fm.worst_month_return,
    fm.best_month_return,
    fm.months_with_contributions,
    fm.avg_contribution_when_contributing,
    fm.sharpe_ratio,
    fm.activity_status,
    fm.total_growth,
    fm.recent_avg_return,
    fm.contribution_consistency,
    -- Plan metrics
    pm.last_plan_review_date,
    pm.next_plan_review_date,
    pm.plan_type,
    pm.final_age,
    pm.initial_amount,
    pm.currency,
    pm.current_age,
    pm.years_to_retirement,
    pm.near_retirement,
    pm.below_required_contribution,
    pm.plan_maturity,
    -- Engagement metrics
    em.days_since_last_activity,
    em.engagement_score,
    em.priority_level,
    -- Legacy fields for backward compatibility
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
    END AS has_low_returns,
    -- Activity status for backward compatibility
    CASE
        WHEN fm.last_activity_date < (now() - '6 mons'::interval) THEN true
        ELSE false
    END AS is_inactive
FROM auth.users u
JOIN profiles p ON u.id = p.id
LEFT JOIN investment_plans i ON u.id = i.user_id
LEFT JOIN active_micro_plans amp ON i.id = amp.life_investment_plan_id
LEFT JOIN last_financial_record ufr ON u.id = ufr.user_id
LEFT JOIN financial_metrics fm ON u.id = fm.user_id
LEFT JOIN plan_metrics pm ON u.id = pm.user_id
LEFT JOIN engagement_metrics em ON u.id = em.user_id
WHERE p.is_broker = false AND p.id IS NOT NULL;

-- Add comprehensive comments
COMMENT ON VIEW user_profiles_investment IS 'Enhanced broker dashboard view with advanced financial metrics, risk analysis, engagement tracking, and client priority levels for comprehensive broker management';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_financial_records_user_id_created_at 
ON user_financial_records(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_micro_investment_plans_life_plan_effective_date 
ON micro_investment_plans(life_investment_plan_id, effective_date DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_broker_id_is_broker 
ON profiles(broker_id, is_broker) WHERE is_broker = false;
