-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TYPE public.license_tier AS ENUM ('demo','premium');
CREATE TYPE public.license_status AS ENUM ('active','pending','revoked');
CREATE TYPE public.indicator_status AS ENUM ('pendiente','en_progreso','preliminar');
CREATE TYPE public.mentor_role AS ENUM ('user','assistant');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  specialty TEXT,
  school_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- LICENSES
CREATE TABLE public.licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  tier public.license_tier NOT NULL DEFAULT 'demo',
  status public.license_status NOT NULL DEFAULT 'active',
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  payment_provider TEXT,
  provider_reference TEXT,
  amount_clp INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.licenses TO authenticated;
GRANT ALL ON public.licenses TO service_role;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "licenses_select_own" ON public.licenses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER licenses_updated_at BEFORE UPDATE ON public.licenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PAYMENT EVENTS (idempotency for future webhooks)
CREATE TABLE public.payment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT,
  email TEXT,
  user_id UUID,
  payload JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- DEMO USAGE
CREATE TABLE public.demo_usage (
  user_id UUID NOT NULL PRIMARY KEY,
  used_count INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER NOT NULL DEFAULT 10,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.demo_usage TO authenticated;
GRANT ALL ON public.demo_usage TO service_role;
ALTER TABLE public.demo_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_usage_select_own" ON public.demo_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER demo_usage_updated_at BEFORE UPDATE ON public.demo_usage FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PORTFOLIO PROJECTS
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT,
  module TEXT,
  course TEXT,
  context_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_own_all" ON public.portfolio_projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PORTFOLIO INDICATORS
CREATE TABLE public.portfolio_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  task TEXT,
  subtask TEXT,
  indicator_code TEXT NOT NULL,
  status public.indicator_status NOT NULL DEFAULT 'pendiente',
  confirmed_content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_indicators TO authenticated;
GRANT ALL ON public.portfolio_indicators TO service_role;
ALTER TABLE public.portfolio_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "indicators_own_all" ON public.portfolio_indicators FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER indicators_updated_at BEFORE UPDATE ON public.portfolio_indicators FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX portfolio_indicators_project_idx ON public.portfolio_indicators(project_id);

-- MENTOR MESSAGES
CREATE TABLE public.mentor_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  indicator_id UUID REFERENCES public.portfolio_indicators(id) ON DELETE SET NULL,
  role public.mentor_role NOT NULL,
  content TEXT NOT NULL,
  model TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.mentor_messages TO authenticated;
GRANT ALL ON public.mentor_messages TO service_role;
ALTER TABLE public.mentor_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select_own" ON public.mentor_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "messages_delete_own" ON public.mentor_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX mentor_messages_user_project_idx ON public.mentor_messages(user_id, project_id, created_at);

-- OFFICIAL DOCUMENTS (structure prepared for future retrieval)
CREATE TABLE public.official_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  specialty TEXT,
  module TEXT,
  task TEXT,
  indicator_code TEXT,
  storage_path TEXT,
  source_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.official_documents TO authenticated;
GRANT ALL ON public.official_documents TO service_role;
ALTER TABLE public.official_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_select_published" ON public.official_documents FOR SELECT TO authenticated USING (is_published);
CREATE POLICY "documents_admin_all" ON public.official_documents FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.official_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SIGNUP BOOTSTRAP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NULLIF(NEW.raw_user_meta_data->>'full_name',''))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.licenses (user_id, tier, status, activated_at)
  VALUES (NEW.id, 'demo', 'active', now())
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.demo_usage (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ATOMIC USE CONSUMPTION
CREATE OR REPLACE FUNCTION public.consume_mentor_use(_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_tier public.license_tier;
  v_status public.license_status;
  v_used INTEGER;
  v_max INTEGER;
BEGIN
  SELECT tier, status INTO v_tier, v_status FROM public.licenses WHERE user_id = _user_id;

  IF v_tier IS NULL THEN
    INSERT INTO public.licenses (user_id, tier, status, activated_at)
    VALUES (_user_id, 'demo', 'active', now())
    ON CONFLICT (user_id) DO NOTHING;
    v_tier := 'demo'; v_status := 'active';
  END IF;

  IF v_status <> 'active' THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'license_inactive', 'tier', v_tier);
  END IF;

  IF v_tier = 'premium' THEN
    RETURN jsonb_build_object('allowed', true, 'tier', 'premium', 'remaining', NULL);
  END IF;

  INSERT INTO public.demo_usage (user_id) VALUES (_user_id) ON CONFLICT (user_id) DO NOTHING;

  SELECT used_count, max_uses INTO v_used, v_max
  FROM public.demo_usage WHERE user_id = _user_id FOR UPDATE;

  IF v_used >= v_max THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'demo_limit_reached', 'tier', 'demo',
                              'remaining', 0, 'used', v_used, 'max_uses', v_max);
  END IF;

  UPDATE public.demo_usage
  SET used_count = used_count + 1, last_used_at = now()
  WHERE user_id = _user_id
  RETURNING used_count INTO v_used;

  RETURN jsonb_build_object('allowed', true, 'tier', 'demo', 'remaining', v_max - v_used,
                            'used', v_used, 'max_uses', v_max);
END; $$;

REVOKE ALL ON FUNCTION public.consume_mentor_use(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_mentor_use(UUID) FROM anon;
REVOKE ALL ON FUNCTION public.consume_mentor_use(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_mentor_use(UUID) TO service_role;

-- REFUND A USE IF THE MODEL CALL FAILS
CREATE OR REPLACE FUNCTION public.refund_mentor_use(_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.demo_usage
  SET used_count = GREATEST(used_count - 1, 0)
  WHERE user_id = _user_id;
END; $$;
REVOKE ALL ON FUNCTION public.refund_mentor_use(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_mentor_use(UUID) FROM anon;
REVOKE ALL ON FUNCTION public.refund_mentor_use(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.refund_mentor_use(UUID) TO service_role;