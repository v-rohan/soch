import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Dimensions,
    Alert,
    ToastAndroid
} from 'react-native';
import { useHistory } from "react-router-native"
import { MMKV } from 'react-native-mmkv';
import { sha256 } from 'js-sha256';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

const OTP = ({ otpRequestHandler, otpSubmitHandler }) => {
    const [OTPdata, onChangeOTP] = React.useState("");
    let history = useHistory();
    const [dimensions, setDimensions] = React.useState({ window, screen });

    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    };

    React.useEffect(() => {
        Dimensions.addEventListener('change', onChange);
        return () => {
            Dimensions.removeEventListener('change', onChange);
        };
    });

    const onPressHandler = async () => {
        const data = {
            refid: sha256(MMKV.getString("number")),
            uuid: MMKV.getString("uuid")
        };
        MMKV.set("currentAction", "req-otp")
        console.log(data);
        const done = await otpRequestHandler(data)
        console.log(done)
        if (done.status == 'false') {
            Alert.alert("Error in OTP generation. Try again later")
        }
        else if (done.status == 'pending') {
            var startTime = new Date().getTime();
            var interval = setInterval(function () {
                if (new Date().getTime() - startTime > 180000) {
                    clearInterval(interval);
                    Alert.alert("Request Timed Out. No devices nearby")
                    return;
                }
                if (MMKV.getString("appData") === '-1') {
                    clearInterval(interval);
                    Alert.alert("Error in OTP generation. Try again later")
                    return;
                }
            }, 200);
        } else {
            ToastAndroid.show("CHECK SMS APP FOR OTP", ToastAndroid.SHORT)
        }


    };

    const onPressHandler2 = async () => {
        console.log("heun")
        const data = {
            otp: OTPdata,
            refid: sha256(MMKV.getString("number")),
            uuid: MMKV.getString("uuid")
        };
        MMKV.set("currentAction", "ver-otp")
        console.log(data);
        const done = await otpSubmitHandler(data)
        console.log(done)
        if (done.status == 'false') {
            Alert.alert("OTP timed out")
        }
        else if (done.status == 'pending') {
            var startTime = new Date().getTime();
            var interval = setInterval(function () {
                if (new Date().getTime() - startTime > 180000) {
                    clearInterval(interval);
                    Alert.alert("No nearby Devices, timeout")
                    return;
                }
                if (MMKV.getString("appData") === '-1') {
                    clearInterval(interval);
                    Alert.alert("OTP timed out")
                    return;
                }
            }, 200);
        } else {
            history.push('/home')
        }
    };

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.text}>OTP</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={onPressHandler} style={styles.search}>
                    <Text style={{ color: '#fff', marginRight: 10, fontSize: 17 }}>
                        LOGIN
                        </Text>
                    <Icon name="arrow-circle-right" size={25} color="#fff" />
                </TouchableOpacity>
                <View
                    style={[
                        styles.centerContainer,
                        {
                            width: dimensions.window.width * 0.9,
                            height: dimensions.window.height * 0.3,
                        },
                    ]}>
                    <TextInput
                        value={OTPdata}
                        onChangeText={(OTPdata) => onChangeOTP(OTPdata)}
                        placeholder="Enter Cowin OTP"
                        placeholderTextColor="#fff"
                        style={styles.input}
                        keyboardType="number-pad"
                    />
                    <TouchableOpacity onPress={onPressHandler2} style={styles.search}>
                        <Text style={{ color: '#fff', marginRight: 10, fontSize: 17 }}>
                            SUBMIT OTP
                        </Text>
                        <Icon name="arrow-circle-right" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>

            </View>
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
    centerContainer: {
        // marginHorizontal: 15,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#2D2D39',
    },
    text: {
        // textAlign: 'center',
        // marginBottom: 30,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        marginVertical: 10,
        flex: 1,
        backgroundColor: '#1C1C1E',
        fontSize: 16,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 12,
        color: '#fff',
    },
    search: {
        padding: 15,
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 25,
        // padding: 15,
        backgroundColor: '#5F5DDF',
        marginLeft: 10,
        borderRadius: 15,
    },
});

export default OTP;
