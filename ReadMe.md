# Partogramme Application
This repository contains the source code for the Partogramme application on mobile and web.

this project use the framework reactnative and expo to build both mobile and web application.

The application is build using the supabase database and authentification service.
To learn more about supabase, visit https://supabase.io/

<img src="assets\global_functional_schema.png" alt= “” width="1000">

# Getting Started
To get started clone the repository.

Then setup your reactNative/expo environement by following the tutorial on https://reactnative.dev/docs/environment-setup

Once you've done the quick start guide, go into the project folder and run the following command to install all the dependencies:
```bash
npm install
```
# Running the application
To run the application on your device, run the following command:
```bash
npm start
```
This will start the expo server and open a new tab in your browser. From there you can choose to run the application on your device or on a simulator.
## Running on personal devices
To run the application on your personal device, you will need to install the expo application on your device. You can find it on the app store or the play store.
More info on https://docs.expo.dev/.

Once you have the application installed, you can scan the QR code on the expo server page to run the application on your device.

## Running on simulator
To run the application on a simulator, you will need to install the simulator on your computer.
Just follow this tutorial to install the simulator : https://docs.expo.dev/workflow/android-studio-emulator/.

Then to launch the application on the simulator, launch the expo server and press the key that say "Run on Android device/emulator" or "Run on iOS simulator" depending on the simulator you installed.

# Project Structure
there is 3 main folder in the project:
- src: contains all the source code of the application.
  - components: contains all the components
  - screens: contains all the screens
  - store: contains all mobx store
  - transport: contains all the api calls
- prisma: contains the prisma schema that define the database structure.
- types: contains the typescript types generated by supabase and other needed constants.

# Update Database types
The typescript types are generated by supabase. To update them, run the following command:
```bash
npx supabase login
npx supabase gen types typescript --project-id yqgeaxbjjjvxgmbtpqqp  > types/supabase.ts
```
# prisma cmd
Here some cmds to use with prisma cli.
To learn more about prisma, visit https://www.prisma.io/.
To format  your prisma schema, run the following command:
```bash
npx prisma format
```

To open the prisma studio, it allowed to see the content of the database.
Run the following command:
```bash
npx prisma studio
```

To update the database, run the following command:
```bash
npx prisma migrate dev --name <name>
```

# Envirronement variables
In order to setup the application, you will need to create a .env file at the root of the project.
This file will contain all the envirronement variables needed to run the application.
Here is the list of the variables needed:
DATABASE_URL
SHADOW_DATABASE_URL
SUPABASEURL
SUPABASEKEY
EMAIL_ADMIN
EMAIL_ADMIN_PASSWORD

# To connect to local supabase 
http://<your_local_ip_adress>:54323/


Tcheck awesome react !!!
