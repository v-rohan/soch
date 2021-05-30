import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const BottomNavbar = () => {
  const [selectedIndex, setIndex] = useState(0);
  const buttons = ['mark-chat-unread', 'person-pin', 'leaderboard'];

  return (
    <View style={styles.bottomNavigation}>
      {buttons.map((value, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              console.log(`${value} pressed`);
              setIndex(index);
            }}
            style={
              index === selectedIndex
                ? [styles.menu, {backgroundColor: '#5F5DDF'}]
                : styles.menu
            }>
            <MaterialIcon name={value} color="#fff" size={40} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    paddingVertical: 10,
  },
  menu: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
  },
});

export default BottomNavbar;
