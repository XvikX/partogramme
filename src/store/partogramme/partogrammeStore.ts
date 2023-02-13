import { first } from 'lodash';
import { makeAutoObservable } from 'mobx';
import {v4 as uuidv4} from 'uuid';

export interface Partogramme {
    last_name: string,
    first_name: string,
    id: string,
    no_case: string,
    admission_time: Date,
    commentary: string,
    start_work_time: Date,
    state: string,
    center_name: string,
    nurse_id: string
}

export class PartogrammeStore {
    partogrammes: Partogramme[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    newPartogramme (
        no_case: string,
        admission_time: Date,
        commentary: string,
        start_work_time: Date,
        state: string,
        center_name: string,
        nurse_id: string,
        last_name: string,
        first_name: string
        ) {
            const partogramme = {
                id: uuidv4(),
                no_case: no_case,
                admission_time: admission_time,
                commentary: commentary,
                start_work_time: start_work_time,
                state: state,
                center_name: center_name,
                nurse_id: nurse_id,
                first_name: first_name,
                last_name: last_name
            };
            this.savePartogramme(partogramme);
    }

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

const partogrammeStore = new PartogrammeStore();

export default partogrammeStore;