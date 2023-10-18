import { makeAutoObservable, runInAction, computed, observable } from "mobx";
import uuid from "react-native-uuid";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import {
  BabyHeartFrequency,
  BabyHeartFrequencyStore,
} from "../GraphData/BabyHeartFrequency/babyHeartFrequencyStore";
import {
  Dilation,
  DilationStore,
} from "../GraphData/Dilatation/dilatationStore";
import {
  BabyDescent,
  BabyDescentStore,
} from "../GraphData/BabyDescent/babyDescentStore";
import {
  AmnioticLiquid,
  AmnioticLiquidStore,
} from "../TableData/AmnioticLiquid/amnioticLiquidStore";
import {
  MotherTemperature,
  MotherTemperatureStore,
} from "../TableData/MotherTemperature/motherTemperatureStore";
import {
  MotherHeartFrequency,
  MotherHeartFrequencyStore,
} from "../TableData/MotherHeartFrequency/motherHeartFrequencyStore";
import {
  MotherContractionsFrequency,
  MotherContractionsFrequencyStore,
} from "../TableData/MotherContractionsFrequency/motherContractionsFrequencyStore";
import {
  MotherSystolicBloodPressure,
  MotherSystolicBloodPressureStore,
} from "../TableData/MotherSystolicBloodPressure/motherSystolicBloodPressureStore";
import {
  MotherDiastolicBloodPressure,
  MotherDiastolicBloodPressureStore,
} from "../TableData/MotherDiastolicBloodPressure/motherDiastolicBloodPressureStore";
import { DataInputTable_t } from "../../components/Dialogs/DialogDataInputTable";
import {
  MotherContractionDuration,
  MotherContractionDurationStore,
} from "../TableData/MotherContractionDuration/MotherContractionDurationStore";
import { Comment, CommentStore } from "../Comment/CommentStore";
import { makePersistable } from "mobx-persist-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log } from "console";

export type Partogramme_t = Database["public"]["Tables"]["Partogramme"];

export type dataStore_t =
  | BabyHeartFrequencyStore
  | DilationStore
  | BabyDescentStore
  | AmnioticLiquidStore
  | MotherTemperatureStore
  | MotherHeartFrequencyStore
  | MotherContractionsFrequencyStore
  | MotherContractionDurationStore
  | MotherSystolicBloodPressureStore
  | MotherDiastolicBloodPressureStore
  | CommentStore;

export type dataTable_t =
  | MotherSystolicBloodPressure
  | MotherDiastolicBloodPressure
  | MotherContractionsFrequency
  | MotherContractionDuration
  | MotherHeartFrequency
  | MotherTemperature
  | AmnioticLiquid;
export type data_t =
  | dataTable_t
  | BabyDescent
  | BabyHeartFrequency
  | Dilation
  | Comment;

export const getStatusBackgroundColor = (
  status: Database["public"]["Enums"]["PartogrammeState"]
) => {
  if (status === "ADMITTED") {
    return "#8c8c8c";
  }
  if (status === "IN_PROGRESS") {
    return "#fcdd7e";
  }
  if (status === "TRANSFERRED") {
    return "#168039";
  }
  if (status === "WORK_FINISHED") {
    return "#168039";
  }
};

export class PartogrammeStore {
  rootStore: RootStore;
  partogrammeList: Partogramme[] = [];
  state = "done"; // "pending", "done" or "error"
  isInSync = false;
  selectedPartogrammeId: string | null = null;
  transportLayer: TransportLayer;

  constructor(rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      isInSync: false,
      selectedPartogramme: computed,
      asJsonComplete: computed,
    });
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
    makePersistable(this, {
      name: "PartogrammeStore",
      properties: [
        {
          key: "partogrammeList",
          serialize: (partogrammeList) => {
            return this.serialize(partogrammeList);
          },
          deserialize: (values) => {
            return this.deserialize(values);
          },
        },
      ],
      storage: AsyncStorage,
      expireIn: 1000 * 60 * 60 * 24, // 7 days
      // stringify: false,
    }).then((persistStore) => {
      console.log("PartogrammeStore isHydrated");
      console.log(persistStore.isHydrated);
      console.log(JSON.stringify(this.asJsonComplete));
      // persistStore.clearPersistedStore().then(() => {
      //   console.log("PartogrammeStore clearPersistedStore");
      //   console.log(JSON.stringify(this.asJsonComplete));
      // });
    });
  }

  get selectedPartogramme(): Partogramme | undefined {
    return this.partogrammeList.find(
      (partogramme) => partogramme.partogramme.id === this.selectedPartogrammeId
    );
  }

  get asJsonComplete() {
    let data = {
      partogrammeList: [
        ...this.partogrammeList.map((partogramme) => {
          return {
            partogramme: partogramme.asJson,
            AmnioticLiquid: partogramme.amnioticLiquidStore.dataList.map(
              (amniotic) => {
                return amniotic.asJson;
              }
            ),
            MotherTemperature: partogramme.motherTemperatureStore.dataList.map(
              (motherTemperature) => {
                return motherTemperature.asJson;
              }
            ),
            MotherHeartFrequency:
              partogramme.motherHeartRateFrequencyStore.dataList.map(
                (motherHeartFrequency) => {
                  return motherHeartFrequency.asJson;
                }
              ),
            MotherContractionsFrequency:
              partogramme.motherContractionFrequencyStore.dataList.map(
                (motherContractionFrequency) => {
                  return motherContractionFrequency.asJson;
                }
              ),
            MotherContractionDuration:
              partogramme.motherContractionDurationStore.dataList.map(
                (motherContractionDuration) => {
                  return motherContractionDuration.asJson;
                }
              ),
            MotherSystolicBloodPressure:
              partogramme.motherSystolicBloodPressureStore.dataList.map(
                (motherSystolicBloodPressure) => {
                  return motherSystolicBloodPressure.asJson;
                }
              ),
            MotherDiastolicBloodPressure:
              partogramme.motherDiastolicBloodPressureStore.dataList.map(
                (motherDiastolicBloodPressure) => {
                  return motherDiastolicBloodPressure.asJson;
                }
              ),
            BabyHeartFrequency:
              partogramme.babyHeartFrequencyStore.dataList.map(
                (babyHeartFrequency) => {
                  return babyHeartFrequency.asJson;
                }
              ),
            Dilation: partogramme.dilationStore.dataList.map((dilation) => {
              return dilation.asJson;
            }),
            BabyDescent: partogramme.babyDescentStore.dataList.map(
              (babyDescent) => {
                return babyDescent.asJson;
              }
            ),
            Comment: partogramme.commentStore.dataList.map((comment) => {
              return comment.asJson;
            }),
          };
        }),
      ],
    };
    return data;
  }

  // fetch partogrammes from the server and update the store
  async fetchPartogrammes(nurseId?: string) {
    this.state = "pending";
    this.transportLayer
      .fetchPartogrammes(nurseId)
      .then((fetchedPartogrammes) => {
        runInAction(() => {
          fetchedPartogrammes.forEach((json: Partogramme_t["Row"]) =>
            this.updatePartogrammeFromServer(json).catch((error) => {
              console.log(error);
              return Promise.reject(error);
            })
          );
          this.state = "done";
          return Promise.resolve(fetchedPartogrammes);
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.state = "error";
        });
        return Promise.reject(error);
      });
  }

  // Update a partogramme with information from the server. Guarantees a partogramme only
  // exists once. Might either construct a new partogramme, update an existing one,
  // or remove a partogramme if it has been deleted on the server.
  async updatePartogrammeFromServer(json: Partogramme_t["Row"]) {
    let partogramme = this.partogrammeList.find(
      (partogramme) => partogramme.partogramme.id === json.id
    );
    if (!partogramme) {
      partogramme = new Partogramme(
        this,
        json.id,
        json.admissionDateTime,
        json.commentary,
        json.hospitalName,
        json.patientFirstName,
        json.patientLastName,
        json.noFile,
        json.nurseId,
        json.state,
        json.isDeleted,
        json.workStartDateTime
      );
      this.transportLayer
        .updatePartogramme(partogramme.partogramme)
        .then((data) => {
          runInAction(() => {
            partogramme ? this.partogrammeList.push(partogramme) : null;
          });
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
    }
    if (json.isDeleted) {
      this.removePartogramme(partogramme);
    } else {
      partogramme.updateFromjson(json);
    }
  }

  // Create a new partogramme on the server and add it to the store
  async createPartogramme(
    admissionDateTime: string,
    commentary: string,
    hospitalName: string,
    patientFirstName: string | null,
    patientLastName: string | null,
    noFile: number,
    state: Database["public"]["Enums"]["PartogrammeState"],
    workStartDateTime: string | null
  ) {
    const partogramme = new Partogramme(
      this,
      uuid.v4().toString(),
      admissionDateTime,
      commentary,
      hospitalName,
      patientFirstName,
      patientLastName,
      noFile,
      this.rootStore.userStore.profile.id,
      state,
      false,
      workStartDateTime
    );
    this.state = "pending";
    this.transportLayer
      .insertPartogramme(partogramme.partogramme)
      .then(() => {
        runInAction(() => {
          this.partogrammeList.push(partogramme);
          this.state = "done";
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.state = "error";
        });
        return Promise.reject(error);
      });
    return partogramme;
  }

  // Delete a partogramme from the store
  removePartogramme(partogramme: Partogramme) {
    this.transportLayer
      .updatePartogramme(partogramme.partogramme)
      .then(() => {
        runInAction(() => {
          this.state = "done";
          this.partogrammeList.splice(
            this.partogrammeList.indexOf(partogramme),
            1
          );
          console.log(
            "Partogramme deleted from server id: " + partogramme.partogramme.id
          );
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.state = "error";
          console.log(error);
        });
        return Promise.reject(error);
      });
  }

  // Update the focused partogramme
  updateSelectedPartogramme(id: string) {
    this.selectedPartogrammeId = id;
  }

  /**
   * This function Clean Up every partogramme.
   */
  cleanUp() {
    console.log("CleanUp partogrammeStore");
    this.state = "done";
    this.selectedPartogrammeId = null;
    this.partogrammeList.splice(0, this.partogrammeList.length);
  }

  serialize(partogrammeList: Partogramme[]) {
    return {
      partogrammeList: [
        ...partogrammeList.map((partogramme) => {
          return {
            partogramme: partogramme.asJson,
            AmnioticLiquid: partogramme.amnioticLiquidStore.dataList.map(
              (amniotic) => {
                return amniotic.asJson;
              }
            ),
            MotherTemperature: partogramme.motherTemperatureStore.dataList.map(
              (motherTemperature) => {
                return motherTemperature.asJson;
              }
            ),
            MotherHeartFrequency:
              partogramme.motherHeartRateFrequencyStore.dataList.map(
                (motherHeartFrequency) => {
                  return motherHeartFrequency.asJson;
                }
              ),
            MotherContractionsFrequency:
              partogramme.motherContractionFrequencyStore.dataList.map(
                (motherContractionFrequency) => {
                  return motherContractionFrequency.asJson;
                }
              ),
            MotherContractionDuration:
              partogramme.motherContractionDurationStore.dataList.map(
                (motherContractionDuration) => {
                  return motherContractionDuration.asJson;
                }
              ),
            MotherSystolicBloodPressure:
              partogramme.motherSystolicBloodPressureStore.dataList.map(
                (motherSystolicBloodPressure) => {
                  return motherSystolicBloodPressure.asJson;
                }
              ),
            MotherDiastolicBloodPressure:
              partogramme.motherDiastolicBloodPressureStore.dataList.map(
                (motherDiastolicBloodPressure) => {
                  return motherDiastolicBloodPressure.asJson;
                }
              ),
            BabyHeartFrequency:
              partogramme.babyHeartFrequencyStore.dataList.map(
                (babyHeartFrequency) => {
                  return babyHeartFrequency.asJson;
                }
              ),
            Dilation: partogramme.dilationStore.dataList.map((dilation) => {
              return dilation.asJson;
            }),
            BabyDescent: partogramme.babyDescentStore.dataList.map(
              (babyDescent) => {
                return babyDescent.asJson;
              }
            ),
            Comment: partogramme.commentStore.dataList.map((comment) => {
              return comment.asJson;
            }),
          };
        }),
      ],
    };
  }

  deserialize(values: any) {
    return values["partogrammeList"].map((json: any) => {
      let partogramme = new Partogramme(
        this,
        json["partogramme"].id,
        json["partogramme"].admissionDateTime,
        json["partogramme"].commentary,
        json["partogramme"].hospitalName,
        json["partogramme"].patientFirstName,
        json["partogramme"].patientLastName,
        json["partogramme"].noFile,
        json["partogramme"].nurseId,
        json["partogramme"].state,
        json["partogramme"].isDeleted,
        json["partogramme"].workStartDateTime
      );
      partogramme.updateFromjson(json["partogramme"]);
      partogramme.amnioticLiquidStore.dataList = json["AmnioticLiquid"].map(
        (amniotic: any) => {
          return new AmnioticLiquid(
            partogramme.amnioticLiquidStore,
            partogramme,
            amniotic.id,
            amniotic.created_at,
            amniotic.value,
            amniotic.partogrammeId,
            amniotic.Rank,
            amniotic.isDeleted
          );
        }
      );
      partogramme.motherTemperatureStore.dataList = json[
        "MotherTemperature"
      ].map((motherTemperature: any) => {
        return new MotherTemperature(
          partogramme.motherTemperatureStore,
          partogramme,
          motherTemperature.id,
          motherTemperature.created_at,
          motherTemperature.value,
          motherTemperature.partogrammeId,
          motherTemperature.Rank,
          motherTemperature.isDeleted
        );
      });
      partogramme.motherHeartRateFrequencyStore.dataList = json[
        "MotherHeartFrequency"
      ].map((motherHeartFrequency: any) => {
        return new MotherHeartFrequency(
          partogramme.motherHeartRateFrequencyStore,
          partogramme,
          motherHeartFrequency.id,
          motherHeartFrequency.created_at,
          motherHeartFrequency.value,
          motherHeartFrequency.partogrammeId,
          motherHeartFrequency.Rank,
          motherHeartFrequency.isDeleted
        );
      });
      partogramme.motherContractionFrequencyStore.dataList = json[
        "MotherContractionsFrequency"
      ].map((motherContractionFrequency: any) => {
        return new MotherContractionsFrequency(
          partogramme.motherContractionFrequencyStore,
          partogramme,
          motherContractionFrequency.id,
          motherContractionFrequency.created_at,
          motherContractionFrequency.value,
          motherContractionFrequency.partogrammeId,
          motherContractionFrequency.Rank,
          motherContractionFrequency.isDeleted
        );
      });
      partogramme.motherContractionDurationStore.dataList = json[
        "MotherContractionDuration"
      ].map((motherContractionDuration: any) => {
        return new MotherContractionDuration(
          partogramme.motherContractionDurationStore,
          partogramme,
          motherContractionDuration.id,
          motherContractionDuration.created_at,
          motherContractionDuration.value,
          motherContractionDuration.partogrammeId,
          motherContractionDuration.Rank,
          motherContractionDuration.isDeleted
        );
      });
      partogramme.motherSystolicBloodPressureStore.dataList = json[
        "MotherSystolicBloodPressure"
      ].map((motherSystolicBloodPressure: any) => {
        return new MotherSystolicBloodPressure(
          partogramme.motherSystolicBloodPressureStore,
          partogramme,
          motherSystolicBloodPressure.id,
          motherSystolicBloodPressure.created_at,
          motherSystolicBloodPressure.value,
          motherSystolicBloodPressure.partogrammeId,
          motherSystolicBloodPressure.Rank,
          motherSystolicBloodPressure.isDeleted
        );
      });
      partogramme.motherDiastolicBloodPressureStore.dataList = json[
        "MotherDiastolicBloodPressure"
      ].map((motherDiastolicBloodPressure: any) => {
        return new MotherDiastolicBloodPressure(
          partogramme.motherDiastolicBloodPressureStore,
          partogramme,
          motherDiastolicBloodPressure.id,
          motherDiastolicBloodPressure.created_at,
          motherDiastolicBloodPressure.value,
          motherDiastolicBloodPressure.partogrammeId,
          motherDiastolicBloodPressure.Rank,
          motherDiastolicBloodPressure.isDeleted
        );
      });
      partogramme.babyHeartFrequencyStore.dataList = json[
        "BabyHeartFrequency"
      ].map((babyHeartFrequency: any) => {
        return new BabyHeartFrequency(
          partogramme.babyHeartFrequencyStore,
          partogramme,
          babyHeartFrequency.id,
          babyHeartFrequency.value,
          babyHeartFrequency.created_at,
          babyHeartFrequency.partogrammeId,
          babyHeartFrequency.Rank,
          babyHeartFrequency.isDeleted
        );
      });
      partogramme.dilationStore.dataList = json["Dilation"].map(
        (dilation: any) => {
          return new Dilation(
            partogramme.dilationStore,
            partogramme,
            dilation.id,
            dilation.created_at,
            dilation.value,
            dilation.partogrammeId,
            dilation.Rank,
            dilation.isDeleted
          );
        }
      );
      partogramme.babyDescentStore.dataList = json["BabyDescent"].map(
        (babyDescent: any) => {
          return new BabyDescent(
            partogramme.babyDescentStore,
            partogramme,
            babyDescent.id,
            babyDescent.created_at,
            babyDescent.value,
            babyDescent.partogrammeId,
            babyDescent.Rank,
            babyDescent.isDeleted
          );
        }
      );
      partogramme.commentStore.dataList = json["Comment"].map(
        (comment: any) => {
          return new Comment(
            partogramme.commentStore,
            partogramme,
            comment.id,
            comment.created_at,
            comment.value,
            comment.partogrammeId,
            comment.isDeleted
          );
        }
      );
      return partogramme;
    });
  }
  // Status flag for the loading state of the partogrammeStore
  // TODO: this is not used yet and it should be reworked correctly
  // get isLoading() {
  //   return (
  //     this.state === "pending" ||
  //     this.partogrammeList.some((partogramme) => partogramme.state === "pending")
  //   );
  // }
}

export class Partogramme {
  partogramme: Partogramme_t["Row"] = {
    id: "",
    admissionDateTime: "",
    commentary: "",
    hospitalName: "",
    patientFirstName: "",
    patientLastName: "",
    noFile: 0,
    nurseId: "",
    state: "ADMITTED",
    workStartDateTime: null,
    isDeleted: false,
  };

  periodicInterval: any;

  store: PartogrammeStore;
  babyHeartFrequencyStore: BabyHeartFrequencyStore;
  dilationStore: DilationStore;
  babyDescentStore: BabyDescentStore;
  amnioticLiquidStore: AmnioticLiquidStore;
  motherTemperatureStore: MotherTemperatureStore;
  motherHeartRateFrequencyStore: MotherHeartFrequencyStore;
  motherContractionFrequencyStore: MotherContractionsFrequencyStore;
  motherContractionDurationStore: MotherContractionDurationStore;
  motherSystolicBloodPressureStore: MotherSystolicBloodPressureStore;
  motherDiastolicBloodPressureStore: MotherDiastolicBloodPressureStore;
  commentStore: CommentStore;
  dataStores: dataStore_t[];
  tableStore: DataInputTable_t[];

  editedDataId: String = "";
  autosave = true;

  is_in_sync = false;

  constructor(
    store: PartogrammeStore,
    id = uuid.v4().toString(),
    admissionDateTime: string,
    commentary: string,
    hospitalName: string,
    patientFirstName: string | null,
    patientLastName: string | null,
    noFile: number,
    nurseId: string,
    state: Database["public"]["Enums"]["PartogrammeState"],
    isDeleted: boolean | null = false,
    workStartDateTime: string | null
  ) {
    makeAutoObservable(this, {
      store: false,
      autosave: false,
      asJson: computed,
      partogramme: observable,
      Last10MinutesDataIds: computed,
      isActive: computed,
      startPeriodicCheckForPartogrammeState: false,
      isPartogrammeDataLocked: computed,
    });

    this.store = store;
    this.babyHeartFrequencyStore = new BabyHeartFrequencyStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.dilationStore = new DilationStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.babyDescentStore = new BabyDescentStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.amnioticLiquidStore = new AmnioticLiquidStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.motherTemperatureStore = new MotherTemperatureStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.motherHeartRateFrequencyStore = new MotherHeartFrequencyStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.motherContractionFrequencyStore = new MotherContractionsFrequencyStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.motherContractionDurationStore = new MotherContractionDurationStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.motherSystolicBloodPressureStore =
      new MotherSystolicBloodPressureStore(
        this,
        this.store.rootStore,
        this.store.transportLayer
      );
    this.motherDiastolicBloodPressureStore =
      new MotherDiastolicBloodPressureStore(
        this,
        this.store.rootStore,
        this.store.transportLayer
      );
    this.commentStore = new CommentStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );

    this.tableStore = [
      this.amnioticLiquidStore,
      this.motherTemperatureStore,
      this.motherHeartRateFrequencyStore,
      this.motherContractionFrequencyStore,
      this.motherContractionDurationStore,
      this.motherSystolicBloodPressureStore,
      this.motherDiastolicBloodPressureStore,
    ];

    this.dataStores = [
      this.babyHeartFrequencyStore,
      this.dilationStore,
      this.babyDescentStore,
      this.amnioticLiquidStore,
      this.motherTemperatureStore,
      this.motherHeartRateFrequencyStore,
      this.motherContractionFrequencyStore,
      this.motherContractionDurationStore,
      this.motherSystolicBloodPressureStore,
      this.motherDiastolicBloodPressureStore,
      this.commentStore,
    ];

    this.partogramme = {
      id: id,
      admissionDateTime: admissionDateTime,
      commentary: commentary,
      hospitalName: hospitalName,
      patientFirstName: patientFirstName,
      patientLastName: patientLastName,
      noFile: noFile,
      nurseId: nurseId,
      state: state,
      workStartDateTime: workStartDateTime,
      isDeleted: isDeleted,
    };

    if (!this.isActive) {
      this.changeState("WORK_FINISHED");
      console.log(
        "Partogramme state changed to WORK_FINISHED since it is not active anymore"
      );
    }
    this.startPeriodicCheckForPartogrammeState();
  }

  // This code returns a JSON representation of the partogramme.
  delete() {
    this.partogramme.isDeleted = true;
    this.store.removePartogramme(this);
  }

  // This code returns a JSON representation of the partogramme.
  get asJson() {
    return {
      ...this.partogramme,
    };
  }
  // return {
  //   "partogramme" : this.partogramme,
  //   "AmnioticLiquidStore" : this.amnioticLiquidStore.dataList.map(amniotic => {
  //     return amniotic.asJson;
  //   }),
  //   "MotherTemperatureStore" : this.motherTemperatureStore.dataList.map(motherTemperature => {
  //     return motherTemperature.asJson;
  //   }),
  //   "MotherHeartFrequencyStore" : this.motherHeartRateFrequencyStore.dataList.map(motherHeartFrequency => {
  //     return motherHeartFrequency.asJson;
  //   }),
  //   "MotherContractionsFrequencyStore" : this.motherContractionFrequencyStore.dataList.map(motherContractionFrequency => {
  //     return motherContractionFrequency.asJson;
  //   }),
  //   "MotherContractionDurationStore" : this.motherContractionDurationStore.dataList.map(motherContractionDuration => {
  //     return motherContractionDuration.asJson;
  //   }),
  //   "MotherSystolicBloodPressureStore" : this.motherSystolicBloodPressureStore.dataList.map(motherSystolicBloodPressure => {
  //     return motherSystolicBloodPressure.asJson;
  //   }),
  //   "MotherDiastolicBloodPressureStore" : this.motherDiastolicBloodPressureStore.dataList.map(motherDiastolicBloodPressure => {
  //     return motherDiastolicBloodPressure.asJson;
  //   }),
  //   "BabyHeartFrequencyStore" : this.babyHeartFrequencyStore.dataList.map(babyHeartFrequency => {
  //     return babyHeartFrequency.asJson;
  //   }),
  //   "DilationStore" : this.dilationStore.dataList.map(dilation => {
  //     return dilation.asJson;
  //   }),
  //   "BabyDescentStore" : this.babyDescentStore.dataList.map(babyDescent => {
  //     return babyDescent.asJson;
  //   }),
  //   "CommentStore" : this.commentStore.dataList.map(comment => {
  //     return comment.asJson;
  //   }),
  // };

  // This code updates the partogramme from a JSON representation.
  // The partogramme is stored in this.partogramme.
  // The JSON representation is stored in json.
  // The function returns nothing.
  updateFromjson(json: Partogramme_t["Row"]) {
    this.autosave = false;
    this.partogramme = json;
    this.autosave = true;
  }

  /**
   * This function Clean Up every dataStore.
   */
  dispose() {
    console.log("Disposing partogramme");
  }

  /**
   * @brief this function return a list of every data added in the last 10 minutes in the partogramme.
   * @returns the last 10 minutes data ids
   */
  get Last10MinutesDataIds() {
    const now = new Date();
    const last10Minutes = new Date(now.getTime() - 10 * 60000);
    const last10MinutesData = [];
    for (const store of this.dataStores) {
      for (const data of store.dataList) {
        if (
          new Date(data.data.created_at).getTime() > last10Minutes.getTime()
        ) {
          last10MinutesData.push(data);
        }
      }
    }
    return last10MinutesData;
  }

  /**
   * @brief this function return a list of every data added in the last 10 minutes in the partogramme.
   * @param ids the ids of the data to return
   * @returns the last 10 minutes data
   */
  getDataByIds(ids: String[]) {
    const Data = [];
    for (const store of this.dataStores) {
      for (const data of store.dataList) {
        if (ids.includes(data.data.id)) {
          Data.push(data);
        }
      }
    }
    return Data;
  }

  getDataById(id: String) {
    for (const store of this.dataStores) {
      for (const data of store.dataList) {
        if (id === data.data.id) {
          return data;
        }
      }
    }
    return undefined;
  }

  get dataToEdit(): data_t | undefined {
    let data = this.getDataById(this.editedDataId);
    if (data !== undefined) {
      return data;
    }
  }

  /**
   * Return the needed patient data store by iterating over the tableStore array.
   * @param storeName the name of the store to return
   * @returns the store if found, undefined otherwise
   */
  getDataStore(storeName: string) {
    for (const store of this.tableStore) {
      if (store.name === storeName) {
        return store;
      }
    }
    return undefined;
  }

  async changeState(state: Database["public"]["Enums"]["PartogrammeState"]) {
    const data = this.asJson;
    // If the partogramme is in progress, we set the workStartDateTime
    if (state === "IN_PROGRESS") {
      data.workStartDateTime = new Date().toISOString();
    }
    data.state = state;
    this.store.transportLayer
      .updatePartogramme(data)
      .then(() => {
        runInAction(() => {
          this.partogramme = data;
          this.store.state = "done";
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.store.state = "error";
          console.log(error);
        });
        return Promise.reject(error);
      });
  }

  // if more than 12 Hours since workStartDate, the partogramme is not active anymore
  get isActive() {
    if (this.partogramme.workStartDateTime) {
      const workStartDateTime = new Date(this.partogramme.workStartDateTime);
      const now = new Date();
      const diff = now.getTime() - workStartDateTime.getTime();
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      if (diffHours > 12) {
        return false;
      }
    }
    return true;
  }

  startPeriodicCheckForPartogrammeState() {
    if (!this.isActive) {
      this.changeState("WORK_FINISHED");
      console.log(
        "Partogramme state changed to WORK_FINISHED since it is not active anymore"
      );
    }
    this.periodicInterval = setInterval(() => {
      if (!this.isActive) {
        this.changeState("WORK_FINISHED");
        console.log(
          "Partogramme state changed to WORK_FINISHED since it is not active anymore"
        );
        clearInterval(this.periodicInterval);
      }
    }, 60000);
  }

  get isPartogrammeDataLocked() {
    return this.asJson.state !== "IN_PROGRESS";
  }
}
