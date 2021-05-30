import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

const AddBeneficiary = () => {
  const [name, onChangeName] = React.useState(null);
  const [birthYear, onChangeBirthYear] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [idType, setIdType] = React.useState(null);
  const [idNumber, onChangeIdNumber] = React.useState(null);
  const [comorbidity, setComorbidity] = React.useState(null);

  const genders = [
    {label: 'Male', value: 0, id: 1},
    {label: 'Female', value: 1, id: 2},
    {label: 'Others', value: 2, id: 3},
  ];

  const idTypes = [
    {label: 'Aadhar Card', value: 0, id: 1},
    {label: 'PAN Card', value: 1, id: 6},
    {label: 'Driving License', value: 2, id: 2},
  ];

  const comordbidities = [
    {label: 'YES', value: 0, id: 'Y'},
    {label: 'NO', value: 1, id: 'N'},
  ];

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>BENEFICIARY FORM</Text>
      </View>
      <ScrollView>
        <View style={{padding: 15}}>
          <TextInput
            value={name}
            onChangeText={(text) => onChangeName(text)}
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#fff"
          />
          <TextInput
            value={birthYear}
            onChangeText={(text) => onChangeBirthYear(text)}
            style={styles.input}
            placeholder="Year of Birth (YYYY)"
            placeholderTextColor="#fff"
            keyboardType="number-pad"
          />
          <Text style={{color: '#fff', fontSize: 18, marginVertical: 15}}>
            GENDER
          </Text>
          <RadioForm formHorizontal={true} animation={true}>
            {genders.map((obj, i) => (
              <RadioButton key={i}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={gender === i}
                  onPress={(val) => setGender(val)}
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
                  onPress={(val) => setGender(val)}
                  labelStyle={{fontSize: 16, color: '#fff', marginRight: 12}}
                />
              </RadioButton>
            ))}
          </RadioForm>
          <Text style={{color: '#fff', fontSize: 18, marginVertical: 15}}>
            ID Type
          </Text>
          <RadioForm animation={true}>
            {idTypes.map((obj, i) => (
              <RadioButton key={i}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={idType === i}
                  onPress={(val) => setIdType(val)}
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
                  onPress={(val) => setIdType(val)}
                  labelStyle={{fontSize: 16, color: '#fff'}}
                />
              </RadioButton>
            ))}
          </RadioForm>
          <TextInput
            value={idNumber}
            onChangeText={(text) => onChangeIdNumber(text)}
            style={[styles.input, {marginTop: 20}]}
            placeholder="ID Number"
            placeholderTextColor="#fff"
            keyboardType="number-pad"
          />
          <Text style={{color: '#fff', fontSize: 18, marginVertical: 15}}>
            Have Comorbidity?
          </Text>
          <RadioForm formHorizontal={true} animation={true}>
            {comordbidities.map((obj, i) => (
              <RadioButton key={i}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={comorbidity === i}
                  onPress={(val) => setComorbidity(val)}
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
                  onPress={(val) => setComorbidity(val)}
                  labelStyle={{fontSize: 16, color: '#fff', marginRight: 12}}
                />
              </RadioButton>
            ))}
          </RadioForm>
          <TouchableOpacity onPress={() => {}} style={styles.search}>
            <Text style={{color: '#fff', marginRight: 10, fontSize: 16}}>
              ADD BENIFICIARY
            </Text>
            <Icon name="plus-circle" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
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
  search: {
    padding: 12,
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
  input: {
    marginVertical: 10,
    flex: 1,
    backgroundColor: '#1C1C1E',
    fontSize: 16,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    color: '#fff',
  },
});

export default AddBeneficiary;
