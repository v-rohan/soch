import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useHistory } from 'react-router-native';

const Home = () => {
  useEffect(() => {
    if (
      MMKV.getString('token') === undefined ||
      MMKV.getString('number') === undefined
    )
      history.replace('/login');
  });
  let history = useHistory();
  const showBeneficiary = MMKV.getString('beneficiary') != undefined;
  const showBooking = MMKV.getString('booking') != undefined;

  const gender = ["", "Male", "Female", "Others"]
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.text}>HOME</Text>
        <TouchableOpacity
          onPress={() => history.push('/centres')}
          style={styles.search}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ padding: 15 }}>
        <View>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 5 }}>
            BENEFICIARY INFO
          </Text>
          {showBeneficiary ? (
            <View style={styles.card}>
              <Text style={styles.title}>NAME:  {JSON.parse(MMKV.getString('beneficiary')).name}</Text>
              <Text style={styles.address}>BIRTH YEAR: {JSON.parse(MMKV.getString('beneficiary')).birth_year}</Text>
              <Text style={styles.address}>ID NUMBER: {JSON.parse(MMKV.getString('beneficiary')).photo_id_number}</Text>
              <Text style={styles.address}>BENEFICIARY ID: {JSON.parse(MMKV.getString('beneficiary')).beneficiary_id}</Text>
              <Text style={styles.time}>GENDER: {gender[JSON.parse(MMKV.getString('beneficiary')).gender_id]}</Text>
            </View>
          ) : (
            <>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  marginTop: 15,
                  fontSize: 15,
                }}>
                No beneficiary added
              </Text>
              <TouchableOpacity
                onPress={() => history.push('/beneficiary')}
                style={styles.addBtn}>
                <Text style={{ color: '#fff', marginRight: 10, fontSize: 16 }}>
                  ADD BENIFICIARY
                </Text>
                <Icon name="plus-circle" size={25} color="#fff" />
              </TouchableOpacity>
            </>
          )}
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
          {showBooking?
            (<View style={styles.card}>
              <Text style={styles.title}>CENTRE NAME: {JSON.parse(MMKV.getString('booking')).hospital_name}</Text>
              <Text style={styles.address}>Vaccine: {JSON.parse(MMKV.getString('booking')).vaccine}</Text>
              <Text style={styles.address}>ADDRESS: {JSON.parse(MMKV.getString('booking')).address}</Text>
              <Text style={styles.time}>DOSE: {JSON.parse(MMKV.getString('booking')).dose}</Text>
              <Text style={styles.time}>SLOT: {JSON.parse(MMKV.getString('booking')).slot}</Text>
            </View>
            ) : (
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  marginTop: 15,
                  fontSize: 15,
                }}>
                No slots booked
              </Text>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  address: { color: '#fff' },
  time: { marginTop: 10, color: '#9F9EEC' },
  addBtn: {
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
  search: {
    padding: 15,
    backgroundColor: '#1C1C1E',
    marginLeft: 20,
    borderRadius: 15,
  },
});

export default Home;
