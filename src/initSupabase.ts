import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://yqgeaxbjjjvxgmbtpqqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZ2VheGJqamp2eGdtYnRwcXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU4ODk1MDIsImV4cCI6MTk5MTQ2NTUwMn0.9WfRcig0snJ2OXpwXB-rEsBYLOVs0umgfqPT4Xtq09s'

// Better put your these secret keys in .env file
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage as any,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
})