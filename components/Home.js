import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Home = () => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>HOME</Text>
      </View>
      <ScrollView style={{padding: 15}}>
        <View>
          <Text style={{color: '#fff', fontSize: 18, marginBottom: 5}}>
            BENEFICIARY INFO
          </Text>
          <View style={styles.card}>
            <Text style={styles.title}>NAME</Text>
            <Text style={styles.address}>BIRTH YEAR</Text>
            <Text style={styles.address}>ID NUMBER</Text>
            <Text style={styles.time}>GENDER</Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={styles.search}>
            <Text style={{color: '#fff', marginRight: 10, fontSize: 16}}>
              ADD BENIFICIARY
            </Text>
            <Icon name="plus-circle" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              marginBottom: 5,
              marginTop: 25,
            }}>
            BOOKED SLOT
          </Text>
          <View style={styles.card}>
            <Text style={styles.title}>NAME</Text>
            <Text style={styles.address}>SLOT</Text>
            <Text style={styles.address}>ADDRESS</Text>
            <Text style={styles.time}>DOSE</Text>
          </View>
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
});

export default Home;