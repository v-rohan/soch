import React from 'react';
import {View, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const BookSlot = () => {
  DropDownPicker.setTheme('DARK');
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('apple');
  const [items, setItems] = React.useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      onChangeValue={(val) => setValue(val)}
      setItems={setItems}
    />
  );
};

const styles = StyleSheet.create({});

export default BookSlot;
