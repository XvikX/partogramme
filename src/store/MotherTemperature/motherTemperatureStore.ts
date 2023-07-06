import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from 'react-native-uuid';
import { Partogramme } from "../partogramme/partogrammeStore";

export type MotherTemperature_type = Database["public"]["Tables"]["MotherTemperature"];

export class MotherTemperatureStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  motherTemperatureList: MotherTemperature[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;
  name = "Températures de la mère";
  unit = "°C";

  constructor(partogrammeStore: Partogramme, rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedMotherTemperatureList: computed,
      highestRank: computed,
      motherTemperatureListAsString: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch mother temperatures from the server and update the store
  loadMotherTemperatures(partogrammeId: string = this.partogrammeStore.partogramme.id) {
    this.isLoading = true;
    this.transportLayer
      .fetchMotherTemperatures(partogrammeId)
      .then((fetchedTemperatures) => {
        runInAction(() => {
          if (fetchedTemperatures) {
            fetchedTemperatures.forEach((json: MotherTemperature_type["Row"]) =>
              this.updateMotherTemperatureFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

  // Update a mother temperature with information from the server. Guarantees a mother temperature only
  // exists once. Might either construct a new temperature, update an existing one,
  // or remove a temperature if it has been deleted on the server.
  updateMotherTemperatureFromServer(json: MotherTemperature_type["Row"]) {
    let temperature = this.motherTemperatureList.find(
      (temperature) => temperature.motherTemperature.id === json.id
    );
    if (!temperature) {
      temperature = new MotherTemperature(
        this,
        this.partogrammeStore,
        json.id,
        json.motherTemperature,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.motherTemperatureList.push(temperature);
    }
    if (json.isDeleted) {
      this.removeMotherTemperature(temperature);
    } else {
      temperature.updateFromJson(json);
    }
  }

  // Create a new mother temperature on the server and add it to the store
  createMotherTemperature(
    motherTemperature: number,
    created_at: string,
    Rank: number = this.highestRank + 1,
    partogrammeId: string = this.partogrammeStore.partogramme.id,
    isDeleted: boolean | null = false
  ) {
    const temperature = new MotherTemperature(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      motherTemperature,
      created_at,
      partogrammeId,
      Rank,
      isDeleted
    );
    this.motherTemperatureList.push(temperature);
    return temperature;
  }

  // Delete a mother temperature from the store
  removeMotherTemperature(temperature: MotherTemperature) {
    this.motherTemperatureList.splice(
      this.motherTemperatureList.indexOf(temperature),
      1
    );
    temperature.motherTemperature.isDeleted = true;
    this.transportLayer.updateMotherTemperature(temperature.motherTemperature);
  }

  // Get mother temperature list sorted by the delta time between now and the created_at date
  get sortedMotherTemperatureList() {
    return this.motherTemperatureList.slice().sort((a, b) => {
      return (
        new Date(a.motherTemperature.created_at).getTime() -
        new Date(b.motherTemperature.created_at).getTime()
      );
    });
  }

  // Get the highest rank of the mother heart frequency list
  get highestRank() {
    return this.motherTemperatureList.reduce((prev, current) => {
      return prev > current.motherTemperature.Rank
        ? prev
        : current.motherTemperature.Rank;
    }, 0);
  }

  // Get mother temperature list as string
  get motherTemperatureListAsString() {
    return this.motherTemperatureList.map((temperature) => {
      return `${temperature.motherTemperature.motherTemperature} ${this.unit}`;
    });
  }
}

export class MotherTemperature {
  motherTemperature: MotherTemperature_type["Row"];
  store: MotherTemperatureStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherTemperatureStore,
    partogrammeStore: Partogramme,
    id: string,
    motherTemperature: number,
    created_at: string,
    partogrammeId: string,
    Rank: number,
    isDeleted: boolean | null = false
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      motherTemperature: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.motherTemperature = {
      id: id,
      motherTemperature: motherTemperature,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateMotherTemperature(this.motherTemperature);
  }

  get asJson() {
    return {
      ...this.motherTemperature,
    };
  }

  updateFromJson(json: MotherTemperature_type["Row"]) {
    this.motherTemperature = json;
  }

  delete() {
    this.store.removeMotherTemperature(this);
  }

  dispose() {
    console.log("Disposing mother temperature");
  }
}
