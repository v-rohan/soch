import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const VC_Card = () => {
  return (
    <TouchableOpacity style={styles.card}>
      <View>
        <Text style={styles.title}>VACCINATION CENTRE 1</Text>
        <Text style={styles.address}>Address line 1</Text>
        <Text style={styles.address}>Address line 2</Text>
        <Text style={styles.time}>Time</Text>
      </View>
      <MaterialCommunityIcon
        name="arrow-right-circle-outline"
        color="#fff"
        size={35}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: '#5F5DDF',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  address: {color: '#fff'},
  time: {marginTop: 10, color: '#9F9EEC'},
});

export default VC_Card;
