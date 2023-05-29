import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import { v4 as uuidv4 } from "uuid";
import { Partogramme } from "../partogramme/partogrammeStore";

export type BabyHeartFrequency_type = Database["public"]["Tables"]["BabyHeartFrequency"];

export class BabyHeartFrequencyStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  babyHeartFrequencyList: BabyHeartFrequency[] = [];
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
          if (fetchedFrequencies.data) {
            fetchedFrequencies.data.forEach((json: BabyHeartFrequency_type["Row"]) =>
              this.updateBabyHeartFrequencyFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

  // Update a baby heart frequency with information from the server. Guarantees a baby heart frequency only
  // exists once. Might either construct a new frequency, update an existing one,
  // or remove a frequency if it has been deleted on the server.
  updateBabyHeartFrequencyFromServer(json: BabyHeartFrequency_type["Row"]) {
    let frequency = this.babyHeartFrequencyList.find(
      (frequency) => frequency.babyHeartFrequency.id === json.id
    );
    if (!frequency) {
      frequency = new BabyHeartFrequency(
        this,
        this.partogrammeStore,
        json.id,
        json.babyFc,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.babyHeartFrequencyList.push(frequency);
    }
    if (json.isDeleted) {
      this.removeBabyHeartFrequency(frequency);
    } else {
      frequency.updateFromJson(json);
    }
  }

  // Create a new baby heart frequency on the server and add it to the store
  createBabyHeartFrequency(
    babyFc: number,
    created_at: string,
    Rank: number | null,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const frequency = new BabyHeartFrequency(
      this,
      this.partogrammeStore,
      uuidv4(),
      babyFc,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.babyHeartFrequencyList.push(frequency);
    return frequency;
  }

  // Delete a baby heart frequency from the store
  removeBabyHeartFrequency(frequency: BabyHeartFrequency) {
    this.babyHeartFrequencyList.splice(
      this.babyHeartFrequencyList.indexOf(frequency),
      1
    );
    frequency.babyHeartFrequency.isDeleted = true;
    this.transportLayer.updateBabyHeartFrequency(frequency.babyHeartFrequency);
  }

  // Get baby frequency list sorted by the delta time between now and the created_at date
  get sortedBabyHeartFrequencyList() {
    return this.babyHeartFrequencyList.slice().sort((a, b) => {
      return (
        new Date(a.babyHeartFrequency.created_at).getTime() -
        new Date(b.babyHeartFrequency.created_at).getTime()
      );
    });
  }
}

export class BabyHeartFrequency {
  babyHeartFrequency: BabyHeartFrequency_type["Row"];
  store: BabyHeartFrequencyStore;
  partogrammeStore: Partogramme;

  constructor(
    store: BabyHeartFrequencyStore,
    partogrammeStore: Partogramme,
    id: string,
    babyFc: number,
    created_at: string,
    partogrammeId: string,
    Rank: number | null,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      babyHeartFrequency: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.babyHeartFrequency = {
      id: id,
      babyFc: babyFc,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateBabyHeartFrequency(this.babyHeartFrequency);
  }

  get asJson() {
    return {
      ...this.babyHeartFrequency,
    };
  }

  updateFromJson(json: BabyHeartFrequency_type["Row"]) {
    this.babyHeartFrequency = json;
  }

  delete() {
    this.store.removeBabyHeartFrequency(this);
  }

  dispose() {
    console.log("Disposing baby heart frequency");
  }
}
