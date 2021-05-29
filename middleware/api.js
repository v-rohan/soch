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
    return res.data.token;
  } catch (error) {
    console.log(error);
    return false;
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
  //  MMKV.set('token', res.data.token);
    return res.data.token;
  } catch (error) {
    console.log('dddd' + error);
    return false;
  }
};

export const requestOTP = async (token) => {
  try {
    const res = await axios.get(`${BACKEND_URL}api/requestOTP/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTP = async (data, token) => {
  try {
    const res = await axios.post(`${BACKEND_URL}api/submitotp/`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const getSlotsByPin = async (data, token) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}api/base/appts/getByPin/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCalendarByCenter = async (data, token) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}api/base/appts/getCalendarByCenter`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
