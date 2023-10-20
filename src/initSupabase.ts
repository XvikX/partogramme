import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import {SUPABASEURL, SUPABASEKEY} from "@env"
import { rootStore } from "./store/rootStore";

const supabaseUrl = SUPABASEURL
const supabaseKey = SUPABASEKEY

export let token = ""

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
    Authorization: `Bearer ${token}`,
    },
  },
};

// Better put your these secret keys in .env file
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, options);
