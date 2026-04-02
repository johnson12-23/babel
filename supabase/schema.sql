create table if not exists public.reservations (
  id bigint generated always as identity primary key,
  full_name text not null,
  phone text not null,
  guests integer not null,
  reservation_date date not null,
  reservation_time time not null,
  note text default '',
  created_at timestamp with time zone default now() not null
);

create table if not exists public.contact_inquiries (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  inquiry_type text not null,
  message text not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  section_title text not null,
  name text not null,
  detail text not null,
  price_ghs integer not null,
  sort_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.events (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  event_date_label text not null,
  time_label text not null,
  sort_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.conversion_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null
);
