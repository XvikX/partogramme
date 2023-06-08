import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from 'react-native-uuid';
import { Partogramme } from "../partogramme/partogrammeStore";

export type MotherBloodPressure_type = Database["public"]["Tables"]["MotherBloodPressure"];

export class MotherBloodPressureStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  motherBloodPressureList: MotherBloodPressure[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;

  constructor(partogrammeStore: Partogramme, rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedMotherBloodPressureList: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch mother blood pressures from the server and update the store
  loadMotherBloodPressures(partogrammeId: string = this.partogrammeStore.partogramme.id) {
    this.isLoading = true;
    this.transportLayer
      .fetchMotherBloodPressures(partogrammeId)
      .then((fetchedPressures) => {
        runInAction(() => {
          if (fetchedPressures.data) {
            fetchedPressures.data.forEach((json: MotherBloodPressure_type["Row"]) =>
              this.updateMotherBloodPressureFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

  // Update a mother blood pressure with information from the server. Guarantees a mother blood pressure only
  // exists once. Might either construct a new pressure, update an existing one,
  // or remove a pressure if it has been deleted on the server.
  updateMotherBloodPressureFromServer(json: MotherBloodPressure_type["Row"]) {
    let pressure = this.motherBloodPressureList.find(
      (pressure) => pressure.motherBloodPressure.id === json.id
    );
    if (!pressure) {
      pressure = new MotherBloodPressure(
        this,
        this.partogrammeStore,
        json.id,
        json.motherBloodPressure,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.motherBloodPressureList.push(pressure);
    }
    if (json.isDeleted) {
      this.removeMotherBloodPressure(pressure);
    } else {
      pressure.updateFromJson(json);
    }
  }

  // Create a new mother blood pressure on the server and add it to the store
  createMotherBloodPressure(
    motherBloodPressure: number,
    created_at: string,
    Rank: number | null,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const pressure = new MotherBloodPressure(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      motherBloodPressure,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.motherBloodPressureList.push(pressure);
    return pressure;
  }

  // Delete a mother blood pressure from the store
  removeMotherBloodPressure(pressure: MotherBloodPressure) {
    this.motherBloodPressureList.splice(
      this.motherBloodPressureList.indexOf(pressure),
      1
    );
    pressure.motherBloodPressure.isDeleted = true;
    this.transportLayer.updateMotherBloodPressure(pressure.motherBloodPressure);
  }

  // Get mother blood pressure list sorted by the delta time between now and the created_at date
  get sortedMotherBloodPressureList() {
    return this.motherBloodPressureList.slice().sort((a, b) => {
      return (
        new Date(a.motherBloodPressure.created_at).getTime() -
        new Date(b.motherBloodPressure.created_at).getTime()
      );
    });
  }
}

export class MotherBloodPressure {
  motherBloodPressure: MotherBloodPressure_type["Row"];
  store: MotherBloodPressureStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherBloodPressureStore,
    partogrammeStore: Partogramme,
    id: string,
    motherBloodPressure: number,
    created_at: string,
    partogrammeId: string,
    Rank: number | null,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      motherBloodPressure: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.motherBloodPressure = {
      id: id,
      motherBloodPressure: motherBloodPressure,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateMotherBloodPressure(this.motherBloodPressure);
  }

  get asJson() {
    return {
      ...this.motherBloodPressure,
    };
  }

  updateFromJson(json: MotherBloodPressure_type["Row"]) {
    this.motherBloodPressure = json;
  }

  delete() {
    this.store.removeMotherBloodPressure(this);
  }

  dispose() {
    console.log("Disposing mother blood pressure");
  }
}
