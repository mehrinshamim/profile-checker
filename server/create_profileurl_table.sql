-- Creates the `profileurl` table to link a user to their profile photo URL stored in Supabase storage
-- Run this script in the Supabase SQL editor or include it in your migration pipeline

create table if not exists  profileurl (
    user_id uuid primary key references auth.users(id) on delete cascade,
    photo_url text not null
); 