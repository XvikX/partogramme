import { makeAutoObservable, runInAction, reaction, computed, observable } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { Database } from "../../../types/supabase";
import { TransportLayer } from "../../transport/transportLayer";
import { RootStore } from "../rootStore";
import { log } from "console";

export type Partogramme_type = Database["public"]["Tables"]["Partogramme"];

export class PartogrammeStore {
  rootStore: RootStore;
  partogrammeList: Partogramme[] = [];
  state = "pending"; // "pending", "done" or "error"
  isInSync = false;
  selectedPartogrammeId: string | null = null;
  transportLayer: TransportLayer;
  isLoading = false;
  selectedPartogramme :string | null = null;

  constructor(rootStore: RootStore, transportLayer: TransportLayer) {
    makeAutoObservable(this, {
      rootStore: false,
      transportLayer: false,
      isInSync: false,
    });
    this.rootStore = rootStore;
    this.transportLayer = transportLayer;
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
  saveHandler: () => void;
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
      saveHandler: false,
      autosave: false,
      asJson: computed,
      partogramme: observable,
      // getJson: computed,
    });
    this.store = store;
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

    this.store.transportLayer.updatePartogramme(this.partogramme);
  }

  delete() {
    this.partogramme.isDeleted = true;
    this.store.removePartogramme(this);
  }

  get asJson() {
    return {
      ...this.partogramme,
    }
  }

  updateFromjson(json: Partogramme_type["Row"]) {
    this.autosave = false;
    this.partogramme = json;
    this.autosave = true;
  }

  // Clean up the observer.
  dispose() {
    console.log("Disposing partogramme");
    this.saveHandler();
  }
}

// const patientDataStore = new PartogrammeStore();

// export default patientDataStore;

//   async fetchPartogramme() {
//     let error = false;
//     this.state = "pending";
//     const result = await supabase
//       .from("Partogramme")
//       .select("*")
//       .eq("nurseId", userStore.profile.id);
//     if (result.error) {
//       console.log("Error fetching partogramme");
//       console.error(result.error);
//       runInAction(() => {
//         this.state = "error";
//         this.isInSync = false;
//       });
//       error = true;
//     } else {
//       runInAction(() => {
//         console.log("Partogramme was fetched from the server");
//         this.state = "done";
//         this.isInSync = true;
//         this.partogrammeList = result.data;
//       });
//     }
//     return error;
//   }

//   async newPartogramme(
//     admissionDateTime: string,
//     commentary: string,
//     hospitalName: string,
//     patientFirstName: string,
//     patientLastName: string,
//     noFile: number,
//     nurseId: string,
//     state: string,
//     workStartDateTime: string
//   ) {
//     let error = false;
//     const partogramme: Partogramme_type["Row"] = {
//       id: uuidv4(),
//       admissionDateTime: admissionDateTime,
//       commentary: commentary,
//       patientFirstName: patientFirstName,
//       patientLastName: patientLastName,
//       hospitalName: hospitalName,
//       noFile: noFile,
//       nurseId: nurseId,
//       state: state,
//       workStartDateTime: workStartDateTime,
//     };
//     this.savePartogramme(partogramme);

//     const result = await supabase.from("Partogramme").insert(partogramme);
//     if (result.error) {
//       console.log(
//         "Error creating new partogramme : failed to push to the server"
//       );
//       console.error(result.error);
//       runInAction(() => {
//         this.state = "error";
//         this.isInSync = false;
//       });
//       error = true;
//     } else {
//       runInAction(() => {
//         console.log("Partogramme was pushed to the server");
//         this.state = "done";
//         this.isInSync = true;
//       });
//     }
//     return error;
//   }

//   savePartogramme(partogramme: Partogramme_type["Row"]) {
//     const idx = this.partogrammeList.findIndex((n) => partogramme.id === n.id);
//     if (idx < 0) {
//       this.partogrammeList.push(partogramme);
//     } else {
//       this.partogrammeList[idx] = partogramme;
//     }
//   }

//   /**
//    * @brief Delete a partogramme from the store
//    * @param partogramme
//    */
//   async deletePartogramme(id: string) {
//     const idx = this.partogrammeList.findIndex((n) => n.id === id);
//     if (idx < 0) {
//       throw new Error(`Partogramme ${id} not found`);
//     } else {
//       const result = await supabase.from("Partogramme").delete().eq("id", id);
//       if (result.error) {
//         console.log("Error deleting partogramme");
//         console.error(result.error);
//         runInAction(() => {
//           this.state = "error";
//           this.isInSync = true;
//         });
//       } else {
//         runInAction(() => {
//           console.log("Partogramme was deleted from the server");
//           this.partogrammeList.splice(idx, 1);
//           this.state = "done";
//           this.isInSync = true;
//         });
//       }
//     }
//   }

//   getPartogramme(id: string): Partogramme["Row"] {
//     const idx = this.partogrammeList.findIndex((n) => n.id === id);
//     if (idx < 0) {
//       throw new Error(`Partogramme ${id} not found`);
//     } else {
//       return this.partogrammeList[idx];
//     }
//   }

//   updateSelectedPartogramme(id: string) {
//     this.selectedPartogrammeId = this.getPartogramme(id).id;
//   }
