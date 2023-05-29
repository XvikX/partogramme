import { supabase } from "../initSupabase";
import { BabyHeartFrequency_type } from "../store/BabyHeartFrequency/babyHeartFrequencyStore";
import { Dilation_type } from "../store/Dilatation/dilatationStore";
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

    // Fetch dilations from the server by partogrammeId
    async fetchDilations(partogrammeId: string) {
      return await supabase
        .from("Dilation")
        .select("*")
        .eq("partogrammeId", partogrammeId);
    }
  
    // Update a dilation on the server
    async updateDilation(dilation: Dilation_type["Row"]) {
      return await supabase
        .from("Dilation")
        .upsert({ ...dilation })
        .eq("id", dilation.id);
    }
  
    // Insert a new dilation on the server
    async insertDilation(dilation: Dilation_type["Insert"]) {
      return await supabase.from("Dilation").insert({ ...dilation });
    }
  
    // Delete a dilation on the server by id
    async deleteDilation(id: string) {
      return await supabase.from("Dilation").delete().eq("id", id);
    }
}
