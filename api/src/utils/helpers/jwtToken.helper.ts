import jwt  from "jsonwebtoken";

import { Validator } from '../../utils/helpers/validator.helper';  
const Validators = new Validator()
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
 