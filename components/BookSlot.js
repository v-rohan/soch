import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome5';

const BookSlot = () => {
  const radio_props1 = [
    {label: 'First Dose', value: 0},
    {label: 'Second Dose', value: 1},
  ];
  const radio_props2 = [
    {label: 'FORENOON', value: 0},
    {label: 'AFTERNOON', value: 1},
  ];

  const [value1, setValue1] = React.useState(null);
  const [value2, setValue2] = React.useState(null);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>BOOK APPOINTMENT</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>VACCINATION CENTRE 1</Text>
        <Text style={styles.address}>Address 1</Text>
        <Text style={styles.address}>Address 2</Text>
      </View>
      <ScrollView style={{marginHorizontal: 15}}>
        <Text style={{color: '#fff', fontSize: 18, marginVertical: 15}}>
          DOSE
        </Text>
        <RadioForm animation={true}>
          {radio_props1.map((obj, i) => (
            <RadioButton key={i}>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={value1 === i}
                onPress={(val) => setValue1(val)}
                borderWidth={1}
                buttonInnerColor={'#5F5DDF'}
                buttonOuterColor={'#5F5DDF'}
                buttonSize={15}
                buttonOuterSize={30}
                buttonStyle={{}}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                onPress={(val) => setValue1(val)}
                labelStyle={{fontSize: 16, color: '#fff'}}
              />
            </RadioButton>
          ))}
        </RadioForm>
        <Text style={{color: '#fff', fontSize: 18, marginVertical: 15}}>
          SLOT
        </Text>
        <RadioForm animation={true}>
          {radio_props2.map((obj, i) => (
            <RadioButton key={i}>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={value2 === i}
                onPress={(val) => setValue2(val)}
                borderWidth={1}
                buttonInnerColor={'#5F5DDF'}
                buttonOuterColor={'#5F5DDF'}
                buttonSize={15}
                buttonOuterSize={30}
                buttonStyle={{}}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                onPress={(val) => setValue2(val)}
                labelStyle={{fontSize: 16, color: '#fff'}}
              />
            </RadioButton>
          ))}
        </RadioForm>
        <TouchableOpacity onPress={() => {}} style={styles.search}>
          <Text style={{color: '#fff', marginRight: 10, fontSize: 17}}>
            BOOK
          </Text>
          <Icon name="arrow-circle-right" size={25} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#2D2D39',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  text: {
    // textAlign: 'center',
    // marginBottom: 30,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    margin: 15,
    padding: 15,
    backgroundColor: '#5F5DDF',
    borderRadius: 15,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  address: {color: '#fff'},
  time: {marginTop: 10, color: '#9F9EEC'},
  search: {
    padding: 15,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
    // padding: 15,
    backgroundColor: '#5F5DDF',
    // marginLeft: 10,
    borderRadius: 15,
  },
});

export default BookSlot;
