import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../../types/supabase";
import { TransportLayer } from "../../../transport/transportLayer";
import { RootStore } from "../../rootStore";
import uuid from "react-native-uuid";
import { Partogramme } from "../../partogramme/partogrammeStore";
import { Alert, Platform } from "react-native";

export type MotherBloodPressure_type =
  Database["public"]["Tables"]["MotherBloodPressure"];

export class MotherBloodPressureStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  dataList: MotherBloodPressure[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;
  name = "Pressions artérielles de la mère";
  unit = "mmHg";

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
      sortedMotherBloodPressureList: computed,
      highestRank: computed,
      motherBloodPressureListAsString: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch mother blood pressures from the server and update the store
  loadMotherBloodPressures(
    partogrammeId: string = this.partogrammeStore.partogramme.id
  ) {
    this.isLoading = true;
    this.transportLayer
      .fetchMotherBloodPressures(partogrammeId)
      .then((fetchedPressures) => {
        runInAction(() => {
          if (fetchedPressures) {
            fetchedPressures.forEach((json: MotherBloodPressure_type["Row"]) =>
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
    let pressure = this.dataList.find(
      (pressure) => pressure.data.id === json.id
    );
    if (!pressure) {
      pressure = new MotherBloodPressure(
        this,
        this.partogrammeStore,
        json.id,
        json.value,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.dataList.push(pressure);
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
    Rank: number = this.highestRank + 1,
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
    this.dataList.push(pressure);
    return pressure;
  }

  // Delete a mother blood pressure from the store
  removeMotherBloodPressure(pressure: MotherBloodPressure) {
    this.dataList.splice(this.dataList.indexOf(pressure), 1);
    pressure.data.isDeleted = true;
    this.transportLayer.updateMotherBloodPressure(pressure.data);
  }

  // Get mother blood pressure list sorted by the delta time between now and the created_at date
  get sortedMotherBloodPressureList() {
    return this.dataList.slice().sort((a, b) => {
      return (
        new Date(a.data.created_at).getTime() -
        new Date(b.data.created_at).getTime()
      );
    });
  }

  // Get the highest rank of the mother blood pressure list
  get highestRank() {
    return this.dataList.reduce((prev, current) => {
      return prev > current.data.Rank ? prev : current.data.Rank;
    }, 0);
  }

  // Get every mother blood pressure in the list as string
  get motherBloodPressureListAsString() {
    return this.dataList.map((pressure) => pressure.data.value.toString());
  }

  // clean up the store
  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
    this.state = "done";
    this.isInSync = false;
    this.isLoading = false;
  }
}

export class MotherBloodPressure {
  data: MotherBloodPressure_type["Row"];
  store: MotherBloodPressureStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherBloodPressureStore,
    partogrammeStore: Partogramme,
    id: string,
    motherBloodPressure: number,
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
      value: motherBloodPressure,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateMotherBloodPressure(this.data);
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: MotherBloodPressure_type["Row"]) {
    this.data = json;
  }

  async update(value: String) {
    let convValue = Number(value);
    if (isNaN(convValue)) {
      Platform.OS === "web"
        ? null
        : Alert.alert(
            "Erreur",
            "La valeur saisie n'est pas un nombre. Veuillez saisir un nombre"
          );
          return  Promise.reject("Not a number");
        }
    let updatedData = this.asJson;
    updatedData.value = Number(value);
    this.store.transportLayer
      .updateMotherBloodPressure(updatedData)
      .then((response: any) => {
        console.log(this.store.name + " updated");
        runInAction(() => {
          this.data = updatedData;
        });
      })
      .catch((error: any) => {
        console.log(error);
        Platform.OS === "web"
          ? null
          : Alert.alert(
              "Erreur",
              "Impossible de mettre à jour les liquides amniotiques"
            );
        runInAction(() => {
          this.store.state = "error";
        });
        return Promise.reject(error);
      });
  }

  delete() {
    this.store.removeMotherBloodPressure(this);
  }

  dispose() {
    console.log("Disposing mother blood pressure");
  }
}
