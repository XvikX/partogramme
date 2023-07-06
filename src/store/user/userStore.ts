import { makeAutoObservable, runInAction } from 'mobx';
import {v4 as uuidv4, v4} from 'uuid';
import { Database } from '../../../types/supabase';
import { supabase } from '../../initSupabase';
import { PartogrammeStore } from '../partogramme/partogrammeStore';
import { RootStore } from '../rootStore';
import { Alert, Platform, ToastAndroid } from 'react-native';

export type Profile = Database['public']['Tables']['Profile'];
export type Role = Database['public']['Enums']['Role']

/**
 * UserStore is a MobX store that contains the user's profile information.
 * It is used to store the user's profile information and to fetch it from the database.
 */
export class UserStore {
    // Declare data of the store and their initial values
    profile: Profile['Row'] = {
        email: null,
        firstName: null,
        id: "",
        lastName: null,
        refDoctor: null,
        role: 'NURSE',
    };
    state = "pending" // "pending", "done" or "error"
    rootStore: RootStore;

    /**
     * This is the constructor of the UserStore class, it make it observable.
     * this is used to make the store reactive.
     */
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    setProfileId(profileId: string) {
        this.profile.id = profileId;
    }

    setProfileEmail(profileEmail: string) {
        this.profile.email = profileEmail;
    }

    /**
     * this function is used to update the user's profile information on the server and locally.
     * @param id id of the user profile
     * @param firstName first name of the user
     * @param lastName lastname of the user
     * @param refDoctor name of the user's reference doctor
     */
    async UpdateServerProfileInfo(firstName: string, lastName: string, refDoctor: string){
        let error = false;
        runInAction(() => {
            this.state = "pending"
        })
        
        const result = await supabase
            .from('Profile')
            .update({firstName: firstName, lastName: lastName, refDoctor: refDoctor})
            .eq("id", this.profile.id)
        if (result.error){
            console.log("Error updating profile info");
            runInAction(() => {
                this.state = "error"
            })
            error = true;
        }
        else {
            console.log("Profile info updated");
            runInAction(() => {
                this.profile.firstName = firstName;
                this.profile.lastName = lastName;
                this.profile.refDoctor = refDoctor;
                this.state = "done"
            })
            error = true;
        }
    }

    async signInWithEmail(email: string, password: string) {
      let isLoggedIn = false;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Error signing in: " + error.message);
        this.state = "error";
        Alert.alert(error.message);
      }
      if (data.user && data.user.email && data.user.id) {
        isLoggedIn = true;
        console.log("User logged in with id :" + data.user.id);
        this.setProfileId(data.user.id);
        this.setProfileEmail(data.user.email);
        runInAction(() => {
          this.state = "done";
        });
        if (Platform.OS === "android") {
          ToastAndroid.showWithGravity(
            "Connecté avec " + data.user.email + " !",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        }
      }
      return isLoggedIn;
    }

    /**
     * This function is used get name of the user.
     * @returns the user's profile information
     */
    getProfileName(){
        return this.profile.firstName + " " + this.profile.lastName;
    }
}