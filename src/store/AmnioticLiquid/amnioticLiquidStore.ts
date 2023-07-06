import { computed, makeAutoObservable, observable, runInAction } from "mobx";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import uuid from "react-native-uuid";
import { Partogramme } from "../partogramme/partogrammeStore";
import { Alert, Platform } from "react-native";

export type AmnioticLiquid_type =
  Database["public"]["Tables"]["amnioticLiquid"];

export class AmnioticLiquidStore {
  rootStore: RootStore;
  partogrammeStore: Partogramme;
  transportLayer: TransportLayer;
  amnioticLiquidList: AmnioticLiquid[] = [];
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
      .then((fetchedLiquids) => {
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
                .then(() => {})
            )
            this.state = "done";
          }
        });
      })
      .catch((error) => {
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
    let liquid = this.amnioticLiquidList.find(
      (liquid) => liquid.amnioticLiquid.id === json.id
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
        json.stateLiquid
      );
      this.transportLayer
        .updateAmnioticLiquid(liquid.amnioticLiquid)
        .then(() => {
          runInAction(() => {
            this.amnioticLiquidList.push(liquid!);
            this.state = "done";
          });
        })
        .catch((error) => {
          runInAction(() => {
            console.log(error);
            this.state = "error";
          });
          return Promise.reject(error);
        });
    }
    if (json.isDeleted) {
      this.removeAmnioticLiquid(liquid)
      .then(() => {})
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
      .updateAmnioticLiquid(liquid.amnioticLiquid)
      .then(() => {
        runInAction(() => {
          this.amnioticLiquidList.push(liquid!);
          this.state = "done";
        });
      })
      .catch((error) => {
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
    liquid.amnioticLiquid.isDeleted = true;
    this.transportLayer
      .updateAmnioticLiquid(liquid.amnioticLiquid)
      .then(() => {
        runInAction(() => {
          this.amnioticLiquidList.splice(
            this.amnioticLiquidList.indexOf(liquid),
            1
          );
          this.state = "done";
        });
      })
      .catch((error) => {
        runInAction(() => {
          liquid.amnioticLiquid.isDeleted = false;
          console.log(error);
          this.state = "error";
        });
        return Promise.reject(error);
      });
  }

  // Get amniotic liquid list sorted by the created_at date
  get sortedAmnioticLiquidList() {
    return this.amnioticLiquidList.slice().sort((a, b) => {
      return (
        new Date(a.amnioticLiquid.created_at).getTime() -
        new Date(b.amnioticLiquid.created_at).getTime()
      );
    });
  }

  // Get the highest rank of the amniotic liquid list
  get highestRank() {
    return this.amnioticLiquidList.reduce((prev, current) => {
      return prev > current.amnioticLiquid.Rank
        ? prev
        : current.amnioticLiquid.Rank;
    }, 0);
  }
  // Get the every amnioticliquid state from the list
  get amnioticLiquidAsTableString() {
    return this.amnioticLiquidList.map((liquid) => {
      return liquid.amnioticLiquid.stateLiquid.toString();
    });
  }
}

export class AmnioticLiquid {
  amnioticLiquid: AmnioticLiquid_type["Row"];
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
      amnioticLiquid: observable,
      updateFromJson: false,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.amnioticLiquid = {
      id: id,
      created_at: created_at,
      partogrammeId: partogrammeId,
      Rank: Rank,
      isDeleted: isDeleted,
      stateLiquid: stateLiquid,
    };
  }

  get asJson() {
    return {
      ...this.amnioticLiquid,
    };
  }

  updateFromJson(json: AmnioticLiquid_type["Row"]) {
    this.amnioticLiquid = json;
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

  dispose() {
    console.log("Disposing amniotic liquid");
  }
}
