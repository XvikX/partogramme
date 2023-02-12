import { observable } from 'mobx';
import Partogramme from './partogrammeModel';
import {v4 as uuidv4} from 'uuid';

export class PartogrammeStore {
    @observable partogrammes: Partogramme[] = [];

    savePartogramme(partogramme: Partogramme) {
        const idx = this.partogrammes.findIndex((n) => partogramme.id === n.id);
        if (idx < 0) {
            this.partogrammes.push(partogramme);
        } else {
            this.partogrammes[idx] = partogramme;
        }
    }

    deletePartogramme(partogramme: Partogramme) {
        const idx = this.partogrammes.findIndex((n) => n.id === partogramme.id);
        if (idx < 0) {
            throw new Error(`Partogramme ${partogramme.id} not found`);
        } else {
            this.partogrammes.splice(idx, 1);
        }
    }

    getPartogramme(id: string): Partogramme {
        const idx = this.partogrammes.findIndex((n) => n.id === id);
        if (idx < 0) {
            throw new Error(`Partogramme ${id} not found`);
        } else {
            return this.partogrammes[idx];
        }
    }
}

const observablePartogrammeStore = new PartogrammeStore();

export const newPartogramme = (
    no_case: string,
    admission_time: Date,
    commentary: string,
    start_work_time: Date,
    state: string,
    center_name: string,
    nurse_id: string) => {
        const partogramme = {
            id: uuidv4(),
            no_case: no_case,
            admission_time: admission_time,
            commentary: commentary,
            start_work_time: start_work_time,
            state: state,
            center_name: center_name,
            nurse_id
        };
        observablePartogrammeStore.savePartogramme(partogramme);
}

export default observablePartogrammeStore;