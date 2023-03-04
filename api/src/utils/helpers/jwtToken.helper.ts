import jwt  from "jsonwebtoken";

import { _Validator } from '../../utils/helpers/validator.helper';  
const Validators = new _Validator()
import { encode, decode } from 'string-encode-decode'
import { error } from 'console'

export const generateToken = (userId: any) => {
    return jwt.sign(userId, `${process.env.TOKEN_SECRET}`, { expiresIn: '1d' }) // 30D
};

export const generateapikey = (apikey: any) => {
    return jwt.sign(apikey, `${process.env.TOKEN_SECRET}`, { expiresIn: '1d' })
};

export const generauser = (userdata: any) => {
    return jwt.sign(userdata, `${process.env.TOKEN_SECRET}`, { expiresIn: '1d' })
};

export const verifytoken = (token: any) => {
    const decode = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    return decode; 
};

export const generstate = (int: any) => {
    var jwt = require('jsonwebtoken');
    var token = jwt.sign(int,`${process.env.TOKEN_SECRET}`, { expiresIn: '30s' }, { algorithm: 'HS256'})
    return token;
};
  /*
                  var token = jwt.sign({key_name:'key_value'}, "secret_key", {
                      expiresIn: '365d'	// expires in 365 days
                    });

                    // other accepted formats
                    expiresIn('2 days')  // 172800000
                    expiresIn('1d')      // 86400000
                    expiresIn('10h')     // 36000000
                    expiresIn('2.5 hrs') // 9000000
                    expiresIn('2h')      // 7200000
                    expiresIn('1m')      // 60000
                    expiresIn('5s')      // 5000
                    expiresIn('1y')      // 31557600000
                    expiresIn('100')     // 100
                    expiresIn('-3 days') // -259200000
                    expiresIn('-1h')     // -3600000
                    expiresIn('-200')    // -200
*/