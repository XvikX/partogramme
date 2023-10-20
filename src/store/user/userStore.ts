import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { Database } from '../../../types/supabase';
import { supabase, token } from '../../initSupabase';
import { RootStore } from '../rootStore';
import { Alert, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  token: string = "";
  password: string = "";
  state = "pending" // "pending", "done" or "error"
  rootStore: RootStore;

  /**
   * This is the constructor of the UserStore class, it make it observable.
   * this is used to make the store reactive.
   */
  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.token = token;
    makePersistable(this, {
      name: "UserStore",
      properties: ["profile"],
      storage: AsyncStorage,
      expireIn: 86400000, // 1 day in ms
      removeOnExpiration: true,
     });
  }

  setProfileId(profileId: string) {
    this.profile.id = profileId;
  }

  setProfileEmail(profileEmail: string) {
    this.profile.email = profileEmail;
  }

  setPassword(profilePassword: string) {
    this.password = profilePassword;
  }

  /**
   * this function is used to update the user's profile information on the server and locally.
   * @param id id of the user profile
   * @param firstName first name of the user
   * @param lastName lastname of the user
   * @param refDoctor name of the user's reference doctor
   */
  async UpdateServerProfileInfo(firstName: string, lastName: string, refDoctor: string) {
    let error = false;
    runInAction(() => {
      this.state = "pending"
    })

    const result = await supabase
      .from('Profile')
      .update({ firstName: firstName, lastName: lastName, refDoctor: refDoctor })
      .eq("id", this.profile.id)
    if (result.error) {
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
      return Promise.reject(error);
    }
    if (data.user && data.user.email && data.user.id) {
      isLoggedIn = true;
      console.log("User logged in with id :" + data.user.id);
      runInAction(() => {
        this.state = "done";
        this.profile.email = data.user.email!;
        this.profile.id = data.user.id!;
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

  async fetchNurseId() {
    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('id', this.profile.id)
      .single();
    if (error) {
      console.log('Error fetching profile id', error);
      throw error;
    } else if (data) {
      runInAction(() => {
        console.log("Profile fetched");
        console.log(data);
        this.profile.firstName = data.firstName;
        this.profile.lastName = data.lastName;
        this.profile.refDoctor = data.refDoctor;
        this.profile.role = data.role;
        this.profile.id = data.id;
        this.state = "done";
      });
    }
  }

  /**
   * This function is used get name of the user.
   * @returns the user's profile information
   */
  getProfileName() {
    return this.profile.firstName + " " + this.profile.lastName;
  }

  /**
   * This function clear the user's profile information.
   * It is used when the user logs out.
   */
  cleanUp() {
    this.profile = {
      email: null,
      firstName: null,
      id: "",
      lastName: null,
      refDoctor: null,
      role: null,
    };
  }

  set email(email:string) {
    this.profile.email = email;
  }

  get email() {
    return this.profile.email;
  }

  set firstName(firstName:string) {
    this.profile.firstName = firstName;
  }

  set lastName(lastName:string) {
    this.profile.lastName = lastName;
  }

  get lastName() {
    return this.profile.lastName;
  }

  get firstName() {
    return this.profile.firstName;
  }
}