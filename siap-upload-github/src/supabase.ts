import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eyxgncxqywumzmtagyyn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PSuhEK6pKSGvvM0ob43NBg_L0co7XD-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
