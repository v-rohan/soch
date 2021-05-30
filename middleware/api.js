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
    const res = await axios.get(`${BACKEND_URL}api/requestotp/`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Token "+ MMKV.getString("token"),
        'REFERRER-ID': refId
      },
    });
    console.log(res.status)
    if(res.status===200)
    return true
    else return false
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addBenificiary = async(refid,data)=>{
  try {
    const res = await axios.post(`${BACKEND_URL}api/base/register/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Token "+MMKV.getString("token"),
        'Referrer-Id': refid
      },
    });
    return { status: true, taskId: res.data.taskId}
  } catch (error) {
    console.log(error);
    return {status: false}
  }
}

export const verifyOTP = async (refid, data) => {
  try {
    const res = await axios.post(`${BACKEND_URL}api/submitotp/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Token "+MMKV.getString("token"),
        'Referrer-Id': refid
      },
    });
    return { status: true, taskId: res.data.taskId}
  } catch (error) {
    console.log(error);
    return {status: false}
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
