import axios from 'axios';
import {BACKEND_URL} from '@env';
import {MMKV} from 'react-native-mmkv';

export const register = async (data) => {
  try {
    let res = await axios.post(`${BACKEND_URL}api/register/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('api response', res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const login = async (data) => {
  try {
    const res = await axios.post(`${BACKEND_URL}api/login/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    //const response = await res.json()
    console.log('api response', res.data);
    MMKV.set('token', res.data.token);
    console.log(MMKV.getString('token'));
    console.log(MMKV.getString('userUid'));
  } catch (error) {
    console.log('dddd' + error);
  }
};
