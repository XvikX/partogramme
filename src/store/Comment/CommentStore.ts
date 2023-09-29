import {
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Database } from "../../../types/supabase";
import { DataStore } from "../DataStore";
import { Partogramme } from "../partogramme/partogrammeStore";
import { RootStore } from "../rootStore";
import { TransportLayer } from "../../transport/transportLayer";
import { Alert, Platform } from "react-native";

export type Comment_t =
  Database["public"]["Tables"]["Comment"];

export class CommentStore extends DataStore {
  dataList: Comment[] = [];

  constructor(
    partogrammeStore: Partogramme,
    rootStore: RootStore,
    transportLayer: TransportLayer
  ) {
    super(
      partogrammeStore,
      rootStore,
      transportLayer,
      "Commentaire",
      ""
    );
    makeObservable(this, {
      rootStore: false,
      transportLayer: false,
      partogrammeStore: false,
      isInSync: false,
      sortedCommentList: computed,
      DataListAsString: computed,
      dataList: observable,
    });
  }

  async fetch(partogrammeId: string): Promise<any> {
    return this.transportLayer.fetchComments(partogrammeId);
  }

  async createData(json: any): Promise<any> {
      const data = new Comment( 
        this,
        this.partogrammeStore,
        json.id,
        json.value,
        json.created_at,
        this.partogrammeStore.partogramme.id,
        json.isDeleted
      );
      this.transportLayer.insertComment(data.data)
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
              `Impossible de créer ${this.name}`
            );
        runInAction(() => {
          this.state = "error";
        });
        Promise.reject(error);
      });
    return Promise.resolve(data);
  }

  async remove(comment: Comment) {
    this.transportLayer
      .deleteComment(comment.data.id)
      .then((response: any) => {
        console.log(this.name + " deleted");
        runInAction(() => {
          this.dataList.splice(this.dataList.indexOf(comment), 1);
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
      let comment = this.dataList.find(
        (comment) =>
          comment.data.id === json.id
      );
      if (!comment) {
        comment = new Comment(
          this,
          this.partogrammeStore,
          json.id,
          json.value,
          json.created_at,
          json.partogrammeId,
          json.isDeleted
        );
        this.dataList.push(comment);
      }
      if (json.isDeleted) {
        this.remove(comment);
      } else {
        comment.updateFromJson(json);
      }
    }
  }

  get sortedCommentList () {
    return this.dataList.slice().sort((a, b) => {
      return (
        new Date(a.data.created_at).getTime() -
        new Date(b.data.created_at).getTime()
      );
    });
  }

  get DataListAsString() {
    return this.sortedCommentList.map(
      (data) => data.data.value.toString()
    );
  }

  cleanUp() {
    this.dataList.splice(0, this.dataList.length);
    this.state = "done";
    this.isInSync = false;
    this.isLoading = false;
  }
}

export class Comment {
  data: Comment_t['Row'] = {
    id: "",
    value: "",
    created_at: "",
    partogrammeId: "",
    isDeleted: false,
  };
  store: CommentStore;
  partogrammeStore: Partogramme;
  
  constructor( 
    store: CommentStore,
    partogrammeStore: Partogramme,
    id: string,
    value: string,
    created_at: string,
    partogrammeId: string,
    isDeleted: boolean
  ) {
    makeAutoObservable(this, {
      store: false,
      partogrammeStore: false,
      data: observable,
      asJson: computed,
    });
    this.store = store;
    this.partogrammeStore = partogrammeStore;
    this.data.id = id;
    this.data.value = value;
    this.data.created_at = created_at;
    this.data.partogrammeId = partogrammeId;
    this.data.isDeleted = isDeleted;

    // this.store.transportLayer.updateComment(this.data);
  }

  get asJson() {
    return {
      ...this.data,
    };
  }

  updateFromJson(json: Comment_t["Row"]) {
    this.data = json;
  }

  async update(value: string) {
    let updatedData = this.asJson;
    updatedData.value = value;
    this.store.transportLayer
      .updateComment(updatedData)
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
              "Impossible de mettre à jour le commentaire"
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

