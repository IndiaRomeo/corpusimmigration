import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

var config = window.SUPABASE_CONFIG || {};
var configured = Boolean(
	config.url &&
	config.anonKey &&
	config.url !== 'https://YOUR_PROJECT_ID.supabase.co' &&
	config.anonKey !== 'YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY'
);

export var supabase = configured
	? createClient(config.url, config.anonKey)
	: null;

export function getSupabaseClient() {
	if (!supabase) {
		throw new Error('Configura SUPABASE_CONFIG en supabase-config.js antes de usar Supabase.');
	}

	return supabase;
}
