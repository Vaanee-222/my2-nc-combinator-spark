REVOKE ALL ON FUNCTION public.evaluate_badges(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_evaluate_badges() FROM PUBLIC, anon, authenticated;