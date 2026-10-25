-- #5: let users delete their own account
-- deleting the auth user cascades to profiles -> attempts,
-- and puzzles.created_by just goes to null
create function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not logged in';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

-- only logged in users, and it only ever deletes yourself
revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
