import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import { v4 as uuidv4 } from "uuid";
import { Partogramme } from "../partogramme/partogrammeStore";

export type Dilation_type = Database["public"]["Tables"]["Dilation"];

export class DilationStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  dilationList: Dilation[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;

  constructor(partogrammeStore: Partogramme, rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedDilationList: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch dilations from the server and update the store
  loadDilations(partogrammeId: string = this.partogrammeStore.partogramme.id) {
    this.isLoading = true;
    this.transportLayer.fetchDilations(partogrammeId).then((fetchedDilations) => {
      runInAction(() => {
        if (fetchedDilations.data) {
          fetchedDilations.data.forEach((json: Dilation_type["Row"]) => this.updateDilationFromServer(json));
          this.isLoading = false;
        }
      });
    });
  }

  // Update a dilation with information from the server. Guarantees a dilation only exists once.
  // Might either construct a new dilation, update an existing one,
  // or remove a dilation if it has been deleted on the server.
  updateDilationFromServer(json: Dilation_type["Row"]) {
    let dilation = this.dilationList.find((dilation) => dilation.dilation.id === json.id);
    if (!dilation) {
      dilation = new Dilation(
        this,
        this.partogrammeStore,
        json.id,
        json.created_at,
        json.dilation,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.dilationList.push(dilation);
    }
    if (json.isDeleted) {
      this.removeDilation(dilation);
    } else {
      dilation.updateFromJson(json);
    }
  }

  // Create a new dilation on the server and add it to the store
  createDilation(
    created_at: string,
    dilation: number,
    Rank: number | null,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const dilationObj = new Dilation(
      this,
      this.partogrammeStore,
      uuidv4(),
      created_at,
      dilation,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.dilationList.push(dilationObj);
    return dilationObj;
  }

  // Delete a dilation from the store
  removeDilation(dilation: Dilation) {
    this.dilationList.splice(this.dilationList.indexOf(dilation), 1);
    dilation.dilation.isDeleted = true;
    this.transportLayer.updateDilation(dilation.dilation);
  }

  // Get dilation list sorted by the delta time between now and the created_at date
  get sortedDilationList() {
    return this.dilationList.slice().sort((a, b) => {
      return new Date(a.dilation.created_at).getTime() - new Date(b.dilation.created_at).getTime();
    });
  }
}

export class Dilation {
  dilation: Dilation_type["Row"];
  store: DilationStore;
  partogrammeStore: Partogramme;

  constructor(
    store: DilationStore,
    partogrammeStore: Partogramme,
    id: string,
    created_at: string,
    dilation: number,
    partogrammeId: string,
    Rank: number | null,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      dilation: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.dilation = {
      id: id,
      created_at: created_at,
      dilation: dilation,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateDilation(this.dilation);
  }

  get asJson() {
    return {
      ...this.dilation,
    };
  }

  updateFromJson(json: Dilation_type["Row"]) {
    this.dilation = json;
  }

  delete() {
    this.store.removeDilation(this);
  }

  dispose() {
    console.log("Disposing dilation");
  }
}