import { makeAutoObservable, runInAction, reaction, computed, observable } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import { log } from "console";
import { BabyHeartFrequencyStore } from "../BabyHeartFrequency/babyHeartFrequencyStore";
import { DilationStore } from "../Dilatation/dilatationStore";
import { BabyDescentStore } from "../BabyDescent/babyDescentStore";

export type Partogramme_type = Database["public"]["Tables"]["Partogramme"];

export class PartogrammeStore {
  rootStore: RootStore;
  partogrammeList: Partogramme[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  selectedPartogrammeId: string | null = null;
  transportLayer: TransportLayer;
  isLoading = false;

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
  loadPartogrammes(nurseId: string) {
    this.isLoading = true;
    this.transportLayer
      .fetchPartogrammes(nurseId)
      .then((fetchedPartogrammes) => {
        runInAction(() => {
          if (fetchedPartogrammes.data) {
            fetchedPartogrammes.data.forEach((json: Partogramme_type["Row"]) =>
              this.updatePartogrammeFromServer(json)
            );
            this.isLoading = false;
          }
        });
      });
  }

    // Update a partogramme with information from the server. Guarantees a partogramme only
    // exists once. Might either construct a new partogramme, update an existing one,
    // or remove a partogramme if it has been deleted on the server.
    updatePartogrammeFromServer(json: Partogramme_type["Row"]) {
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
        json.state,
        json.isDeleted,
        json.workStartDateTime
      );
      this.partogrammeList.push(partogramme);
    } 
    if (json.isDeleted) {
      this.removePartogramme(partogramme);
    }
    else {
      partogramme.updateFromjson(json);
    }
  }

  // Create a new partogramme on the server and add it to the store
  createPartogramme( 
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
      uuidv4(),
      admissionDateTime,
      commentary,
      hospitalName,
      patientFirstName,
      patientLastName,
      noFile,
      state,
      false,
      workStartDateTime
    );
    this.partogrammeList.push(partogramme);
    return partogramme;
  }

  // Delete a partogramme from the store
  removePartogramme(partogramme: Partogramme) {
    this.partogrammeList.splice(this.partogrammeList.indexOf(partogramme), 1);
    partogramme.partogramme.isDeleted = true;
    this.transportLayer.updatePartogramme(partogramme.partogramme);
  }

  // Update the focused partogramme
  updateSelectedPartogramme(id: string) {
    this.selectedPartogrammeId = id;
  }
}

export class Partogramme {
  partogramme: Partogramme_type["Row"];
  store: PartogrammeStore;
  babyHeartFrequencyStore: BabyHeartFrequencyStore;
  dilationStore: DilationStore;
  babyDescentStore: BabyDescentStore;
  autosave = true;

  constructor(
    store: PartogrammeStore,
    id = uuidv4(),
    admissionDateTime: string,
    commentary: string,
    hospitalName: string,
    patientFirstName: string | null,
    patientLastName: string | null,
    noFile: number,
    state: Database["public"]["Enums"]["PartogrammeState"],
    isDeleted: boolean | null = false,
    workStartDateTime: string
  ) {
    makeAutoObservable(this, {
      store: false,
      autosave: false,
      asJson: computed,
      partogramme: observable,
      // getJson: computed,
    });
    this.store = store;
    this.babyHeartFrequencyStore = new BabyHeartFrequencyStore(this, this.store.rootStore, this.store.transportLayer);
    this.dilationStore = new DilationStore(this, this.store.rootStore, this.store.transportLayer);
    this.babyDescentStore = new BabyDescentStore(this, this.store.rootStore, this.store.transportLayer);
    this.partogramme = {
      id: id,
      admissionDateTime: admissionDateTime,
      commentary: commentary,
      hospitalName: hospitalName,
      patientFirstName: patientFirstName,
      patientLastName: patientLastName,
      noFile: noFile,
      nurseId: store.rootStore.userStore.profile.id,
      state: state,
      workStartDateTime: workStartDateTime,
      isDeleted: isDeleted,
    };

    this.babyHeartFrequencyStore.loadBabyHeartFrequencies(id);
    this.dilationStore.loadDilations(id);
    this.babyDescentStore.loadBabyDescents(id);

    this.store.transportLayer.updatePartogramme(this.partogramme);
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
    }
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

  // Clean up the observer.
  dispose() {
    console.log("Disposing partogramme");
  }
}