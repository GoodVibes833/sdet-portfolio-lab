-- ============================================================
-- 캐나다가자 Supabase 스키마
-- Supabase Dashboard > SQL Editor에 붙여넣기하여 실행하세요
-- ============================================================

-- 1. profiles 테이블
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nickname text not null unique,
  avatar_emoji text not null default '😊',
  points integer not null default 0,
  visit_count integer not null default 0,
  badges text[] not null default '{}',
  visited_places text[] not null default '{}',
  wishlist_places text[] not null default '{}',
  show_visits_to_friends boolean not null default true,
  last_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. friendships 테이블
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(requester_id, receiver_id)
);

-- 3. place_visits 테이블 (어뷰징 방지: 한 장소당 24시간 쿨타임)
create table if not exists public.place_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  place_id text not null,
  place_name text not null,
  city text not null,
  note text,
  visited_at timestamptz not null default now(),
  -- 어뷰징 방지: 같은 사용자+장소는 24시간 이내 중복 불가 (앱 레벨에서 enforce)
  unique(user_id, place_id)  -- 장소당 1회만 기록 (재방문은 업데이트)
);

-- 4. invites 테이블 (친구 초대 & 일정 제안)
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references public.profiles(id) on delete cascade not null,
  invitee_id uuid references public.profiles(id) on delete cascade not null,
  place_id text not null,
  place_name text not null,
  proposed_date timestamptz not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. messages 테이블 (실시간 1:1 채팅)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null default '',
  image_url text,
  audio_url text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS) 설정
-- ============================================================

alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.place_visits enable row level security;
alter table public.invites enable row level security;
alter table public.messages enable row level security;

-- profiles: 본인 프로필 수정 가능, 전체 읽기 가능 (랭킹용)
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- friendships: 본인 관련 친구 관계만 읽기/쓰기
create policy "friendships_select" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = receiver_id);
create policy "friendships_insert" on public.friendships
  for insert with check (auth.uid() = requester_id);
create policy "friendships_update" on public.friendships
  for update using (auth.uid() = receiver_id); -- 수락/거절은 받은 사람만

-- place_visits: 본인 기록 읽기/쓰기 + 친구 공개 기록 읽기
create policy "place_visits_own" on public.place_visits
  for all using (auth.uid() = user_id);
create policy "place_visits_friends_read" on public.place_visits
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = place_visits.user_id
        and p.show_visits_to_friends = true
        and exists (
          select 1 from public.friendships f
          where f.status = 'accepted'
            and ((f.requester_id = auth.uid() and f.receiver_id = p.id)
              or (f.receiver_id = auth.uid() and f.requester_id = p.id))
        )
    )
  );

-- invites: 본인 관련 초대만 읽기/쓰기
create policy "invites_select" on public.invites
  for select using (auth.uid() = inviter_id or auth.uid() = invitee_id);
create policy "invites_insert" on public.invites
  for insert with check (auth.uid() = inviter_id);
create policy "invites_update" on public.invites
  for update using (auth.uid() = invitee_id);

-- messages: 본인 관련 메시지만 읽기/쓰기
create policy "messages_select" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "messages_insert" on public.messages
  for insert with check (auth.uid() = sender_id);
create policy "messages_update" on public.messages
  for update using (auth.uid() = receiver_id);

-- ============================================================
-- Supabase Realtime 활성화 (messages 테이블)
-- ============================================================
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- 자동 updated_at 트리거
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger friendships_updated_at before update on public.friendships
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Google 로그인 시 자동 프로필 생성 (optional)
-- auth.users에 새 유저 생성 시 profiles에 기본값 삽입
-- 닉네임은 앱에서 온보딩으로 별도 설정
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  base_nick text;
  final_nick text;
  counter int := 0;
begin
  base_nick := split_part(new.email, '@', 1);
  final_nick := base_nick;
  loop
    exit when not exists (select 1 from public.profiles where nickname = final_nick);
    counter := counter + 1;
    final_nick := base_nick || counter::text;
  end loop;

  insert into public.profiles (id, nickname, avatar_emoji)
  values (new.id, final_nick, '😊')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 6. notifications 테이블 (푸시/이메일 알림 큐)
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'invite_accepted', 'new_invite', 'new_message'
  title text not null,
  body text not null,
  data jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);
create policy "notifications_insert" on public.notifications
  for insert with check (true); -- Edge Function에서 삽입 가능
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

-- Realtime 활성화 (notifications)
alter publication supabase_realtime add table public.notifications;

-- ============================================================
-- 7. invites 수락 시 Edge Function 호출 트리거
--    (Supabase Dashboard > Database > Triggers에서 수동 생성 권장)
-- ============================================================
create or replace function public.handle_invite_accepted()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'accepted' and old.status = 'pending' then
    -- Edge Function 호출은 pg_net 확장 필요
    -- SELECT net.http_post(...)
    -- 또는 클라이언트에서 응답 후 별도 API 호출
    -- 여기서는 notifications 테이블에 기록 (앱 푸시용)
    insert into public.notifications (user_id, type, title, body, data)
    values (
      new.inviter_id,
      'invite_accepted',
      '초대 수락! 🎉',
      (select nickname from public.profiles where id = new.invitee_id) || '님이 "' || new.place_name || '" 초대를 수락했어요',
      jsonb_build_object('invite_id', new.id, 'place_name', new.place_name)
    );
  end if;
  return new;
end;
$$;

create or replace trigger invites_status_change
  after update on public.invites
  for each row execute procedure public.handle_invite_accepted();

-- ============================================================
-- 8. Storage Bucket RLS Policy (reviews 사진 업로드)
-- ============================================================
-- Supabase Dashboard > Storage > Policies에서 아래와 같이 설정:
--
-- Bucket: reviews
-- Policy 1 (SELECT): public can view
--   CREATE POLICY "reviews_select_public"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'reviews');
--
-- Policy 2 (INSERT): authenticated users can upload their own
--   CREATE POLICY "reviews_insert_authenticated"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'reviews'
--     AND auth.role() = 'authenticated'
--     AND (storage.extension(name) = 'jpg'
--       OR storage.extension(name) = 'jpeg'
--       OR storage.extension(name) = 'png'
--       OR storage.extension(name) = 'webp')
--     AND storage.filename(name) ~ '^[0-9]+_[a-z0-9]+\.(jpg|jpeg|png|webp)$'
--   );
--
-- Policy 3 (DELETE): owner only
--   CREATE POLICY "reviews_delete_owner"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'reviews' AND owner = auth.uid());
--
-- Bucket: chat-images (채팅 이미지)
-- Policy 1 (SELECT): participants can view
--   CREATE POLICY "chat_images_select"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'chat-images');
--
-- Policy 2 (INSERT): authenticated users can upload
--   CREATE POLICY "chat_images_insert"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'chat-images'
--     AND auth.role() = 'authenticated'
--     AND (storage.extension(name) = 'jpg'
--       OR storage.extension(name) = 'jpeg'
--       OR storage.extension(name) = 'png'
--       OR storage.extension(name) = 'webp'
--       OR storage.extension(name) = 'gif')
--     AND storage.filename(name) ~ '^[0-9]+_[a-z0-9]+\.(jpg|jpeg|png|webp|gif)$'
--   );
--
-- Policy 3 (DELETE): owner only
--   CREATE POLICY "chat_images_delete_owner"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'chat-images' AND owner = auth.uid());
--
-- Bucket: chat-audio (음성 메시지)
-- Policy 1 (SELECT): participants can view
--   CREATE POLICY "chat_audio_select"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'chat-audio');
--
-- Policy 2 (INSERT): authenticated users can upload
--   CREATE POLICY "chat_audio_insert"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'chat-audio'
--     AND auth.role() = 'authenticated'
--     AND storage.extension(name) = 'webm'
--     AND storage.filename(name) ~ '^[0-9]+_[a-z0-9]+\.webm$'
--   );
--
-- Policy 3 (DELETE): owner only
--   CREATE POLICY "chat_audio_delete_owner"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'chat-audio' AND owner = auth.uid());
--
-- ============================================================
-- 9. Reviews table (커뮤니티 리뷰)
-- ============================================================
-- CREATE TABLE IF NOT EXISTS public.reviews (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid references public.profiles(id) on delete cascade,
--   place_id text not null,
--   place_name text not null,
--   content text not null,
--   rating int not null check (rating between 1 and 5),
--   nickname text not null,
--   image_url text,
--   created_at timestamptz default now()
-- );
--
-- alter table public.reviews enable row level security;
--
-- create policy "reviews_select_public"
--   on public.reviews for select to anon, authenticated using (true);
--
-- create policy "reviews_insert_authenticated"
--   on public.reviews for insert to authenticated
--   with check (auth.uid() = user_id);
--
-- create policy "reviews_delete_owner"
--   on public.reviews for delete to authenticated
--   using (auth.uid() = user_id);

-- ============================================================
-- Full Text Search (messages.content)
-- ============================================================
-- 1. Enable pg_trgm extension (Supabase Dashboard > Extensions)
--    CREATE EXTENSION IF NOT EXISTS pg_trgm;
--
-- 2. Create GIN index for trigram search
--    CREATE INDEX IF NOT EXISTS idx_messages_content_trgm
--    ON public.messages USING gin (content gin_trgm_ops);
--
-- 3. Search query example:
--    SELECT * FROM public.messages
--    WHERE content ILIKE '%검색어%'
--      AND (sender_id = 'me' OR receiver_id = 'me');
--
-- ============================================================
-- pg_net extension (Edge Function HTTP call from SQL trigger)
-- ============================================================
-- NOTE: pg_net is available on Supabase but may require enabling
--       in Dashboard > Extensions or via SQL:
--       CREATE EXTENSION IF NOT EXISTS pg_net;
--
-- Example: Call Edge Function from trigger
--   SELECT net.http_post(
--     url := 'https://<project>.supabase.co/functions/v1/notify-inviter',
--     headers := '{"Content-Type": "application/json", "Authorization": "Bearer <anon-key>"}'::jsonb,
--     body := '{"invite_id": "..."}'::jsonb
--   );
--
