import { supabase } from "../initSupabase";
import { Partogramme_type } from "../store/partogramme/partogrammeStore";

export class TransportLayer {
  async fetchPartogrammes(nurseId: string) {
    return await supabase
      .from("Partogramme")
      .select("*")
      .eq("nurseId", nurseId);
  }

  async deletePartogramme(id: string) {
    return await supabase.from("Partogramme").delete().eq("id", id);
  }

  async updatePartogramme(partogramme: Partogramme_type["Row"]) {
    return await supabase
      .from("Partogramme")
      .upsert({ ...partogramme })
      .eq("id", partogramme.id);
  }

  async insertPartogramme(partogramme: Partogramme_type["Row"]) {
    return await supabase
      .from("Partogramme")
      .insert({ ...partogramme });
  }
}
