create table
  if not exists holdings (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references auth.users (id) on delete cascade not null,
    type text not null check (type in ('crypto', 'stock', 'gold', 'fx')),
    symbol text not null,
    label text not null,
    quantity numeric not null check (quantity >= 0),
    avg_cost numeric not null check (avg_cost >= 0),
    created_at timestamptz not null default now ()
  );

alter table holdings enable row level security;

create policy "Users can view own holdings" on holdings for
select
  using (auth.uid () = user_id);

create policy "Users can insert own holdings" on holdings for insert
with
  check (auth.uid () = user_id);

create policy "Users can update own holdings" on holdings for
update using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);

create policy "Users can delete own holdings" on holdings for delete using (auth.uid () = user_id);

create index if not exists holdings_user_id_idx on holdings (user_id);

create table
  if not exists portfolio_snapshots (
    user_id uuid references auth.users (id) on delete cascade not null,
    day date not null,
    value numeric not null,
    created_at timestamptz not null default now (),
    primary key (user_id, day)
  );

alter table portfolio_snapshots enable row level security;

create policy "Users can view own snapshots" on portfolio_snapshots for
select
  using (auth.uid () = user_id);

create policy "Users can insert own snapshots" on portfolio_snapshots for insert
with
  check (auth.uid () = user_id);

create policy "Users can update own snapshots" on portfolio_snapshots for
update using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);