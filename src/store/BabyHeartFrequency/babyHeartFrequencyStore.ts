import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { Database } from "../../../types/supabase";
import { supabase } from "../../initSupabase";
import { Partogramme } from "../partogramme/partogrammeStore";
import { Alert } from "react-native";
import { assert } from "console";
import reactotron from "reactotron-react-native";

export type BabyHeartFrequency =
    Database["public"]["Tables"]["BabyHeartFrequency"];

export class BabyHeartFrequencyStore {
    babyHeartList: BabyHeartFrequency["Row"][];
    state = "pending"; // "pending", "done" or "error"
    isInSync = false;

    constructor() {
        makeAutoObservable(this);
        this.babyHeartList = [];
    }

    /**
     * @brief Create a new babyHeartFrequency and push it to the server
     * @param babyFc baby heart frequency
     * @param Rank rank of the baby heart frequency (delta time) for test purposes only
     * @param created_at    date of creation of the baby heart frequency
     * @param partogrammeId id of the partogramme to which the baby heart frequency belongs
     * @returns boolean : true if there was an error, false if everything went well
     */
    async newBabyHeartFrequency(
        babyFc: number,
        Rank: number,
        created_at: string,
        partogrammeId: string
    ) {
        let error = false;
        let babyHeartFrequency: BabyHeartFrequency["Row"] = {
            id: uuidv4(),
            babyFc: babyFc,
            Rank: Rank,
            created_at: created_at,
            partogrammeId: partogrammeId,
        };
        const result = await supabase
            .from("BabyHeartFrequency")
            .insert(babyHeartFrequency);
        if (result.error) {
            console.log(
                "Error creating new babyHeartFrequency : failed to push to the server"
            );
            console.error(result.error);
            runInAction(() => {
                this.state = "error";
                this.isInSync = false;
            });
            error = true;
            Alert.alert(
                "Erreur lors de la création de la données vérifier votre connexion internet"
            );
        } else {
            runInAction(() => {
                console.log("babyHeartFrequency was pushed to the server");
                this.state = "done";
                this.isInSync = true;
                this.saveBabyHeartFrequency(babyHeartFrequency);
            });
        }
        return error;
    }

    // Create a function to save a babyHeartFrequency in the babyHeartFrequencyList
    saveBabyHeartFrequency(babyHeartFrequency: BabyHeartFrequency["Row"]) {
        if (babyHeartFrequency !== undefined) {
            const idx = this.babyHeartList.findIndex(
                (n) => babyHeartFrequency.id === n.id
            );
            if (idx === -1) {
                this.babyHeartList.push(babyHeartFrequency);
            } else {
                this.babyHeartList[idx] = babyHeartFrequency;
            }
        } else {
            console.log("babyHeartFrequency is undefined");
        }
    }

    /**
     * @brief Get the list of babyHeartFrequency of a partogramme
     * @param partogrammeId  string : the id of the partogramme
     * @returns  BabyHeartFrequency['Row'][] : the list of babyHeartFrequency of the partogramme
     */
    getBabyHeartFrequencyList(partogrammeId: string|null) {
        if (partogrammeId === null) {
            return [];
        } else {
            const babyHeartFrequencyList = this.babyHeartList.filter(
                (babyHeartFrequency) => babyHeartFrequency.partogrammeId === partogrammeId
            );
            return babyHeartFrequencyList;
        }
    }

    /**
     * @brief Delete a babyHeartFrequency from the babyHeartFrequencyList and from the server
     * @param babyHeartFrequency  BabyHeartFrequency['Row'] | string : the babyHeartFrequency to delete or the id of the babyHeartFrequency to delete
     * @returns  boolean : true if there was an error, false if everything went well
     */
    async deleteBabyHeartFrequency(
        babyHeartFrequency: BabyHeartFrequency["Row"] | string
    ) {
        let error = false;
        if (typeof babyHeartFrequency === "string") {
            let result = this.babyHeartList.find((n) => n.id === babyHeartFrequency);
            if (result) {
                babyHeartFrequency = result;
            } else {
                console.log(
                    "Error deleting babyHeartFrequency : babyHeartFrequency not found in the list"
                );
                runInAction(() => {
                    this.state = "error";
                    this.isInSync = false;
                });
                return true;
            }
        }
        const result = await supabase
            .from("BabyHeartFrequency")
            .delete()
            .eq("id", babyHeartFrequency.id);
        if (result.error) {
            console.log(
                "Error deleting babyHeartFrequency : failed to push to the server"
            );
            console.error(result.error);
            Alert.alert(
                "Erreur lors de la suppression de la données vérifier votre connexion internet"
            );
            runInAction(() => {
                this.state = "error";
                this.isInSync = false;
            });
        } else {
            runInAction(() => {
                console.log("babyHeartFrequency was deleted from the server");
                this.state = "done";
                this.isInSync = true;
            });
        }
        return error;
    }

    // Create a function to update a babyHeartFrequency
    async updateBabyHeartFrequency(
        babyHeartFrequency: BabyHeartFrequency["Row"]
    ) {
        let error = false;
        const result = await supabase
            .from("BabyHeartFrequency")
            .update(babyHeartFrequency)
            .eq("id", babyHeartFrequency.id);
        if (result.error) {
            console.log(
                "Error updating babyHeartFrequency : failed to push to the server"
            );
            console.error(result.error);
            Alert.alert(
                "Erreur lors de la mise à jour de la données vérifier votre connexion internet"
            );
            runInAction(() => {
                this.state = "error";
                this.isInSync = false;
            });
        } else {
            runInAction(() => {
                console.log("babyHeartFrequency was updated on the server");
                this.state = "done";
                this.isInSync = true;
            });
        }
        return error;
    }

    /**
     *  @brief Fetch the babyHeartFrequencyList from the server of the selected partogramme and save it in the babyHeartFrequencyList
     * @param partogrammeId string : the id of the partogramme
     * @returns boolean : true if there was an error, false if everything went well
     * */
    async fetchBabyHeartFrequencyList(partogrammeId: string) {
        let error = false;
        const result = await supabase
            .from("BabyHeartFrequency")
            .select("*")
            .eq("partogrammeId", partogrammeId);
        if (result.error) {
            console.log(
                "Error fetching babyHeartFrequencyList : failed to fetch from the server"
            );
            console.error(result.error);
            Alert.alert("Erreur lors de la récupération des données vérifier votre connexion internet");
            runInAction(() => {
                this.state = "error";
                this.isInSync = false;
            });
            error = true;
        } else {
            runInAction(() => {
                console.log("babyHeartFrequencyList was fetched from the server");
                // Compare existing data with the new data to detect deleted items
                const deletedItems = this.babyHeartList.filter(
                    (babyHeartFrequency) => babyHeartFrequency.partogrammeId === partogrammeId
                ).filter(
                    (babyHeartFrequency) => result.data.find(
                        (newBabyHeartFrequency) => newBabyHeartFrequency.id === babyHeartFrequency.id
                    ) === undefined
                );
                // Delete deleted items
                deletedItems.forEach((deletedItems) => {
                    this.deleteLocalBabyHeartFrequency(deletedItems);
                });
                this.state = "done";
                this.isInSync = true;
                this.babyHeartList = [...result.data];
            });
        }
        return error;
    }

    /**
     * @brief delete locally selected babyHeartFrequency data
     * @param babyHeartFrequency BabyHeartFrequency['Row'] : the babyHeartFrequency to delete 
     * @returns boolean : true if there was an error, false if everything went well
     * */
    deleteLocalBabyHeartFrequency(babyHeartFrequency: BabyHeartFrequency["Row"]) {
        this.babyHeartList = this.babyHeartList.filter(
            (n) => n.id !== babyHeartFrequency.id
        );
    }
}

const babyHeartFrequencyStore = new BabyHeartFrequencyStore();

export default babyHeartFrequencyStore;
