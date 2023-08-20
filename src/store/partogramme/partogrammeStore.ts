import { makeAutoObservable, runInAction, computed, observable } from "mobx";
import uuid from "react-native-uuid";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import { BabyHeartFrequency, BabyHeartFrequencyStore } from "../BabyHeartFrequency/babyHeartFrequencyStore";
import { Dilation, DilationStore } from "../Dilatation/dilatationStore";
import { BabyDescent, BabyDescentStore } from "../BabyDescent/babyDescentStore";
import { AmnioticLiquid, AmnioticLiquidStore } from "../AmnioticLiquid/amnioticLiquidStore";
import { MotherTemperature, MotherTemperatureStore } from "../MotherTemperature/motherTemperatureStore";
import { MotherHeartFrequency, MotherHeartFrequencyStore } from "../MotherHeartFrequency/motherHeartFrequencyStore";
import { MotherContractionsFrequency, MotherContractionsFrequencyStore } from "../MotherContractionsFrequency/motherContractionsFrequencyStore";
import { MotherBloodPressure, MotherBloodPressureStore } from "../MotherBloodPressure/motherBloodPressureStore";
import { DataInputTable } from "../../components/DialogDataInputTable";

export type Partogramme_type = Database["public"]["Tables"]["Partogramme"];

export type dataStore_t = BabyHeartFrequencyStore | 
                          DilationStore | 
                          BabyDescentStore | 
                          AmnioticLiquidStore | 
                          MotherTemperatureStore | 
                          MotherHeartFrequencyStore | 
                          MotherContractionsFrequencyStore | 
                          MotherBloodPressureStore;

export type data_t =  MotherBloodPressure | 
                      MotherContractionsFrequency | 
                      MotherHeartFrequency | 
                      MotherTemperature | 
                      AmnioticLiquid | 
                      BabyDescent | 
                      BabyHeartFrequency | 
                      Dilation;

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
    });
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
  }

  get selectedPartogramme(): Partogramme | undefined {
    return this.partogrammeList.find(
      (partogramme) => partogramme.partogramme.id === this.selectedPartogrammeId
    );
  }

  // fetch partogrammes from the server and update the store
  fetchPartogrammes(nurseId?: string) {
    this.state = "pending";
    this.transportLayer
      .fetchPartogrammes(nurseId)
      .then((fetchedPartogrammes) => {
        runInAction(() => {
          if (fetchedPartogrammes) {
            fetchedPartogrammes.forEach((json: Partogramme_type["Row"]) =>
              this.updatePartogrammeFromServer(json)
              .catch((error) => {
                console.log(error);
                return Promise.reject(error);
              })
            );
            this.state = "done";
          }
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
  async updatePartogrammeFromServer(json: Partogramme_type["Row"]) {
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
            partogramme ? this.partogrammeList.push(partogramme): null;
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
    workStartDateTime: string
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
    this.transportLayer.insertPartogramme(partogramme.partogramme).then(() => {
      runInAction(() => {
        this.partogrammeList.push(partogramme);
        this.state = "done";
      });
    }).catch((error) => {
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
          this.partogrammeList.splice(this.partogrammeList.indexOf(partogramme), 1);
          console.log("Partogramme deleted from server id: " + partogramme.partogramme.id);
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
  partogramme: Partogramme_type["Row"];
  store: PartogrammeStore;
  babyHeartFrequencyStore: BabyHeartFrequencyStore;
  dilationStore: DilationStore;
  babyDescentStore: BabyDescentStore;
  amnioticLiquidStore: AmnioticLiquidStore;
  motherTemperatureStore: MotherTemperatureStore;
  motherHeartRateFrequencyStore: MotherHeartFrequencyStore;
  motherContractionFrequencyStore: MotherContractionsFrequencyStore;
  motherBloodPressureStore: MotherBloodPressureStore;
  tableStore: DataInputTable[];
  dataStores: dataStore_t[];
  autosave = true;

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
    workStartDateTime: string
  ) {
    makeAutoObservable(this, {
      store: false,
      autosave: false,
      asJson: computed,
      partogramme: observable,
      // getStore: computed,
      // getJson: computed,
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
    this.motherBloodPressureStore = new MotherBloodPressureStore(
      this,
      this.store.rootStore,
      this.store.transportLayer
    );
    this.tableStore = [
      this.amnioticLiquidStore,
      this.motherTemperatureStore,
      this.motherHeartRateFrequencyStore,
      this.motherContractionFrequencyStore,
      this.motherBloodPressureStore,
    ];

    this.dataStores = [
      this.babyHeartFrequencyStore,
      this.dilationStore,
      this.babyDescentStore,
      this.amnioticLiquidStore,
      this.motherTemperatureStore,
      this.motherHeartRateFrequencyStore,
      this.motherContractionFrequencyStore,
      this.motherBloodPressureStore,
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

  // This code updates the partogramme from a JSON representation.
  // The partogramme is stored in this.partogramme.
  // The JSON representation is stored in json.
  // The function returns nothing.
  updateFromjson(json: Partogramme_type["Row"]) {
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
    console.log("last 10 minutes : " + last10Minutes);
    const last10MinutesData = [];
    for (const store of this.dataStores) {
      for (const data of store.dataList) {
        if ( new Date(data.data.created_at) > last10Minutes) {
          last10MinutesData.push(data.data.id);
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
  getDataByIds(ids: string[]) {
    const last10MinutesData = [];
    for (const store of this.dataStores) {
      for (const data of store.dataList) {
        if ( ids.includes(data.data.id)) {
          last10MinutesData.push(data);
        }
      }
    }
    return last10MinutesData;
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
}
