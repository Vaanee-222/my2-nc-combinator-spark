
REVOKE ALL ON FUNCTION public.award_points(uuid, text, integer, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalc_user_points(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_award_points() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_award_session_points() FROM PUBLIC, anon, authenticated;
