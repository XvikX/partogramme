import { supabase } from "../initSupabase";
import { AmnioticLiquid_type } from "../store/AmnioticLiquid/amnioticLiquidStore";
import { BabyDescent_type } from "../store/BabyDescent/babyDescentStore";
import { BabyHeartFrequency_type } from "../store/BabyHeartFrequency/babyHeartFrequencyStore";
import { Dilation_type } from "../store/Dilatation/dilatationStore";
import { MotherBloodPressure_type } from "../store/MotherBloodPressure/motherBloodPressureStore";
import { MotherContractionsFrequency_type } from "../store/MotherContractionsFrequency/motherContractionsFrequencyStore";
import { MotherHeartFrequency_type } from "../store/MotherHeartFrequency/motherHeartFrequencyStore";
import { MotherTemperature_type } from "../store/MotherTemperature/motherTemperatureStore";
import { Partogramme_type } from "../store/partogramme/partogrammeStore";

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
    return await supabase.from("Partogramme").insert({ ...partogramme });
  }

  /* Baby Heart Frequencies */

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
    const { data, error } = await supabase
      .from("BabyHeartFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
    if (error) {
      // console.log(error);
      throw error;
    }
    return data;
  }

  async insertBabyHeartFrequency(frequency: BabyHeartFrequency_type["Insert"]) {
    return await supabase.from("BabyHeartFrequency").insert({ ...frequency });
  }

  /* Dilations */

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

  /* Baby Descent */
  // Fetch baby descents from the server
  async fetchBabyDescents(partogrammeId: string) {
    return await supabase
      .from("BabyDescent")
      .select("*")
      .eq("partogrammeId", partogrammeId);
  }

  // Update a baby descent on the server
  async updateBabyDescent(babyDescent: BabyDescent_type["Row"]) {
    return await supabase
      .from("BabyDescent")
      .upsert({ ...babyDescent })
      .eq("id", babyDescent.id);
  }

  // Insert a new baby descent on the server
  async insertBabyDescent(babyDescent: BabyDescent_type["Insert"]) {
    return await supabase.from("BabyDescent").insert({ ...babyDescent });
  }

  // Delete a baby descent from the server
  async deleteBabyDescent(id: string) {
    return await supabase.from("BabyDescent").delete().eq("id", id);
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
    const { data, error } = await supabase.from("amnioticLiquid").insert({ ...amnioticLiquid });
    if (error) {
      // console.log(error);
      throw error;
    }
    return data;
  }

  // Delete an amniotic liquid on the server
  async deleteAmnioticLiquid(amnioticLiquidId: string) {
    return await supabase
      .from("amnioticLiquid")
      .update({ isDeleted: true })
      .eq("id", amnioticLiquidId);
  }

  /* Mother Blood Pressures */
  // Fetch mother blood pressures from the server
  async fetchMotherBloodPressures(partogrammeId: string) {
    return await supabase
      .from("MotherBloodPressure")
      .select("*")
      .eq("partogrammeId", partogrammeId);
  }

  // Create a new mother blood pressure on the server
  async createMotherBloodPressure(
    motherBloodPressure: MotherBloodPressure_type["Insert"]
  ) {
    return await supabase
      .from("MotherBloodPressure")
      .insert(motherBloodPressure);
  }

  // Update a mother blood pressure on the server
  async updateMotherBloodPressure(
    motherBloodPressure: MotherBloodPressure_type["Update"]
  ) {
    return await supabase
      .from("MotherBloodPressure")
      .update(motherBloodPressure)
      .eq("id", motherBloodPressure.id);
  }

  // Delete a mother blood pressure on the server
  async deleteMotherBloodPressure(motherBloodPressureId: string) {
    return await supabase
      .from("MotherBloodPressure")
      .update({ isDeleted: true })
      .eq("id", motherBloodPressureId);
  }

  /* Mother Contractions Frequencies */
  async fetchMotherContractionsFrequencies(partogrammeId: string) {
    return await supabase
      .from("MotherContractionsFrequency")
      .select("*")
      .eq("partogrammeId", partogrammeId);
  }

  async deleteMotherContractionsFrequency(id: string) {
    return await supabase
      .from("MotherContractionsFrequency")
      .update({ isDeleted: true })
      .eq("id", id);
  }

  async updateMotherContractionsFrequency(
    frequency: MotherContractionsFrequency_type["Row"]
  ) {
    return await supabase
      .from("MotherContractionsFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
  }

  async insertMotherContractionsFrequency(
    frequency: MotherContractionsFrequency_type["Row"]
  ) {
    return await supabase
      .from("MotherContractionsFrequency")
      .insert({ ...frequency });
  }

  async fetchMotherHeartFrequencies(partogrammeId: string) {
    return await supabase
      .from("MotherHeartFrequency")
      .select("*")
      .eq("partogrammeId", partogrammeId);
  }

  async deleteMotherHeartFrequency(id: string) {
    return await supabase
      .from("MotherHeartFrequency")
      .update({ isDeleted: true })
      .eq("id", id);
  }

  async updateMotherHeartFrequency(
    frequency: MotherHeartFrequency_type["Row"]
  ) {
    return await supabase
      .from("MotherHeartFrequency")
      .upsert({ ...frequency })
      .eq("id", frequency.id);
  }

  async insertMotherHeartFrequency(
    frequency: MotherHeartFrequency_type["Row"]
  ) {
    return await supabase.from("MotherHeartFrequency").insert({ ...frequency });
  }

  /* Mother Temperatures */
  async fetchMotherTemperatures(partogrammeId: string) {
    return await supabase
      .from("MotherTemperature")
      .select("*")
      .eq("partogrammeId", partogrammeId);
  }

  async deleteMotherTemperature(id: string) {
    return await supabase
      .from("MotherTemperature")
      .update({ isDeleted: true })
      .eq("id", id);
  }

  async updateMotherTemperature(temperature: MotherTemperature_type["Row"]) {
    return await supabase
      .from("MotherTemperature")
      .upsert({ ...temperature })
      .eq("id", temperature.id);
  }

  async insertMotherTemperature(temperature: MotherTemperature_type["Row"]) {
    return await supabase.from("MotherTemperature").insert({ ...temperature });
  }
}
