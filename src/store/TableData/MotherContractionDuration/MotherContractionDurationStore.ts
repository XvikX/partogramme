import {
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Database } from "../../../../types/supabase";
import { TransportLayer } from "../../../transport/transportLayer";
import { RootStore } from "../../rootStore";
import uuid from "react-native-uuid";
import { Partogramme } from "../../partogramme/partogrammeStore";
import { Alert, Platform } from "react-native";
import { DataStore } from "../../DataStore";

export type MotherContractionDuration_t =
  Database["public"]["Tables"]["MotherContractionDuration"];

export class MotherContractionDurationStore extends DataStore {
  dataList: MotherContractionDuration[] = [];

  constructor(
    partogrammeStore: Partogramme,
    rootStore: RootStore,
    transportLayer: TransportLayer
  ) {
    super(
      partogrammeStore,
      rootStore,
      transportLayer,
      "Durée des contractions de la mère",
      "s"
    );
    makeObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedMotherContractionDurationList: computed,
      highestRank: computed,
      DataListAsString: computed,
      dataList: observable,
    });
  }

  async fetch(partogrammeId: string): Promise<any> {
    return this.transportLayer.fetchMotherContractionDurations(partogrammeId);
  }

  async createData(json: any): Promise<any> {
    const data = new MotherContractionDuration(
      this,
      this.partogrammeStore,
      json.id ? json.id : uuid.v4().toString(),
      json.value,
      json.created_at,
      this.partogrammeStore.partogramme.id,
      json.Rank,
      (json.isDeleted = undefined ? false : json.isDeleted)
    );
    this.transportLayer
      .insertMotherContractionDuration(data.data)
      .then((response: any) => {
        console.log(this.name + " created");
        runInAction(() => {
          this.dataList.push(data);
        });
      })
      .catch((error: any) => {
        console.log(error);
        Platform.OS === "web"
          ? null
          : Alert.alert(
              "Erreur",
              `Impossible de créer la ${this.name}`
            );
        runInAction(() => {
          this.state = "error";
        });
        Promise.reject(error);
      });
    return Promise.resolve(data);
  }

  async remove(data: MotherContractionDuration) {
    this.transportLayer
      .deleteMotherContractionDuration(data.data)
      .then((response: any) => {
        console.log(this.name + " deleted");
        runInAction(() => {
          this.dataList.splice(this.dataList.indexOf(data), 1);
        });
      })
      .catch((error: any) => {
        console.log(error);
        Platform.OS === "web"
          ? null
          : Alert.alert(
              "Erreur",
              `Impossible de supprimer la ${this.name} de la mère`
            );
        runInAction(() => {
          this.state = "error";
        });
      });
  }

  async updateFromServer(json: any): Promise<any> {
    {
      let motherContractionDuration = this.dataList.find(
        (motherContractionDuration) =>
          motherContractionDuration.data.id === json.id
      );
      if (!motherContractionDuration) {
        motherContractionDuration = new MotherContractionDuration(
          this,
          this.partogrammeStore,
          json.id,
          json.value,
          json.created_at,
          json.partogrammeId,
          json.Rank,
          json.isDeleted
        );
        this.dataList.push(motherContractionDuration);
      }
      if (json.isDeleted) {
        this.remove(motherContractionDuration);
      } else {
        motherContractionDuration.updateFromJson(json);
      }
    }
  }

  get sortedMotherContractionDurationList() {
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

  get DataListAsString() {
    return this.sortedMotherContractionDurationList.map(
      (data) => data.data.value.toString() + " " + this.unit
    );
  }

  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
    this.state = "done";
    this.isInSync = false;
    this.isLoading = false;
  }
}

export class MotherContractionDuration {
  data: MotherContractionDuration_t["Row"] = {
    id: "",
    value: 0,
    created_at: "",
    partogrammeId: "",
    Rank: null,
    isDeleted: false,
  };
  store: MotherContractionDurationStore;
  partogrammeStore: Partogramme;

  constructor(
    store: MotherContractionDurationStore,
    partogrammeStore: Partogramme,
    id: string,
    value: number,
    created_at: string,
    partogrammeId: string,
    Rank: number,
    isDeleted: boolean = false
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

    this.store.transportLayer.updateMotherContractionDuration(this.data);
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: MotherContractionDuration_t["Row"]) {
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
      return Promise.reject("Not a number");
    }
    let updatedData = this.asJson;
    updatedData.value = Number(value);
    this.store.transportLayer
      .updateMotherContractionDuration(updatedData)
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
    this.store.remove(this);
  }

  dispose() {
    console.log("Disposing mother blood pressure");
  }
}
