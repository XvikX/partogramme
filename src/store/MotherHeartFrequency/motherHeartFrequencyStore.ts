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
  dataList: MotherHeartFrequency[] = [];
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
          if (fetchedFrequencies) {
            fetchedFrequencies.forEach(
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
    let frequency = this.dataList.find(
      (frequency) => frequency.data.id === json.id
    );
    if (!frequency) {
      frequency = new MotherHeartFrequency(
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
      this.removeMotherHeartFrequency(frequency);
    } else {
      frequency.updateFromJson(json);
    }
  }

  // Create a new mother heart frequency on the server and add it to the store
  createMotherHeartFrequency(
    value: number,
    created_at: string,
    Rank: number = this.highestRank + 1,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const frequency = new MotherHeartFrequency(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      value,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.dataList.push(frequency);
    return frequency;
  }

  // Delete a mother heart frequency from the store
  removeMotherHeartFrequency(frequency: MotherHeartFrequency) {
    this.dataList.splice(
      this.dataList.indexOf(frequency),
      1
    );
    frequency.data.isDeleted = true;
    this.transportLayer.updateMotherHeartFrequency(
      frequency.data
    );
  }

  // Get mother heart frequency list sorted by the delta time between now and the created_at date
  get sortedMotherHeartFrequencyList() {
    return this.dataList.slice().sort((a, b) => {
      return (
        new Date(a.data.created_at).getTime() -
        new Date(b.data.created_at).getTime()
      );
    });
  }

  // Get the highest rank of the mother heart frequency list
  get highestRank() {
    return this.dataList.reduce((prev, current) => {
      return prev > current.data.Rank
        ? prev
        : current.data.Rank;
    }, 0);
  }

  get motherHeartRateFrequencyListAsString() {
    return this.sortedMotherHeartFrequencyList.map(
      (frequency) => {
        return `${frequency.data.value} ${this.unit}`;
      }
    );
  }

  // CleanUp mother heart frequency store
  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
  }
}
export class MotherHeartFrequency {
  data: MotherHeartFrequency_type["Row"];
  store: MotherHeartFrequencyStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherHeartFrequencyStore,
    partogrammeStore: Partogramme,
    id: string,
    value: number,
    created_at: string,
    partogrammeId: string,
    Rank: number,
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

    this.store.transportLayer.updateMotherHeartFrequency(
      this.data
    );
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: MotherHeartFrequency_type["Row"]) {
    this.data = json;
  }

  delete() {
    this.store.removeMotherHeartFrequency(this);
  }

  dispose() {
    console.log("Disposing mother heart frequency");
  }
}
