import Reactotron, { openInEditor, asyncStorage } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
import { NativeModules } from 'react-native';
import url from 'url';

const { hostname: host } = url.parse(NativeModules.SourceCode.scriptURL);

if ( __DEV__ ) {
  const tron = Reactotron.configure({ host })
    .use(reactotronRedux())
    .use(asyncStorage())
    .use(sagaPlugin())
    .use(openInEditor())
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron;
}
