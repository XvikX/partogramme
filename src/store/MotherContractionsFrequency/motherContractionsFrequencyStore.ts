import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from 'react-native-uuid';
import { Partogramme } from "../partogramme/partogrammeStore";

export type MotherContractionsFrequency_type = Database["public"]["Tables"]["MotherContractionsFrequency"];

export class MotherContractionsFrequencyStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  motherContractionsFrequencyList: MotherContractionsFrequency[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;
  name = "Fréquence des contractions";
  unit = "contractions/10min";

  constructor(partogrammeStore: Partogramme, rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedMotherContractionsFrequencyList: computed,
      highestRank : computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch mother contractions frequencies from the server and update the store
  loadMotherContractionsFrequencies(partogrammeId: string = this.partogrammeStore.partogramme.id) {
    this.isLoading = true;
    this.transportLayer
      .fetchMotherContractionsFrequencies(partogrammeId)
      .then((fetchedFrequencies) => {
        runInAction(() => {
          if (fetchedFrequencies.data) {
            fetchedFrequencies.data.forEach((json: MotherContractionsFrequency_type["Row"]) =>
              this.updateMotherContractionsFrequencyFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

  // Update a mother contractions frequency with information from the server. Guarantees a mother contractions frequency only
  // exists once. Might either construct a new frequency, update an existing one,
  // or remove a frequency if it has been deleted on the server.
  updateMotherContractionsFrequencyFromServer(json: MotherContractionsFrequency_type["Row"]) {
    let frequency = this.motherContractionsFrequencyList.find(
      (frequency) => frequency.motherContractionsFrequency.id === json.id
    );
    if (!frequency) {
      frequency = new MotherContractionsFrequency(
        this,
        this.partogrammeStore,
        json.id,
        json.motherContractionsFrequency,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.motherContractionsFrequencyList.push(frequency);
    }
    if (json.isDeleted) {
      this.removeMotherContractionsFrequency(frequency);
    } else {
      frequency.updateFromJson(json);
    }
  }

  // Create a new mother contractions frequency on the server and add it to the store
  createMotherContractionsFrequency(
    motherContractionsFrequency: number,
    created_at: string,
    Rank: number = this.highestRank + 1,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const frequency = new MotherContractionsFrequency(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      motherContractionsFrequency,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.motherContractionsFrequencyList.push(frequency);
    return frequency;
  }

  // Delete a mother contractions frequency from the store
  removeMotherContractionsFrequency(frequency: MotherContractionsFrequency) {
    this.motherContractionsFrequencyList.splice(
      this.motherContractionsFrequencyList.indexOf(frequency),
      1
    );
    frequency.motherContractionsFrequency.isDeleted = true;
    this.transportLayer.updateMotherContractionsFrequency(frequency.motherContractionsFrequency);
  }

  // Get mother contractions frequency list sorted by the delta time between now and the created_at date
  get sortedMotherContractionsFrequencyList() {
    return this.motherContractionsFrequencyList.slice().sort((a, b) => {
      return (
        new Date(a.motherContractionsFrequency.created_at).getTime() -
        new Date(b.motherContractionsFrequency.created_at).getTime()
      );
    });
  }

    // Get the highest rank of the mother contractions frequency list
    get highestRank() {
      return this.motherContractionsFrequencyList.reduce((prev, current) => {
        return prev > current.motherContractionsFrequency.Rank
          ? prev
          : current.motherContractionsFrequency.Rank;
      }, 0);
    }

    // Get mother contractions frequency list as string
    get motherContractionFrequencyListAsString() {
      return this.sortedMotherContractionsFrequencyList.map((frequency) => {
        return frequency.motherContractionsFrequency.motherContractionsFrequency.toString();
      });
    }
}

export class MotherContractionsFrequency {
  motherContractionsFrequency: MotherContractionsFrequency_type["Row"];
  store: MotherContractionsFrequencyStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherContractionsFrequencyStore,
    partogrammeStore: Partogramme,
    id: string,
    motherContractionsFrequency: number,
    created_at: string,
    partogrammeId: string,
    Rank: number,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      motherContractionsFrequency: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.motherContractionsFrequency = {
      id: id,
      motherContractionsFrequency: motherContractionsFrequency,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateMotherContractionsFrequency(this.motherContractionsFrequency);
  }

  get asJson() {
    return {
      ...this.motherContractionsFrequency,
    };
  }

  updateFromJson(json: MotherContractionsFrequency_type["Row"]) {
    this.motherContractionsFrequency = json;
  }

  delete() {
    this.store.removeMotherContractionsFrequency(this);
  }

  dispose() {
    console.log("Disposing mother contractions frequency");
  }
}
