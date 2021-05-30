import axios from 'axios';
import { BACKEND_URL } from '@env';
import { MMKV } from 'react-native-mmkv';

export const register = async (data) => {
  try {
    let res = await axios.post(`${BACKEND_URL}api/register/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('api response', res.data);
    return res.data.detail.token;
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

export const requestOTP = async (refId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}api/requestotp/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Token " + MMKV.getString("token"),
        'REFERRER-ID': refId
      },
    });
    console.log(res.status)
    if (res.status === 200)
      return true
    else return false
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addBenificiary = async (refid, data) => {
  try {
    const res = await axios.post(`${BACKEND_URL}api/base/add/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Token " + MMKV.getString("token"),
        'Referrer-Id': refid
      },
    });
    console.log(res.data)
    return { status: true, taskId: res.data.taskId, beneficiary_id: res.data.detail.beneficiary_id }
  } catch (error) {
    console.log(error);
    return { status: false }
  }
}

export const verifyOTP = async (refid, data) => {
  try {
    const res = await axios.post(`${BACKEND_URL}api/submitotp/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Token " + MMKV.getString("token"),
        'Referrer-Id': refid
      },
    });
    return { status: true, taskId: res.data.taskId }
  } catch (error) {
    console.log(error);
    return { status: false }
  }
};

export const getSlotsByPin = async (data, refid) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}api/base/appts/getByPinDummy/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Token " + MMKV.getString("token"),
          'Referrer-Id': refid
        },
      },
    );
    //  console.log(res.data)
    return { status: true, taskId: res.data.taskId, sessions: JSON.parse(res.data.detail).sessions }
  } catch (error) {
    console.log(error);
    return { status: false }
  }
};

export const bookSlot = async (data, refid) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}api/base/book-dummy/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Token " + MMKV.getString("token"),
          'Referrer-Id': refid
        },
      },
    );
    console.log(res.data)
    return { status: true, taskId: res.data.taskId, booking: JSON.parse(res.data.detail).appointment_id }
  } catch (error) {
    console.log(error);
    return { status: false }
  }
};