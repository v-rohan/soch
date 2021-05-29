import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const VC_Card = ({name, address1, address2, time}) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.address}>{address1}</Text>
        <Text style={styles.address}>{address2}</Text>
        <Text style={styles.time}>{time}</Text>
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
    margin: 15,
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
