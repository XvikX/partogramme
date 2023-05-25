import { TransportLayer } from "../transport/transportLayer";
import { PartogrammeStore } from "./partogramme/partogrammeStore";
import { UserStore } from "./user/userStore";

export class RootStore {
  userStore: UserStore;
  partogrammeStore: PartogrammeStore;
  transportLayer: TransportLayer;

  constructor() {
    this.transportLayer = new TransportLayer();
    this.userStore = new UserStore(this);
    this.partogrammeStore = new PartogrammeStore(this, this.transportLayer);
  }
}

export const rootStore = new RootStore();
