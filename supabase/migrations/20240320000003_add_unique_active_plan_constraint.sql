-- Adicionar constraint única para garantir apenas um plano ativo por usuário
-- Esta constraint será aplicada apenas para planos
ALTER TABLE public.investment_plans
ADD CONSTRAINT unique_plan_per_user 
UNIQUE (user_id);

-- Comentário explicativo
COMMENT ON CONSTRAINT unique_plan_per_user ON public.investment_plans IS 
'Garante que cada usuário tenha apenas um plano de investimento.';
