import { supabase } from "../initSupabase";
import { BabyHeartFrequency_type } from "../store/BabyHeartFrequency/babyHeartFrequencyStore";
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

  async fetchBabyHeartFrequencies(partogrammeId: string) {
    return await supabase
      .from("BabyHeartFrequency")
      .select("*")
      .eq("partogrammeId", partogrammeId);
  }

  async deleteBabyHeartFrequency(id: string) {
    return await supabase.from("BabyHeartFrequency").delete().eq("id", id);
  }

  async updateBabyHeartFrequency(frequency: BabyHeartFrequency_type["Row"]) {
    return await supabase
      .from("BabyHeartFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
  }

  async insertBabyHeartFrequency(frequency: BabyHeartFrequency_type["Insert"]) {
    return await supabase
      .from("BabyHeartFrequency")
      .insert({ ...frequency });
  }
}
