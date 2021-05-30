import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import VC_Card from './VC_Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sha256 } from 'js-sha256';
import { MMKV } from 'react-native-mmkv';



const Centres = ({ searchHandler }) => {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [pincode, setPincode] = React.useState(null)
  const [DATA, setData] = React.useState([])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const renderItem = ({ item }) => {
    return (
      <VC_Card
        name={item.name}
        address1={item.address}
        address2={item.district_name +" "+item.state_name}
        fee={item.fee_type+" - "+item.fee}
        metadata={item}
      />
    );
  };
  const onPressHandler = async () => {
    const data = {
      refid: sha256(MMKV.getString("number")),
      uuid: MMKV.getString("uuid"),
      pincode: pincode,
      date: date.toISOString().substr(0,10)

    };
    MMKV.set("currentAction", "search")
    console.log(data);
    const done = await searchHandler(data)
    console.log(done)
    if (done.status == 'false' || done.status == false) {
      Alert.alert("Error in Centre search. Try again later")
    }
    else if (done.status == 'pending') {
      var startTime = new Date().getTime();
      var interval = setInterval(function () {
        if (new Date().getTime() - startTime > 180000) {
          clearInterval(interval);
          Alert.alert("Request Timed Out. No devices nearby")
          return;
        }
        if (MMKV.getString("appData") === '-1') {
          clearInterval(interval);
          Alert.alert("Error in Centre search. Try again later")
          return;
        } if (JSON.parse(MMKV.getString("appData")).status === true) {
          setData(JSON.parse(MMKV.getString("appData")).sessions) //= JSON.parse(MMKV.getString("appData")).beneficiary_id
          clearInterval(interval);
          //history.push('/')
          return;
        }
      }, 200);
    } else {
      console.log(done.sessions)
      setData(done.sessions)
    }


  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>VACCINATION CENTRES</Text>
        <View style={styles.inputContainer}>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="6 digit pincode"
              placeholderTextColor="#fff"
              value={pincode}
              onChangeText={(text) => setPincode(text)}
              style={styles.input}
              keyboardType="number-pad"
            />
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                onPress={showDatepicker}
                style={[styles.search, { marginRight: 10, marginLeft: 0 }]}>
                <Icon name="calendar-alt" size={20} color="#fff" />
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#1C1C1E',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {'Date: ' + date.toDateString()}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <TouchableOpacity onPress={onPressHandler} style={styles.search}>
              <Icon name="arrow-circle-right" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.session_id.toString()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    marginLeft: 20,
    borderRadius: 15,
  },
});

export default Centres;
