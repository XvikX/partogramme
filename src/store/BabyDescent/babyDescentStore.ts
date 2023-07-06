import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from 'react-native-uuid';
import { Partogramme } from "../partogramme/partogrammeStore";

export type BabyDescent_type = Database["public"]["Tables"]["BabyDescent"];

export class BabyDescentStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  babyDescentList: BabyDescent[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;

  constructor(partogrammeStore: Partogramme, rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedBabyDescentList: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch baby descents from the server and update the store
  loadBabyDescents(partogrammeId: string = this.partogrammeStore.partogramme.id) {
    this.isLoading = true;
    this.transportLayer
      .fetchBabyDescents(partogrammeId)
      .then((fetchedDescents) => {
        runInAction(() => {
          if (fetchedDescents) {
            fetchedDescents.forEach((json: BabyDescent_type["Row"]) =>
              this.updateBabyDescentFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

  // Update a baby descent with information from the server. Guarantees a baby descent only
  // exists once. Might either construct a new descent, update an existing one,
  // or remove a descent if it has been deleted on the server.
  updateBabyDescentFromServer(json: BabyDescent_type["Row"]) {
    let descent = this.babyDescentList.find(
      (descent) => descent.babyDescent.id === json.id
    );
    if (!descent) {
      descent = new BabyDescent(
        this,
        this.partogrammeStore,
        json.id,
        json.babydescent,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.babyDescentList.push(descent);
    }
    if (json.isDeleted) {
      this.removeBabyDescent(descent);
    } else {
      descent.updateFromJson(json);
    }
  }

  // Create a new baby descent on the server and add it to the store
  createBabyDescent(
    babyDescent: number,
    created_at: string,
    Rank: number | null,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const descent = new BabyDescent(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      babyDescent,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.babyDescentList.push(descent);
    return descent;
  }

  // Delete a baby descent from the store
  removeBabyDescent(descent: BabyDescent) {
    this.babyDescentList.splice(
      this.babyDescentList.indexOf(descent),
      1
    );
    descent.babyDescent.isDeleted = true;
    this.transportLayer.updateBabyDescent(descent.babyDescent);
  }

  // Get baby descent list sorted by the delta time between now and the created_at date
  get sortedBabyDescentList() {
    return this.babyDescentList.slice().sort((a, b) => {
      return (
        new Date(a.babyDescent.created_at).getTime() -
        new Date(b.babyDescent.created_at).getTime()
      );
    });
  }
}

export class BabyDescent {
  babyDescent: BabyDescent_type["Row"];
  store: BabyDescentStore;
  partogrammeStore: Partogramme;

  constructor(
    store: BabyDescentStore,
    partogrammeStore: Partogramme,
    id: string,
    babyDescent: number,
    created_at: string,
    partogrammeId: string,
    Rank: number | null,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      babyDescent: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.babyDescent = {
      id: id,
      babydescent: babyDescent,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateBabyDescent(this.babyDescent);
  }

  get asJson() {
    return {
      ...this.babyDescent,
    };
  }

  updateFromJson(json: BabyDescent_type["Row"]) {
    this.babyDescent = json;
  }

  delete() {
    this.store.removeBabyDescent(this);
  }

  dispose() {
    console.log("Disposing baby descent");
  }
}
