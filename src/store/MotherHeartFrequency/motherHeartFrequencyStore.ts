import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from "react-native-uuid";
import { Partogramme } from "../partogramme/partogrammeStore";

export type MotherHeartFrequency_type =
  Database["public"]["Tables"]["MotherHeartFrequency"];

export class MotherHeartFrequencyStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  motherHeartFrequencyList: MotherHeartFrequency[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;
  name = "Fréquence cardiaque de la mère";
  unit = "bpm";

  constructor(
    partogrammeStore: Partogramme,
    rootStore: RootStore,
    transportLayer: TransportLayer
  ) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedMotherHeartFrequencyList: computed,
      highestRank: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch mother heart frequencies from the server and update the store
  loadMotherHeartFrequencies(
    partogrammeId: string = this.partogrammeStore.partogramme.id
  ) {
    this.isLoading = true;
    this.transportLayer
      .fetchMotherHeartFrequencies(partogrammeId)
      .then((fetchedFrequencies) => {
        runInAction(() => {
          if (fetchedFrequencies.data) {
            fetchedFrequencies.data.forEach(
              (json: MotherHeartFrequency_type["Row"]) =>
                this.updateMotherHeartFrequencyFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

  // Update a mother heart frequency with information from the server. Guarantees a mother heart frequency only
  // exists once. Might either construct a new frequency, update an existing one,
  // or remove a frequency if it has been deleted on the server.
  updateMotherHeartFrequencyFromServer(json: MotherHeartFrequency_type["Row"]) {
    let frequency = this.motherHeartFrequencyList.find(
      (frequency) => frequency.motherHeartFrequency.id === json.id
    );
    if (!frequency) {
      frequency = new MotherHeartFrequency(
        this,
        this.partogrammeStore,
        json.id,
        json.motherFc,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.motherHeartFrequencyList.push(frequency);
    }
    if (json.isDeleted) {
      this.removeMotherHeartFrequency(frequency);
    } else {
      frequency.updateFromJson(json);
    }
  }

  // Create a new mother heart frequency on the server and add it to the store
  createMotherHeartFrequency(
    motherFc: number,
    created_at: string,
    Rank: number = this.highestRank + 1,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const frequency = new MotherHeartFrequency(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      motherFc,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.motherHeartFrequencyList.push(frequency);
    return frequency;
  }

  // Delete a mother heart frequency from the store
  removeMotherHeartFrequency(frequency: MotherHeartFrequency) {
    this.motherHeartFrequencyList.splice(
      this.motherHeartFrequencyList.indexOf(frequency),
      1
    );
    frequency.motherHeartFrequency.isDeleted = true;
    this.transportLayer.updateMotherHeartFrequency(
      frequency.motherHeartFrequency
    );
  }

  // Get mother heart frequency list sorted by the delta time between now and the created_at date
  get sortedMotherHeartFrequencyList() {
    return this.motherHeartFrequencyList.slice().sort((a, b) => {
      return (
        new Date(a.motherHeartFrequency.created_at).getTime() -
        new Date(b.motherHeartFrequency.created_at).getTime()
      );
    });
  }

  // Get the highest rank of the mother heart frequency list
  get highestRank() {
    return this.motherHeartFrequencyList.reduce((prev, current) => {
      return prev > current.motherHeartFrequency.Rank
        ? prev
        : current.motherHeartFrequency.Rank;
    }, 0);
  }
}

export class MotherHeartFrequency {
  motherHeartFrequency: MotherHeartFrequency_type["Row"];
  store: MotherHeartFrequencyStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherHeartFrequencyStore,
    partogrammeStore: Partogramme,
    id: string,
    motherFc: number,
    created_at: string,
    partogrammeId: string,
    Rank: number,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      motherHeartFrequency: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.motherHeartFrequency = {
      id: id,
      motherFc: motherFc,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateMotherHeartFrequency(
      this.motherHeartFrequency
    );
  }

  get asJson() {
    return {
      ...this.motherHeartFrequency,
    };
  }

  updateFromJson(json: MotherHeartFrequency_type["Row"]) {
    this.motherHeartFrequency = json;
  }

  delete() {
    this.store.removeMotherHeartFrequency(this);
  }

  dispose() {
    console.log("Disposing mother heart frequency");
  }
}
