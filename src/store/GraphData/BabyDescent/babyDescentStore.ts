import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../../types/supabase";
import { TransportLayer } from "../../../transport/transportLayer";
import { RootStore } from "../../rootStore";
import uuid from "react-native-uuid";
import { Partogramme } from "../../partogramme/partogrammeStore";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Alert, Platform } from "react-native";
import { GraphData } from "../GraphData";

export type BabyDescent_t = Database["public"]["Tables"]["BabyDescent"];

export class BabyDescentStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  dataList: BabyDescent[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  isLoading = false;
  name = "Descente du bébé";
  unit = "cm";

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
      sortedBabyDescentList: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch baby descents from the server and update the store
  loadBabyDescents(
    partogrammeId: string = this.partogrammeStore.partogramme.id
  ) {
    this.isLoading = true;
    this.transportLayer
      .fetchBabyDescents(partogrammeId)
      .then((fetchedDescents) => {
        runInAction(() => {
          if (fetchedDescents) {
            fetchedDescents.forEach((json: BabyDescent_t["Row"]) =>
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
  updateBabyDescentFromServer(json: BabyDescent_t["Row"]) {
    let descent = this.dataList.find(
      (descent) => descent.data.id === json.id
    );
    if (!descent) {
      descent = new BabyDescent(
        this,
        this.partogrammeStore,
        json.id,
        json.value,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted
      );
      this.dataList.push(descent);
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
    this.dataList.push(descent);
    return descent;
  }

  // Delete a baby descent from the store
  removeBabyDescent(descent: BabyDescent) {
    this.dataList.splice(this.dataList.indexOf(descent), 1);
    descent.data.isDeleted = true;
    this.transportLayer.updateBabyDescent(descent.data);
  }

  // Get baby descent list sorted by the delta time between now and the created_at date
  get sortedBabyDescentList() {
    return this.dataList.slice().sort((a, b) => {
      return (
        new Date(a.data.created_at).getTime() -
        new Date(b.data.created_at).getTime()
      );
    });
  }

  // Clean up the store
  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
  }
}

export class BabyDescent {
  data : BabyDescent_t["Row"] = {
    id: "",
    value: 0,
    created_at: "",
    partogrammeId: "",
    Rank: null,
    isDeleted: false,
  };

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
      data: observable,
      updateFromJson: false,
      asJson: computed,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.data = {
      id: id,
      value: babyDescent,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
    };

    this.store.transportLayer.updateBabyDescent(this.data);
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: BabyDescent_t["Row"]) {
    this.data = json;
  }

  delete() {
    this.store.removeBabyDescent(this);
  }

  async update(value : String)
  {
    let updatedData = this.asJson;
    updatedData.value = Number(value);
    this.store.transportLayer
      .updateBabyDescent(updatedData)
      .then((response) => {
        console.log(this.store.name + " updated");
        runInAction(() => {
          this.data = updatedData;
        })
      })
      .catch((error) => {
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

  dispose() {
    console.log("Disposing baby descent");
  }
}
