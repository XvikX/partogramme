import { makeAutoObservable } from 'mobx';
import {v4 as uuidv4, v4} from 'uuid';
import { Database } from '../../../types/supabase';
import { supabase } from '../../initSupabase';

// // Data of the user
// export interface user {
//     id: string;
//     isDoctor: boolean;
// }

// // Data of the nurse
// export interface NurseInfo {
//     id: string;
//     last_name: string;
//     first_mid_name: string;
// }

export class UserStore {
    // Declare data of the store and their initial values
    profile: Database['public']['Tables']['profiles']['Row'] = {
        avatar_url : null,
        full_name : null,
        id: '',
        isDoctor: false,
        updated_at:null,
        username:null,
        website:null,
    };
    nurseInfo: Database['public']['Tables']['nurse_info']['Row'] = {
        created_at:  null,
        first_mid_name:  null,
        id: '',
        last_name:  null,
        profiles:  null,
    };

    constructor() {
        makeAutoObservable(this);
    }

    setUser(id: string, isDoctor: boolean) {
        this.profile.id = id;
        this.profile.isDoctor = isDoctor;
    }

    setNurseInfo(last_name: string, first_mid_name: string) {
        this.nurseInfo.id = uuidv4();
        this.nurseInfo.first_mid_name = first_mid_name;
        this.nurseInfo.last_name = last_name;
        this.nurseInfo.profiles = this.profile.id;
        this.nurseInfo.created_at = new Date(Date.now()).toISOString();
        console.log('====================================');
        console.log(this.nurseInfo);
        console.log('====================================');
        this.pushNurseInfo();
    }

    async pushNurseInfo(){
        const result = await supabase
            .from<Database['public']['Tables']['nurse_info']>('nurse_info')
            .insert('*')
        if (result.error)
            console.log(result.error)
        if (result.data)
            console.log(result.data)
    }

    fetchNurseInfo(){

    }
}

const userStore = new UserStore();

export default userStore;