import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../../../types/supabase';
import { supabase } from '../../initSupabase';
import userStore from '../user/userStore';
import { Partogramme } from '../partogramme/partogrammeStore';

export type BabyHeartFrequency = Database['public']['Tables']['BabyHeartFrequency'];

export class BabyHeartFrequencyStore {
    babyHeartList: BabyHeartFrequency['Row'][];
    state = "pending" // "pending", "done" or "error"
    isInSync = false;

    constructor() {
        makeAutoObservable(this);
        this.babyHeartList = [];
    }

    async newBabyHeartFrequency (
        babyFc : number,
        Rank : number,
        created_at : string,
        partogrammeId : string,
        ) {
        let error = false;
        const babyHeartFrequency: BabyHeartFrequency['Row'] = {
            id: uuidv4(),
            babyFc: babyFc,
            Rank: Rank,
            created_at: created_at,
            partogrammeId: partogrammeId,
        };
        this.saveBabyHeartFrequency(babyHeartFrequency);

        const result = await supabase
                .from('BabyHeartFrequency')
                .insert(babyHeartFrequency)
        if (result.error){
            console.log("Error creating new babyHeartFrequency : failed to push to the server");
            console.error(result.error);
            runInAction(() => {
                this.state = "error"
                this.isInSync = false;
            })
            error = true;
        }
        else {
            runInAction(() => {
                console.log("babyHeartFrequency was pushed to the server");
                this.state = "done"
                this.isInSync = true;
            })
        }
        return error;
    }

    saveBabyHeartFrequency(babyHeartFrequency: BabyHeartFrequency['Row']) {
        const idx = this.babyHeartList.findIndex((n) => babyHeartFrequency.id === n.id);
        if (idx === -1) {
            this.babyHeartList.push(babyHeartFrequency);
        } else {
            this.babyHeartList[idx] = babyHeartFrequency;
        }
    }

    // create a function to get the babyHeartFrequency list based on the partogrammeId from a partogramme
    getBabyHeartFrequencyList(partogramme: Partogramme['Row']) {
        const babyHeartFrequencyList = this.babyHeartList.filter((babyHeartFrequency) => babyHeartFrequency.partogrammeId === partogramme.id);
        return babyHeartFrequencyList;
    }

    // Create a function to delete a babyHeartFrequency 
    async deleteBabyHeartFrequency(babyHeartFrequency: BabyHeartFrequency['Row']) {
        let error = false;
        const result = await supabase
            .from('BabyHeartFrequency')
            .delete()
            .eq('id', babyHeartFrequency.id);
        if (result.error) {
            console.log("Error deleting babyHeartFrequency : failed to push to the server");
            console.error(result.error);
            runInAction(() => {
                this.state = "error"
                this.isInSync = false;
            })
        }
        else {
            runInAction(() => {
                console.log("babyHeartFrequency was deleted from the server");
                this.state = "done"
                this.isInSync = true;
            })
        }
        return error;
    }

    // Create a function to update a babyHeartFrequency
    async updateBabyHeartFrequency(babyHeartFrequency: BabyHeartFrequency['Row']) {
        let error = false;
        const result = await supabase
            .from('BabyHeartFrequency')
            .update(babyHeartFrequency)
            .eq('id', babyHeartFrequency.id);
        if (result.error) {
            console.log("Error updating babyHeartFrequency : failed to push to the server");
            console.error(result.error);
            runInAction(() => {
                this.state = "error"
                this.isInSync = false;
            })
        }
        else {
            runInAction(() => {
                console.log("babyHeartFrequency was updated on the server");
                this.state = "done"
                this.isInSync = true;
            })
        }
        return error;
    }
}

const babyHeartFrequencyStore = new BabyHeartFrequencyStore();

export default babyHeartFrequencyStore;