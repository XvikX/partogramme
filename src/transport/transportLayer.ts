import { supabase } from "../initSupabase";
import { AmnioticLiquid_type } from "../store/AmnioticLiquid/amnioticLiquidStore";
import { BabyDescent_type } from "../store/BabyDescent/babyDescentStore";
import { BabyHeartFrequency_type } from "../store/BabyHeartFrequency/babyHeartFrequencyStore";
import { Dilation_t } from "../store/GraphData/Dilatation/dilatationStore";
import { MotherBloodPressure_type } from "../store/MotherBloodPressure/motherBloodPressureStore";
import { MotherContractionsFrequency_type } from "../store/MotherContractionsFrequency/motherContractionsFrequencyStore";
import { MotherHeartFrequency_type } from "../store/MotherHeartFrequency/motherHeartFrequencyStore";
import { MotherTemperature_t } from "../store/TableData/MotherTemperature/motherTemperatureStore";
import { Partogramme_t } from "../store/partogramme/partogrammeStore";
/**
 * @class TransportLayer
 * @brief A class that provides methods to interact with the server's API for various partogram-related data.
 *
 * This class encapsulates the functionality to communicate with the server's API and perform CRUD operations
 * on partogram-related data such as partogrammes, baby heart frequencies, dilations, baby descent, amniotic liquids,
 * mother blood pressures, mother contractions frequencies, mother heart frequencies, and mother temperatures.
 * It abstracts away the underlying network requests and provides a simplified and uniform interface for data manipulation.
 */
export class TransportLayer {
  /* Partogrammes */
  client = supabase;

  async fetchPartogrammes(nurseId?: string) {
      if (nurseId){
      const { data, error } = await supabase
        .from("Partogramme")
        .select("*")
        .eq("nurseId", nurseId)
        .eq("isDeleted", false);
        if (error) {
          throw error;
        }
        return data;
      }
      else {
        const { data, error } = await supabase
        .from("Partogramme")
        .select("*")
        .eq("isDeleted", false);
        if (error) {
          throw error;
        }
        return data;
      }
  }

  async deletePartogramme(id: string) {
    const { error } = await supabase
      .from("Partogramme")
      .delete()
      .eq("id", id);
    if (error) {
      throw error;
    }
  }

  async updatePartogramme(partogramme: Partogramme_t["Row"]) {
    const { data, error } = await supabase
      .from("Partogramme")
      .upsert({ ...partogramme })
      .eq("id", partogramme.id);
    if (error) {
      throw error;
    }
    return data;
  }

  async insertPartogramme(partogramme: Partogramme_t["Row"]) {
    const { data, error } = await supabase
      .from("Partogramme")
      .insert({ ...partogramme });
    if (error) {
      throw error;
    }
    return data;
  }

  /* Baby Heart Frequencies */

  async fetchBabyHeartFrequencies(partogrammeId: string) {
    const { data, error } = await supabase
      .from("BabyHeartFrequency")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      // console.log(error);
      throw error;
    }
    return data;
  }

  async deleteBabyHeartFrequency(id: string) {
    const { error } = await supabase
      .from("BabyHeartFrequency")
      .delete()
      .eq("id", id);
    if (error) {
      throw error;
    }
  }

  async updateBabyHeartFrequency(frequency: BabyHeartFrequency_type["Row"]) {
    const { data, error } = await supabase
      .from("BabyHeartFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
    if (error) {
      throw error;
    }
    return data;
  }

  async insertBabyHeartFrequency(frequency: BabyHeartFrequency_type["Insert"]) {
    const { data, error } = await supabase
      .from("BabyHeartFrequency")
      .insert({ ...frequency });
    if (error) {
      throw error;
    }
    return data;
  }

  /* Dilations */

  // Fetch dilations from the server by partogrammeId
  async fetchDilations(partogrammeId: string) {
    const { data, error } = await supabase
      .from("Dilation")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      throw error;
    }
    return data;
  }

  // Update a dilation on the server
  async updateDilation(dilation: Dilation_t["Row"]) {
    const { data, error } = await supabase
      .from("Dilation")
      .upsert({ ...dilation })
      .eq("id", dilation.id);
    if (error) {
      throw error;
    }
    return data;
  }

  // Insert a new dilation on the server
  async insertDilation(dilation: Dilation_t["Insert"]) {
    const { data, error } = await supabase
      .from("Dilation")
      .insert({ ...dilation });
    if (error) {
      throw error;
    }
    return data;
  }

  // Delete a dilation on the server by id
  async deleteDilation(id: string) {
    const { error } = await supabase
      .from("Dilation")
      .delete()
      .eq("id", id);
      if (error) {
        throw error;
      }
  }

  /* Baby Descent */
  // Fetch baby descents from the server
  async fetchBabyDescents(partogrammeId: string) {
    const { data, error } = await supabase
      .from("BabyDescent")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      throw error;
    }
    return data;
  }

  // Update a baby descent on the server
  async updateBabyDescent(babyDescent: BabyDescent_type["Row"]) {
    const { data, error } = await supabase
      .from("BabyDescent")
      .upsert({ ...babyDescent })
      .eq("id", babyDescent.id);
    if (error) {
      throw error;
    }
    return data;
  }

  // Insert a new baby descent on the server
  async insertBabyDescent(babyDescent: BabyDescent_type["Insert"]) {
    const { data, error } = await supabase
      .from("BabyDescent")
      .insert({ ...babyDescent });
    if (error) {
      throw error;
    }
    return data;
  }

  // Delete a baby descent from the server
  async deleteBabyDescent(id: string) {
    const { error } = await supabase
      .from("BabyDescent")
      .delete()
      .eq("id", id);
    if (error) {
      throw error;
    }
  }

  /* Amniotic Liquids */
  // Fetch amniotic liquids from the server
  async fetchAmnioticLiquids(partogrammeId: string) {
    const { data, error } = await supabase
      .from("amnioticLiquid")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  }

  // Update an amniotic liquid on the server
  async updateAmnioticLiquid(amnioticLiquid: AmnioticLiquid_type["Row"]) {
    const { data, error } = await supabase
      .from("amnioticLiquid")
      .upsert({ ...amnioticLiquid })
      .eq("id", amnioticLiquid.id);
    if (error) {
      // console.log(error);
      throw error;
    }
    return data;
  }

  // Insert a new amniotic liquid on the server
  async insertAmnioticLiquid(amnioticLiquid: AmnioticLiquid_type["Insert"]) {
    const { data, error } = await supabase
      .from("amnioticLiquid")
      .insert({ ...amnioticLiquid });
    if (error) {
      // console.log(error);
      throw error;
    }
    return data;
  }

  // Delete an amniotic liquid on the server
  async deleteAmnioticLiquid(amnioticLiquidId: string) {
    const { data, error } = await supabase
      .from("amnioticLiquid")
      .update({ isDeleted: true })
      .eq("id", amnioticLiquidId);
    if (error) {
      throw error;
    }
    return data;
  }

  /* Mother Blood Pressures */
  // Fetch mother blood pressures from the server
  async fetchMotherBloodPressures(partogrammeId: string) {
    const { data, error } = await supabase
      .from("MotherBloodPressure")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      throw error;
    }
    return data;
  }

  // Create a new mother blood pressure on the server
  async createMotherBloodPressure(
    motherBloodPressure: MotherBloodPressure_type["Insert"]
  ) {
    const { data, error } = await supabase
      .from("MotherBloodPressure")
      .insert(motherBloodPressure);
    if (error) {
      throw error;
    }
    return data;
  }

  // Update a mother blood pressure on the server
  async updateMotherBloodPressure(
    motherBloodPressure: MotherBloodPressure_type["Update"]
  ) {
    const { data, error } = await supabase
      .from("MotherBloodPressure")
      .update(motherBloodPressure)
      .eq("id", motherBloodPressure.id);
    if (error) {
      throw error;
    }
    return data;
  }

  // Delete a mother blood pressure on the server
  async deleteMotherBloodPressure(motherBloodPressureId: string) {
    const { data, error } = await supabase
      .from("MotherBloodPressure")
      .update({ isDeleted: true })
      .eq("id", motherBloodPressureId);
    if (error) {
      throw error;
    }
    return data;
  }

  /* Mother Contractions Frequencies */
  async fetchMotherContractionsFrequencies(partogrammeId: string) {
    const { data, error } = await supabase
      .from("MotherContractionsFrequency")
      .select("*")
      .eq("partogrammeId", partogrammeId);
      if (error) {
        throw error;
      }
      return data;
  }

  async deleteMotherContractionsFrequency(id: string) {
    const { data, error } = await supabase
      .from("MotherContractionsFrequency")
      .update({ isDeleted: true })
      .eq("id", id);
    if (error) {
      throw error;
    }
    return data;
  }

  async updateMotherContractionsFrequency(
    frequency: MotherContractionsFrequency_type["Row"]
  ) {
    const { data, error } = await supabase
      .from("MotherContractionsFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
    if (error) {
      throw error;
    }
    return data;
  }

  async insertMotherContractionsFrequency(
    frequency: MotherContractionsFrequency_type["Row"]
  ) {
    const { data, error } = await supabase
      .from("MotherContractionsFrequency")
      .insert({ ...frequency });
    if (error) {
      throw error;
    }
    return data;
  }

  async fetchMotherHeartFrequencies(partogrammeId: string) {
    const { data, error } = await supabase
      .from("MotherHeartFrequency")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteMotherHeartFrequency(id: string) {
    const { data, error } = await supabase
      .from("MotherHeartFrequency")
      .update({ isDeleted: true })
      .eq("id", id);
    if (error) {
      throw error;
    }
    return data;
  }

  async updateMotherHeartFrequency(
    frequency: MotherHeartFrequency_type["Row"]
  ) {
    const { data, error } = await supabase
      .from("MotherHeartFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
    if (error) {
      throw error;
    }
    return data;
  }

  async insertMotherHeartFrequency(
    frequency: MotherHeartFrequency_type["Row"]
  ) {
    const { data, error } = await supabase
      .from("MotherHeartFrequency")
      .insert({ ...frequency });
    if (error) {
      throw error;
    }
    return data;
  }

  /* Mother Temperatures */
  async fetchMotherTemperatures(partogrammeId: string) {
    const { data, error } = await supabase
      .from("MotherTemperature")
      .select("*")
      .eq("partogrammeId", partogrammeId);
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteMotherTemperature(id: string) {
    const { data, error } = await supabase
      .from("MotherTemperature")
      .update({ isDeleted: true })
      .eq("id", id);
    if (error) {
      throw error;
    }
    return data;
  }

  async updateMotherTemperature(temperature: MotherTemperature_t["Row"]) {
    const { data, error } = await supabase
      .from("MotherTemperature")
      .upsert({ ...temperature })
      .eq("id", temperature.id);
    if (error) {
      throw error;
    }
    return data;
  }

  async insertMotherTemperature(temperature: MotherTemperature_t["Row"]) {
    const { data, error } = await supabase
      .from("MotherTemperature")
      .insert({ ...temperature });
    if (error) {
      throw error;
    }
    return data;
  }
}
