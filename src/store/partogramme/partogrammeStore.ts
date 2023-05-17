import { first } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import {v4 as uuidv4} from 'uuid';
import { Database } from '../../../types/supabase';
import { supabase } from '../../initSupabase';
import userStore from '../user/userStore';
import { BabyHeartFrequencyStore } from '../BabyHeartFrequency/babyHeartFrequencyStore';

export type Partogramme = Database['public']['Tables']['Partogramme'];

export class PatientDataStore {
    partogrammeList: Partogramme['Row'][] = [];
    babyHeartFrequencyStore: BabyHeartFrequencyStore = new BabyHeartFrequencyStore();
    state = "pending" // "pending", "done" or "error"
    isInSync = false;
    selectedPartogrammeId: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async newPartogramme (
        admissionDateTime: string,
        commentary: string,
        hospitalName: string,
        patientFirstName: string,
        patientLastName: string,
        noFile: number,
        nurseId: string,
        state: string,
        workStartDateTime: string,
        ) {
        let error = false;
        const partogramme: Partogramme['Row'] = {
            id: uuidv4(),
            admissionDateTime: admissionDateTime,
            commentary: commentary,
            patientFirstName: patientFirstName,
            patientLastName: patientLastName,
            hospitalName: hospitalName,
            noFile: noFile,
            nurseId: nurseId,
            state: state,
            workStartDateTime: workStartDateTime,
        };
        this.savePartogramme(partogramme);

        const result = await supabase
                .from('Partogramme')
                .insert(partogramme)
        if (result.error){
            console.log("Error creating new partogramme : failed to push to the server");
            console.error(result.error);
            runInAction(() => {
                this.state = "error"
                this.isInSync = false;
            })
            error = true;
        }
        else {
            runInAction(() => {
                console.log("Partogramme was pushed to the server");
                this.state = "done"
                this.isInSync = true;
            })
        }
        return error;
    }

    async fetchPartogramme() {
        let error = false;
        this.state = "pending"
        const result = await supabase
            .from('Partogramme')
            .select('*')
            .eq('nurseId', userStore.profile.id)
        if (result.error){
            console.log("Error fetching partogramme");
            console.error(result.error);
            runInAction(() => {
                this.state = "error"
                this.isInSync = false;
            })
            error = true;
        }
        else {
            runInAction(() => {
                console.log("Partogramme was fetched from the server");
                this.state = "done"
                this.isInSync = true;
                this.partogrammeList = result.data;
            })
        }
        return error;
    }

    savePartogramme(partogramme: Partogramme['Row']) {
        const idx = this.partogrammeList.findIndex((n) => partogramme.id === n.id);
        if (idx < 0) {
            this.partogrammeList.push(partogramme);
        } else {
            this.partogrammeList[idx] = partogramme;
        }
    }

    /**
     * @brief Delete a partogramme from the store
     * @param partogramme 
     */
    async deletePartogramme(id: string) {
        const idx = this.partogrammeList.findIndex((n) => n.id === id);
        if (idx < 0) {
            throw new Error(`Partogramme ${id} not found`);
        } else {
            const result = await supabase
                .from('Partogramme')
                .delete()
                .eq('id', id)
            if (result.error){
                console.log("Error deleting partogramme");
                console.error(result.error);
                runInAction(() => {
                    this.state = "error"
                    this.isInSync = true;
                })
            }
            else {
                runInAction(() => {
                    console.log("Partogramme was deleted from the server");
                    this.partogrammeList.splice(idx, 1);
                    this.state = "done"
                    this.isInSync = true;
                })
            }
        }
    }

    getPartogramme(id: string): Partogramme['Row'] {
        const idx = this.partogrammeList.findIndex((n) => n.id === id);
        if (idx < 0) {
            throw new Error(`Partogramme ${id} not found`);
        } else {
            return this.partogrammeList[idx];
        }
    }

    updateSelectedPartogramme(id: string) {
        this.selectedPartogrammeId = this.getPartogramme(id).id;
    }
}

const patientDataStore = new PatientDataStore();

export default patientDataStore;