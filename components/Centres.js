import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import VC_Card from './VC_Card';
import DateTimePicker from '@react-native-community/datetimepicker';

const DATA = [
  {
    id: 1,
    name: 'VACCINATION CENTRE 1',
    address1: 'Address line 1',
    address2: 'Address line 2',
    time: 'Time',
  },
  {
    id: 2,
    name: 'VACCINATION CENTRE 2',
    address1: 'Address line 1',
    address2: 'Address line 2',
    time: 'Time',
  },
  {
    id: 3,
    name: 'VACCINATION CENTRE 3',
    address1: 'Address line 1',
    address2: 'Address line 2',
    time: 'Time',
  },
  {
    id: 4,
    name: 'VACCINATION CENTRE 4',
    address1: 'Address line 1',
    address2: 'Address line 2',
    time: 'Time',
  },
  {
    id: 5,
    name: 'VACCINATION CENTRE 5',
    address1: 'Address line 1',
    address2: 'Address line 2',
    time: 'Time',
  },
];

const Centres = () => {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

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

  const renderItem = ({item}) => {
    return (
      <VC_Card
        name={item.name}
        address1={item.address1}
        address2={item.address2}
        time={item.time}
      />
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>VACCINATION CENTRES</Text>
        <View style={styles.inputContainer}>
          <View style={{flex: 1}}>
            <TextInput
              placeholder="6 digit pincode"
              placeholderTextColor="#fff"
              style={styles.input}
            />
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableOpacity
                onPress={showDatepicker}
                style={[styles.search, {marginRight: 10, marginLeft: 0}]}>
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
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity style={styles.search}>
              <Icon name="arrow-circle-right" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
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
