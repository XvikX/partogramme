import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from 'react-native-uuid';
import { Partogramme } from "../partogramme/partogrammeStore";
import { Alert } from "react-native";

export type BabyHeartFrequency_type = Database["public"]["Tables"]["BabyHeartFrequency"];

export class BabyHeartFrequencyStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  dataList: BabyHeartFrequency[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;

  constructor(partogrammeStore: Partogramme, rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedBabyHeartFrequencyList: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // fetch baby heart frequencies from the server and update the store
  loadBabyHeartFrequencies(partogrammeId: string = this.partogrammeStore.partogramme.id) {
    this.isLoading = true;
    this.transportLayer
      .fetchBabyHeartFrequencies(partogrammeId)
      .then((fetchedFrequencies) => {
        runInAction(() => {
          if (fetchedFrequencies) {
            fetchedFrequencies.forEach((json: BabyHeartFrequency_type["Row"]) =>
              this.updateBabyHeartFrequencyFromServer(json)
            );
            this.isLoading = false;
          }
        });
      })
       .catch((error) => {
        runInAction(() => {
          this.isLoading = false;
          Alert.alert("Erreur", "Impossible de charger les fréquences cardiaques du bébé");
        });
      });
  }

  // Update a baby heart frequency with information from the server. Guarantees a baby heart frequency only
  // exists once. Might either construct a new frequency, update an existing one,
  // or remove a frequency if it has been deleted on the server.
  updateBabyHeartFrequencyFromServer(json: BabyHeartFrequency_type["Row"]) {
    let frequency = this.dataList.find(
      (frequency) => frequency.data.id === json.id
    );
    if (!frequency) {
      frequency = new BabyHeartFrequency(
        this,
        this.partogrammeStore,
        json.id,
        json.value,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.dataList.push(frequency);
    }
    if (json.isDeleted) {
      this.removeBabyHeartFrequency(frequency);
    } else {
      frequency.updateFromJson(json);
    }
  }

  // Create a new baby heart frequency on the server and add it to the store
  async createBabyHeartFrequency(
    babyFc: number,
    created_at: string,
    Rank: number | null,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const frequency = new BabyHeartFrequency(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      babyFc,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );

    this.isLoading = true;
    this.transportLayer.updateBabyHeartFrequency(frequency.data)
      .then(() => {
        runInAction(() => {
          this.isLoading = false;
          this.dataList.push(frequency);
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Erreur", 
        "Impossible d'ajouter la fréquence cardiaque du bébé. \n Veuillez réessayer plus tard.");
      });
    return frequency;
  }

  // Delete a baby heart frequency from the store
  removeBabyHeartFrequency(frequency: BabyHeartFrequency) {
    this.dataList.splice(
      this.dataList.indexOf(frequency),
      1
    );
    frequency.data.isDeleted = true;
    this.transportLayer.updateBabyHeartFrequency(frequency.data);
  }

  // Get baby frequency list sorted by the delta time between now and the created_at date
  get sortedBabyHeartFrequencyList() {
    return this.dataList.slice().sort((a, b) => {
      return (
        new Date(a.data.created_at).getTime() -
        new Date(b.data.created_at).getTime()
      );
    });
  }

  // CLean up the store
  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
  }
}

export class BabyHeartFrequency {
  data: BabyHeartFrequency_type["Row"];
  store: BabyHeartFrequencyStore;
  partogrammeStore: Partogramme;

  constructor(
    store: BabyHeartFrequencyStore,
    partogrammeStore: Partogramme,
    id: string,
    value: number,
    created_at: string,
    partogrammeId: string,
    Rank: number | null,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      data: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.data = {
      id: id,
      value: value,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: BabyHeartFrequency_type["Row"]) {
    this.data = json;
  }

  delete() {
    this.store.removeBabyHeartFrequency(this);
  }

  dispose() {
    console.log("Disposing baby heart frequency");
  }
}
