import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from '../../../../types/supabase';
import { TransportLayer } from "../../../transport/transportLayer";
import { RootStore } from "../../rootStore";
import uuid from "react-native-uuid";
import { Partogramme } from "../../partogramme/partogrammeStore";
import { Alert, Platform } from "react-native";
import { throws } from "assert";
import { liquidStates } from "../../../../types/constants";
import { isLiquidState } from "../../../misc/CheckTypes";

export type AmnioticLiquid_type =
  Database["public"]["Tables"]["amnioticLiquid"];

export class AmnioticLiquidStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  dataList: AmnioticLiquid[] = [];
  state = "done"; // "pending", "done" or "error"
  isInSync = false;
  name = "Liquides amniotiques";
  unit = "";

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
      sortedAmnioticLiquidList: computed,
      highestRank: computed,
      amnioticLiquidAsTableString: computed,
    });
    this.partogrammeStore = partogrammeStore;
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  // Fetch amniotic liquids from the server and update the store
  async loadAmnioticLiquids(
    partogrammeId: string = this.partogrammeStore.partogramme.id
  ) {
    this.state = "pending";
    this.transportLayer
      .fetchAmnioticLiquids(partogrammeId)
      .then((fetchedLiquids:any) => {
        runInAction(() => {
          if (fetchedLiquids) {
            fetchedLiquids.forEach((json: AmnioticLiquid_type["Row"]) =>
              this.updateAmnioticLiquidFromServer(json)
                .catch((error) => {
                  console.log(error);
                  Platform.OS === "web"
                    ? null
                    : Alert.alert(
                      "Erreur",
                      "Impossible de charger les liquides amniotiques"
                    );
                })
                .then(() => { })
            )
            this.state = "done";
          }
        });
      })
      .catch((error:any) => {
        console.log(error);
        this.state = "error";
        Platform.OS !== "web"
          ? null
          : Alert.alert(
            "Erreur",
            "Impossible de charger les liquides amniotiques"
          );
        return Promise.reject(error);
      });
  }

  // Update an amniotic liquid with information from the server. Guarantees an amniotic liquid only
  // exists once. Might either construct a new liquid, update an existing one,
  // or remove a liquid if it has been deleted on the server.
  async updateAmnioticLiquidFromServer(json: AmnioticLiquid_type["Row"]) {
    let liquid = this.dataList.find(
      (liquid) => liquid.data.id === json.id
    );
    if (!liquid) {
      liquid = new AmnioticLiquid(
        this,
        this.partogrammeStore,
        json.id,
        json.created_at,
        json.partogrammeId,
        json.Rank,
        json.isDeleted,
        json.value
      );
      this.transportLayer
        .updateAmnioticLiquid(liquid.data)
        .then(() => {
          runInAction(() => {
            this.dataList.push(liquid!);
            this.state = "done";
          });
        })
        .catch((error:any) => {
          runInAction(() => {
            console.log(error);
            this.state = "error";
          });
          return Promise.reject(error);
        });
    }
    if (json.isDeleted) {
      this.removeAmnioticLiquid(liquid)
        .then(() => { })
        .catch((error) => {
          console.log(error);
          Platform.OS === "web"
            ? null
            : Alert.alert(
              "Erreur",
              "Impossible de supprimer les liquides amniotiques"
            );
          return Promise.reject(error);
        });
    } else {
      liquid.updateFromJson(json);
    }
  }

  // Create a new amniotic liquid on the server and add it to the store
  async createAmnioticLiquid(
    created_at: string,
    Rank: number,
    stateLiquid: Database["public"]["Enums"]["LiquidState"],
    isDeleted: boolean | null = false,
    partogrammeId: string = this.partogrammeStore.partogramme.id
  ) {
    const liquid = new AmnioticLiquid(
      this,
      this.partogrammeStore,
      uuid.v4().toString(),
      created_at,
      partogrammeId,
      Rank,
      isDeleted,
      stateLiquid
    );
    this.transportLayer
      .updateAmnioticLiquid(liquid.data)
      .then(() => {
        runInAction(() => {
          this.dataList.push(liquid!);
          this.state = "done";
        });
      })
      .catch((error:any) => {
        runInAction(() => {
          console.log(error);
          this.state = "error";
        });
        return Promise.reject(error);
      });
    return liquid;
  }

  // Delete an amniotic liquid from the store
  async removeAmnioticLiquid(liquid: AmnioticLiquid) {
    liquid.data.isDeleted = true;
    this.transportLayer
      .updateAmnioticLiquid(liquid.data)
      .then(() => {
        runInAction(() => {
          this.dataList.splice(
            this.dataList.indexOf(liquid),
            1
          );
          this.state = "done";
        });
      })
      .catch((error:any) => {
        runInAction(() => {
          liquid.data.isDeleted = false;
          console.log(error);
          this.state = "error";
        });
        return Promise.reject(error);
      });
  }

  // Get amniotic liquid list sorted by the created_at date
  get sortedAmnioticLiquidList() {
    return this.dataList.slice().sort((a, b) => {
      return (
        new Date(a.data.created_at).getTime() -
        new Date(b.data.created_at).getTime()
      );
    });
  }

  // Get the highest rank of the amniotic liquid list
  get highestRank() {
    return this.dataList.reduce((prev, current) => {
      return prev > current.data.Rank
        ? prev
        : current.data.Rank;
    }, 0);
  }
  // Get the every amnioticliquid state from the list
  get amnioticLiquidAsTableString() {
    return this.dataList.map((liquid) => {
      return liquid.data.value.toString();
    });
  }

  // Clean up the store
  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
  }
}

export class AmnioticLiquid {
  data: AmnioticLiquid_type["Row"];
  store: AmnioticLiquidStore;
  partogrammeStore: Partogramme;

  constructor(
    store: AmnioticLiquidStore,
    partogrammeStore: Partogramme,
    id: string,
    created_at: string,
    partogrammeId: string,
    Rank: number,
    isDeleted: boolean | null = false,
    stateLiquid: Database["public"]["Enums"]["LiquidState"]
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
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
      value: stateLiquid,
    };
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: AmnioticLiquid_type["Row"]) {
    this.data = json;
  }

  delete() {
    this.store.removeAmnioticLiquid(this)
      .then(() => {
        console.log("Amniotic liquid deleted");
      })
      .catch((error) => {
        console.log(error);
        Platform.OS === "web"
          ? null
          : Alert.alert(
            "Erreur",
            "Impossible de supprimer les liquides amniotiques"
          );
      });
  }

  async update(value: String) {
    let updatedData = this.asJson;
    updatedData.value = value;
    this.store.transportLayer
      .updateAmnioticLiquid(updatedData)
      .then((response:any) => {
        console.log(this.store.name + " updated");
        runInAction(() => {
          this.data = updatedData;
        })
      })
      .catch((error:any) => {
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
    console.log("Disposing amniotic liquid");
  }
}
