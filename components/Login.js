import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {login} from '../middleware/api';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

const Login = ({history}) => {
  const [mobileNum, onChangeMobileNum] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);

  const [dimensions, setDimensions] = React.useState({window, screen});

  const onChange = ({window, screen}) => {
    setDimensions({window, screen});
  };

  React.useEffect(() => {
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  });

  const onPressHandler = () => {
    const data = JSON.stringify({
      username: mobileNum,
      password: password,
    });
    console.log(data);
    login(data);
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>LOGIN</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={[
            styles.centerContainer,
            {
              width: dimensions.window.width * 0.9,
              height: dimensions.window.height * 0.3,
            },
          ]}>
          <TextInput
            value={mobileNum}
            onChangeText={(text) => onChangeMobileNum(text)}
            placeholder="10 digit Mobile Number"
            placeholderTextColor="#fff"
            style={styles.input}
            keyboardType="number-pad"
          />
          <TextInput
            value={password}
            onChangeText={(text) => onChangePassword(text)}
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#fff"
          />
        </View>
        <TouchableOpacity onPress={onPressHandler} style={styles.search}>
          <Text style={{color: '#fff', marginRight: 10, fontSize: 17}}>
            LOGIN
          </Text>
          <Icon name="arrow-circle-right" size={25} color="#fff" />
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: '#fff',
              marginTop: 20,
              marginRight: 10,
              fontSize: 15,
            }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => history.push('/register')}>
            <Text
              style={{
                color: '#5F5DDF',
                marginTop: 20,
                fontSize: 15,
                textDecorationLine: 'underline',
              }}>
              REGISTER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  centerContainer: {
    // marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#2D2D39',
  },
  text: {
    // textAlign: 'center',
    // marginBottom: 30,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  search: {
    padding: 15,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
    // padding: 15,
    backgroundColor: '#5F5DDF',
    marginLeft: 10,
    borderRadius: 15,
  },
});

export default Login;
