import Reactotron, { networking } from "reactotron-react-native";
Reactotron.configure({ host: '192.168.0.17', port: 9090 }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(networking())
  .connect(); // let's connect!
