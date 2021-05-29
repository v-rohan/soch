import React, {useState, useEffect} from 'react';
import {
  Platform,
  View,
  Button,
  Text,
  Alert,
  StyleSheet,
  NativeEventEmitter,
  ToastAndroid,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {API_KEY} from '@env';
import {MMKV} from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomNavbar from './components/BottomNavbar';
import VC_Card from './components/VC_Card';
import { login, register } from "./middleware/api"
import 'react-native-get-random-values';
import {sha256} from 'js-sha256';
import {v4 as uuid} from 'uuid';
import {NativeRouter, Switch, Route, useHistory} from 'react-router-native';

import RNBridgefy, {BrdgNativeEventEmitter} from 'react-native-bridgefy';

const BRDG_LICENSE_KEY: string = API_KEY;
// import Register from './components/Register';
import {
  BridgefyMessage,
  BridgefyClient,
  MessageFailedEvent,
  MessageReceivedExceptionEvent,
  StartErrorEvent,
  StoppedEvent,
  DeviceConnectedEvent,
  DeviceLostEvent,
  EventOccurredEvent,
} from 'react-native-bridgefy';
import Register from './components/Register';
import Login from './components/Login';

const bridgefyEmitter: BrdgNativeEventEmitter = new NativeEventEmitter(
  RNBridgefy,
);

var connected: boolean;
var setConnected: React.Dispatch<React.SetStateAction<boolean>>;

interface AppMsg {
  message: string;
  type: string;
  time: Number;
  uuid: string;
}

// function useNetInfo() {
//   // useState hook for setting netInfo
//   const [netInfo, setNetInfo] = useState(false)

//   // It calls when connection changes
//   const onChange = (newState) => {
//     setNetInfo(newState)
//   }

//   // useEffect hook calls only once like componentDidMount()
//   useEffect(() => {
//     // To get current network connection status
//     NetInfo.isConnected.fetch().then((connectionInfo) => {
//       setNetInfo(connectionInfo)
//     })
//     // Whenever connection status changes below event fires
//     NetInfo.isConnected.addEventListener('connectionChange', onChange)

//     // Our event cleanup function
//     return () => {
//       NetInfo.isConnected.removeEventListener('connectionChange', onChange)
//     }
//   }, [])

//   // returns current network connection status
//   return netInfo
// }

export default function App() {
  const connectedState = useState(false);
  connected = connectedState[0];
  setConnected = connectedState[1];
  let history = useHistory();

  let clearListeners = () => {
    bridgefyEmitter.removeAllListeners('onMessageReceived');
    bridgefyEmitter.removeAllListeners('onBroadcastMessageReceived');
    bridgefyEmitter.removeAllListeners('onMessageFailed');
    bridgefyEmitter.removeAllListeners('onMessageSent');
    bridgefyEmitter.removeAllListeners('onMessageReceivedException');
    bridgefyEmitter.removeAllListeners('onStarted');
    bridgefyEmitter.removeAllListeners('onStartError');
    bridgefyEmitter.removeAllListeners('onStopped');
    bridgefyEmitter.removeAllListeners('onDeviceConnected');
    bridgefyEmitter.removeAllListeners('onDeviceLost');
    bridgefyEmitter.removeAllListeners('onEventOccurred');
  };

  let initListeners = () => {
    console.log('INITIATING THE BRDG RN LISTENERS');
    bridgefyEmitter.addListener(
      'onMessageReceived',
      (message: BridgefyMessage<AppMsg>) => {
        console.log('onMessageReceived: ' + JSON.stringify(message));
        if (message.content.type === MMKV.getString('currentAction')) {
          MMKV.delete('currentAction');
          if (message.content.type === 'login') {
            let data = JSON.parse(message.content.message);
            console.log(data);
            if (data.status === true) {
              MMKV.delete("token")
              MMKV.set("token", data.token)
              history.replace("/beneficiary")
            }
            else {
              console.log("hein")
              MMKV.set("appData", "-1")
            }
          }
          else if (message.content.type === "register-soch") {
            let data = JSON.parse(message.content.message)
            console.log(data)
            if (data.status === true) {
              MMKV.delete("token")
              MMKV.set("token", data.token)
              history.replace("/beneficiary")
            }
            else {
              console.log("hein")
              MMKV.set("appData", "-1")
            }

          }
        }
      },
    );

    // This event is launched when a broadcast message has been received, the structure
    // of the dictionary received is explained in the appendix.
    bridgefyEmitter.addListener(
      'onBroadcastMessageReceived',
      (message: BridgefyMessage<AppMsg>) => {
        console.log('onBroadcastMessageReceived: ' + JSON.stringify(message));
        //if(message.content.time)
        if (message.content.type === 'login') {
          loginHandler(JSON.parse(message.content.message));
        }
        else if (message.content.type === "register-soch") {
          registerHandler(JSON.parse(message.content.message))
        }
      },
    );

    // This event is launched when a message could not be sent, it receives an error
    // whose structure will be explained in the appendix
    bridgefyEmitter.addListener(
      'onMessageFailed',
      (evt: MessageFailedEvent<AppMsg>) => {
        console.log('onMessageFailed: ' + evt);
      },
    );

    // This event is launched when a message was sent, contains the message
    // itself, and the structure of message is explained in the appendix.
    bridgefyEmitter.addListener(
      'onMessageSent',
      (message: BridgefyMessage<AppMsg>) => {
        console.log('onMessageSent: ' + JSON.stringify(message));
      },
    );

    // This event is launched when a message was received but it contains errors,
    // the structure for this kind of error is explained in the appendix.
    // This method is launched exclusively on Android.
    bridgefyEmitter.addListener(
      'onMessageReceivedException',
      (evt: MessageReceivedExceptionEvent<AppMsg>) => {
        console.log('onMessageReceivedException: ' + evt);
      },
    );

    //
    // Device listeners
    //

    // This event is launched when the service has been started successfully, it receives
    // a device dictionary that will be descripted in the appendix.
    bridgefyEmitter.addListener('onStarted', (device: BridgefyClient) => {
      // For now, device is an empty dictionary
      console.log('onStarted');
      setConnected(true);
    });

    // This event is launched when the RNBridgefy service fails on the start, it receives
    // a dictionary (error) that will be explained in the appendix.
    bridgefyEmitter.addListener('onStartError', (evt: StartErrorEvent) => {
      console.log('onStartError: ', evt);
    });

    // This event is launched when the RNBridgefy service stops.
    bridgefyEmitter.addListener('onStopped', (evt: StoppedEvent) => {
      console.log('onStopped');
      setConnected(false);
    });

    // This method is launched when a device is nearby and has established connection with the local user.
    // It receives a device dictionary.
    bridgefyEmitter.addListener(
      'onDeviceConnected',
      (evt: DeviceConnectedEvent) => {
        console.log('onDeviceConnected: ' + JSON.stringify(evt));
      },
    );
    // This method is launched when there is a disconnection of a user.
    bridgefyEmitter.addListener('onDeviceLost', (evt: DeviceLostEvent) => {
      console.log('onDeviceLost: ' + evt);
    });

    // This is method is launched exclusively on iOS devices, notifies about certain actions like when
    // the bluetooth interface  needs to be activated, when internet is needed and others.
    bridgefyEmitter.addListener(
      'onEventOccurred',
      (event: EventOccurredEvent) => {
        console.log(
          'Event code: ' + event.code + ' Description: ' + event.description,
        );
      },
    );
  };

  let initBrdg = () => {
    function doInitBrdg() {
      RNBridgefy.init(BRDG_LICENSE_KEY)
        .then((brdgClient: BridgefyClient) => {
          console.log('Brdg client = ', brdgClient);
          RNBridgefy.start({
            autoConnect: true,
            engineProfile: 'BFConfigProfileDefault',
            energyProfile: 'HIGH_PERFORMANCE',
            encryption: true,
          });
          MMKV.set('uuid', brdgClient.userUuid);
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
    if (Platform.OS == 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ])
        .then((result) => {
          if (
            result['android.permission.ACCESS_COARSE_LOCATION'] ||
            result['android.permission.ACCESS_FINE_LOCATION']
          ) {
            doInitBrdg();
          }
        })
        .catch((e: Error) => {
          console.error(e);
        });
    } else {
      doInitBrdg();
    }
  };

  let onSendBroadcast = (mesaage: String, type: String, uuid: String) => {
    if (!connected) {
      Alert.alert('Bridgefy not ready', 'Your Bridgefy could not start yet');
      return false;
    }

    var message = {
      content: {type: type, message: mesaage, time: Date.now(), uuid: uuid},
    };

    RNBridgefy.sendBroadcastMessage(message);
  };

  let OnSendMessage = (
    mesaage: String,
    type: String,
    uuid: String,
    originaluuid: string,
  ) => {
    if (!connected) {
      Alert.alert('Bridgefy not ready', 'Your Bridgefy could not start yet');
      return false;
    }

    var message = {
      content: {type: type, message: mesaage, time: Date.now(), uuid: uuid},
      receiver_id: originaluuid,
    };
    RNBridgefy.sendMessage(message);
  };

  let checkInternet = async () => {
    console.log('check');
    try {
      const res = await fetch('https://clients3.google.com/generate_204');
      if (res.status === 204) return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  let loginHandler = async (data: Object) => {
    if (await checkInternet() == true) {
      console.log("online")
      const payload = {
        username: data.username,
        password: data.password
      }
      const stat = await login(payload)
      if (sha256(data.username) === sha256(MMKV.getString("number")+"DDD")) {
        if (stat !== false) {
          MMKV.set('token', stat);
          return {status: 'true'};
        } else return {status: 'false'};
      } else {
        if (stat !== false) {
          OnSendMessage(
            JSON.stringify({status: true, token: stat}),
            'login',
            MMKV.getString('uuid'),
            data.uuid,
          );
        } else {
          OnSendMessage(
            JSON.stringify({status: false}),
            'login',
            MMKV.getString('uuid'),
            data.uuid,
          );
        }
      }
    } else {
      console.log('offline');
      onSendBroadcast(JSON.stringify(data), 'login', data.uuid);
      return {status: 'pending'};
    }
  };

  let registerHandler = async (data: Object) => {
    if (await checkInternet() == true) {
      console.log("online")
      const payload = {
        username: data.username,
        password: data.password,
        password2: data.password2
      }
      const stat = await register(payload)
      if (sha256(data.username) === sha256(MMKV.getString("number")+"DDD")) {
        if (stat !== false) {
          MMKV.set('token', stat);
          return {status: 'true'};
        } else return {status: 'false'};
      } else {
        if (stat !== false) {
          OnSendMessage(JSON.stringify({ status: true, token: stat }), "register-soch", MMKV.getString("uuid"), data.uuid)
        }
        else {
          OnSendMessage(JSON.stringify({ status: false }), "register-soch", MMKV.getString("uuid"), data.uuid)
        }
      }
    } else {
      console.log("offline")
      onSendBroadcast(JSON.stringify(data), "register-soch", data.uuid)
      return { status: 'pending' }
    }
  };

  useEffect(() => {
    initListeners();
    initBrdg();

    return function cleanup() {
      if (connected) {
        RNBridgefy.stop();
      }
      clearListeners();
    };
  }, []);

  return (
    <NativeRouter>
      <View style={styles.container}>
        <Switch>
          <Route exact path="/" render={props => <Login loginHandler={loginHandler} />} />
          <Route exact path="/register" render={props => <Register registerHandler={registerHandler} />} />
          <Route exact path="/beneficiary" component={Register} />
        </Switch>
      </View>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  connected: {
    backgroundColor: 'rgba(22,255,22,.3)',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    // justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 45,
    backgroundColor: '#2D2D39',
  },
  text: {
    // textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    fontSize: 16,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    color: '#fff',
  },
  search: {
    padding: 15,
    backgroundColor: '#1C1C1E',
    marginLeft: 10,
    borderRadius: 15,
  },
  connectedText: {
    color: 'green',
    textAlign: 'center',
  },
  disconnected: {
    backgroundColor: 'rgba(255,22,22,.3)',
  },
  disconnectedText: {
    color: 'red',
    textAlign: 'center',
  },
});
