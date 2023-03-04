import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import * as path from 'path'
import * as knex from 'knex'
import * as crypto from 'crypto'
import { UserModel } from '../models/user_model'
import bodyemailSchema from '../schemas/bodyemail'
import bodysinginSchema from '../schemas/bodysingin'
import registerSchema from '../schemas/registerSchema' // {schema: registerSchema}, 
import bodysingupSchema from '../schemas/bodysingup'
import ActivateSchema from '../schemas/bodyActivate' 
import queryActivateSchema from '../schemas/queryActivate' 
import { _publicfunctions } from '../utils/helpers/functions.helper';  
import { _Validator } from '../utils/helpers/validator.helper';  
const Validator = new _Validator() 
const Functions = new _publicfunctions() 
/***********************/
var md5 = require('md5');
export default async function user(fastify: FastifyInstance) {
const userModel = new UserModel()
const db: knex = fastify.db
const multer = require('fastify-multer')
const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath })
const packageJSON:any = require('../../package.json')
const port:any = packageJSON.port;
const env:any = process.env 
// console.warn(`packageJSON=>`,  packageJSON);  
// console.warn(`port=>`,  port);  
const APIKEY:any = env.API_KEY
// console.warn(`APIKEY=>`, APIKEY);  
// console.warn(`env=>`, env);  
/***********************/
  type ErrorWithMessage = { message: string }
  function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    )
  }
  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
        if (isErrorWithMessage(maybeError)) return maybeError
        try {
          return new Error(JSON.stringify(maybeError))
        } catch {
          // fallback in case there's an error stringifying the maybeError
          // like with circular references for example.
          return new Error(String(maybeError))
        }
  }
  function getErrorMessage(error: unknown) {
        return toErrorWithMessage(error).message
  }
  fastify.post('/singin',async (request: FastifyRequest, reply: FastifyReply) => {
      const reportError = ({message}: {message: string}) => {}
      reply.header("Access-Control-Allow-Origin", "*");  
      reply.header('Access-Control-Allow-Methods', 'POST'); 
      if (request.validationError) {
          console.log(request.validationError)
          reply.code(400).send({ ok: false, error: 'Error Invalid data',error_th: 'ข้อมูลไม่ถูกต้อง', code: 1005 })
          // return  // exit process 
          throw request.validationError
          //throw new Error('Error Invalid data');
      } else {
        const body: any = request.body;
        const username: string = body.username;
        const password: string = body.password;
        try {        
            var encPassword = crypto.createHash('md5').update(password).digest('hex'); 
            const rs: any = await userModel.login(db, username, encPassword);
            console.log('username=>' + username);
            console.log('password=>' + password);
            console.log('encPassword=>' + encPassword);
            console.log('rs=>' + rs);
            if (rs.length > 0) {
                const user: any = rs[0]; 
                console.log(`user=>`, user);  
                const rss:any = []
                rss.user_id = user.user_id;
                rss.username = user.username;
                rss.firstname = user.firstname;
                rss.lastname = user.lastname; 
                console.warn(`rss=>`, rss);   
                let date: any =  Date.now()
                var nowseconds = new Date().getTime() 
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
                const token = fastify.jwt.sign({
                            user_id: user.user_id,
                            username: user.username, 
                          // firstname: user.firstname,
                          // lastname: user.lastname
                },{
                    expiresIn: '1d'	// expires in 365 days
                })
                reply.code(201).send({
                                    response: {
                                        message: "Create token Successful!",
                                        status: 1, 
                                        ok: true,                                       
                                        statusCode: '201',
                                        data: {
                                                  user_id: user.user_id,
                                                  username: user.username,
                                                  rstname: user.firstname,
                                                  lastname: user.lastname,
                                                  eemail: user.eemail
                                              },
                                        token,
                                    }
                })   
                return  // exit process  
            } else { 
                reply.code(401).send({
                                    response: { 
                                        message: "Login failed! Unauthorized", 
                                        status: 1,
                                        ok: false,
                                        statusCode: '401',
                                        data: null,
                                        token: null, 
                                    }
                              })  
              throw new Error('Login failed!'); // เงื่อนไขข้อผิพลาด
              return  // exit process  
            } 
        }catch (error: any) { 
            console.log('error toUpperCase=>',error.toUpperCase());  
            console.log('message=>',error.message) 
            reportError({ message: error.message })
            console.log('reportError=>',reportError) 
            reply.code(500).send({
                                  response: { 
                                      message: getErrorMessage, 
                                      status: 1,
                                      ok: false,
                                      statusCode: '500',
                                      result: null,
                                      token: null, 
                                      data: null,
                                  }
                                }) 
            throw new Error('Error 500'); // โยนสิ่งผิดปรกติไปอีกทอดถ้าต้องการ              
            return  // exit process     
        }finally {
              reply.code(500).send({
                                  response: { 
                                      message: "error",
                                      status: 1,
                                      ok: false,
                                      statusCode: '500',
                                      result: null,
                                      token: null,
                                      data: null,
                                  }
                                })                   
            return  // exit process     
        }
        throw request.body
      }
  })
  fastify.post('/singup',{schema: registerSchema},  async (request: FastifyRequest, reply: FastifyReply) => {
        const reportError = ({message}: {message: string}) => {}
        reply.header("Access-Control-Allow-Origin", "*");  
        reply.header('Access-Control-Allow-Methods', 'POST'); 
        const headers: any = request.headers || null;
        const body: any = request.body;
        const getchar: string = Functions.getRandomchar(16);
        const firstname: string = body.firstname;
        const lastname: string = body.lastname;
        const fullname: string = body.fullname;
        const nickname: string = body.nickname;
        const idcard: string = body.idcard;
        const date: string = body.date;
        const username: string = body.username;
        const password: string = body.password;
        const emails: string = body.email; 
        const today = new Date()
        const dateTime = Functions.timeConvertermas(today); 
        const issued_at=Date.now()
        const timestamp = Date.now()
        /********************************/
        const email: any = Functions.isemailValid(emails);
        if (email === false) {
            reply.code(401).send({
                                    response: { 
                                        message: "Email format checker failed, Please change email!", 
                                        status: 0,  
                                        StatusCode: '401',
                                    }
                                }) 
            return  // exit process  
        } 
        const validation_email: any = await userModel.validation_email(db, emails);
        if (validation_email.length > 0) {
                        reply.code(401).send({
                                                response: { 
                                                message: "Email Duplicate , Please change email", 
                                                status: 0,  
                                                StatusCode: '200',
                                                }
                                            }) 
                        return  // exit process  
        }
        console.log("email", emails);
        const validation_username: any = await userModel.validation_username(db, username);
        if (validation_username.length > 0) {
                    reply.code(401).send({
                                            response: { 
                                            message: "Username Duplicate , Please change Username", 
                                            status: 0,  
                                            StatusCode: '200',
                                            }
                                        }) 
                    return  // exit process  
        }
      const passwd:any =  Functions.passwordValidator(password);
      if (passwd === false) {
          reply.code(401).send({
                                  response: { 
                                      message: "Password checker failed!", 
                                      status: 0,  
                                      StatusCode: '401',
                                  }
                            }) 
          return  // exit process  
      }  
      const level: string = body.level || 0;
      const status: number = body.status || 0;
      const network_id: number = body.network_id || 0;
      const avatar: string = body.avatar;
      const remark: string = body.remark;
      const infomation_agree_status: string = body.infomation_agree_status || 0;
      const gender: string = body.gender;
      const birthday: string = body.birthday;
      const last_sign_in: string = body.last_sign_in;
      const online_status: number = body.online_status || 0;
      const mesage: string = body.mesage;
      const password_temp: string = body.password;
      const profile_id: number = body.profile_id || 0;
      const network_type_id: number = body.network_type_id || 0;
      const publics: number = body.public || 0;
      const isActive: number = body.isActive || 0;
      const permission_type_id: number = body.isActive || 3;
      var encPassword = crypto.createHash('md5').update(password).digest('hex'); 
      /*
      console.log("headers", headers);  
      console.log("apikey", apikey);
      console.log("query", query);  
      console.log("body", body);
      console.log("params", params); 
      console.log("getchar", getchar); 
      */
      try { 
            const input: any = {}  
            input.firstname = firstname;
            input.lastname = lastname;
            input.fullname = fullname;
            input.nickname = nickname;
            input.idcard = idcard;
            input.date = dateTime;
            input.username = username;
            input.password = encPassword;
            input.email = emails;
            input.level = level;
            input.status= status;
            input.network_id= body.network_id;
            input.avatar = avatar;
            input.remark = remark;
            input.infomation_agree_status = infomation_agree_status;
            input.gender = gender;
            input.birthday = birthday;
            input.last_sign_in = last_sign_in;
            input.online_status= online_status;
            input.mesage = mesage;
            input.password_temp = password;
            input.profile_id = profile_id;
            /*
                input.network_type_id=network_type_id;
                input.public=public;
                input.isActive =  isActive;
                input.permission_type_id =permission_type_id; 
            */
            input.last_sign_in = dateTime;
            const rs: any = await userModel.create(db, input);
            const is: any = []  
            let idxs: any = await userModel.lastidread(db);
            const luser: any = idxs[0]
            console.log("luser", luser); 
            let idx: Number = luser.user_id;
            console.log("idx", idx);            
            const profile_id_idx =md5(idx);
            const inputupdate = {
                    profile_id: profile_id_idx,
                    network_type_id:network_type_id,
                    public:publics,
                    isActive:isActive,
                    status:status,
                    permission_type_id:permission_type_id, 
                    }   
            console.log("idx", idx); 
            console.log("inputupdate", inputupdate); 
            await userModel.updateuid(db, idx, inputupdate);
            const createsignin: any = {}  
            createsignin.user_id = idx;
            createsignin.username = username;
            createsignin.firstname = firstname || username; 
            createsignin.status = status; 
            createsignin.profile_id = profile_id_idx; 
            createsignin.date = dateTime;
            const token = fastify.jwt.sign({ createsignin }, { expiresIn: '365d' });  //use for active status user
            reply.code(201).send({
                                      response: { 
                                          message: "Sign up  successful",
                                          status: 1,  
                                          token,
                                          StatusCode: '201',
                                      }
                        }) 
            return  // exit process    
      } catch (error: any) { 
            reply.code(401).send({
                                response: {
                                    result: "Error",
                                    message: "Sign up Unsuccessful!", 
                                    status: 1, 
                                    token: null,
                                    StatusCode: '401',
                                }
                          }) 
            return  // exit process    
      }finally {
        // ข้อความสั่งที่ต้องให้ทาไม่ว่าจะเกิดสิ่งผิดปกติชนิดใดขึ้นหรือไม่ก็ตาม
        reply.code(403).send({
                                response: {
                                    result: "Error",
                                    message: "Sign up Unsuccessful ,Error System something!", 
                                    status: 1, 
                                    token: null,
                                    StatusCode: '403',
                                }
                          }) 
            return  // exit process   
      }
  }) 
  fastify.post('/createtoken', async (request: FastifyRequest, reply: FastifyReply) => {
    const reportError = ({message}: {message: string}) => {}
    reply.header("Access-Control-Allow-Origin", "*");  
    reply.header('Access-Control-Allow-Methods', 'POST'); 
    const headers: any = request.headers || null;
    const query: any = request.query || null;
    const body: any = request.body;
    const params: any = request.params || null;  
    const apikey : any = request.headers.apikey || null;
    const getchar: string =  Functions.getRandomchar(16);
    /*
    console.log("headers", headers);  
    console.log("apikey", apikey);
    console.log("query", query);  
    console.log("body", body);
    console.log("params", params); 
    console.log("getchar", getchar); 
    */
    if (headers.apikey == null) { 
                reply.code(401).send({
                                    response: {
                                        result: "api key is null",
                                        message: "Error api key is null",
                                        status: 1, 
                                        token: null,
                                        StatusCode: '401',
                                    }
                      }) 
    } else if (headers.apikey === APIKEY) { 
                const token = fastify.jwt.sign({getchar},{ expiresIn: '365d'})
                reply.code(201).send({
                                    response: { 
                                        message: "create token successful",
                                        status: 1,  
                                        token,
                                        StatusCode: '201',
                                    }
                      }) 
    }else{ 
          reply.code(401).send({
                              response: {
                                  result: "Error",
                                  message: "api key wrong, please check!", 
                                  status: 1, 
                                  token: null,
                                  StatusCode: '401',
                              }
                        }) 
          return  // exit process    
    } 
  })
  fastify.post('/createtokens', async (request: FastifyRequest, reply: FastifyReply) => {
    const reportError = ({message}: {message: string}) => {}
    reply.header("Access-Control-Allow-Origin", "*");  
    reply.header('Access-Control-Allow-Methods', 'POST'); 
    const headers: any = request.headers || null;
    const query: any = request.query || null;
    const body: any = request.body;
    const params: any = request.params || null;  
    const apikey : any = request.headers.apikey || null;
    const getchar: string =  Functions.getRandomchar(16);
    /*
    console.log("headers", headers);  
    console.log("apikey", apikey);
    console.log("query", query);  
    console.log("body", body);
    console.log("params", params); 
    console.log("getchar", getchar); 
    */
    if (headers.apikey == null) { 
                reply.code(401).send({
                                    response: {
                                        result: "api key is null",
                                        message: "Error api key is null",
                                        status: 1, 
                                        token: null,
                                        StatusCode: '401',
                                    }
                      }) 
    } else if (headers.apikey === APIKEY) { 
                const token = fastify.jwt.sign({getchar})
                reply.code(200).send({
                                    response: { 
                                        message: "create token successful",
                                        status: 1,  
                                        token,
                                        StatusCode: '200',
                                    }
                      }) 
    }else{ 
          reply.code(401).send({
                              response: {
                                  result: "Error",
                                  message: "api key wrong, please check!", 
                                  status: 1, 
                                  token: null,
                                  StatusCode: '401',
                              }
                        }) 
          return  // exit process    
    } 
  })
  fastify.post('/verifytoken', {preValidation: [fastify.authenticate]/*สรวจสอบ Tokem*/}, async (request: FastifyRequest, reply: FastifyReply) => {
    const headers: any = request.headers;           
    const body: any = request.body;   
    const host: any = headers.host;  
    const secret_key: any = headers.secret_key;
    const str: any = request.headers.authorization; // token in Bearer  header
    const token: any = str.replace("Bearer ", "");  
    const token_bearer: any = fastify.jwt.verify(token); 
    //console.warn(`token_bearer `, token_bearer);
    const start_token: any = token_bearer.iat;
    const end_token: any = token_bearer.exp;
    //console.warn(`start_token `, start_token);
    //console.warn(`end_token `, end_token); 
    let date: any = Date.now();
    var nowseconds = new Date().getTime();
    var now: any = nowseconds;
    var numberValuenow: any = Math.round(now / 1000); 
    //console.warn(`numberValuenow `, numberValuenow); 
    let expire_in_time1: number = (end_token - start_token); 
    let expire_in_time:number = (numberValuenow - end_token); 
    //console.warn(`expire_in_time `, expire_in_time);
    var start_date = new Date(start_token * 1000); 
    //console.warn(`start_date `, start_date);
    let end_date: any = new Date(end_token * 1000);
    //console.warn(`end_date `, end_date);
    let start_date_en: any =  Functions.toEnDate(start_date);
    let end_date_en: any =   Functions.toEnDate(end_date);
    let start_date_thai: any =   Functions.toThaiDate(start_date);
    let end_date_thai: any =  Functions.toThaiDate(end_date);  
    console.warn(`start_date_en `, start_date_en);
    console.warn(`end_date_en `, end_date_en);
    console.warn(`start_date_thai `, start_date_thai);
    console.warn(`end_date_thai `, end_date_thai);
    reply.code(200).send({
        response: {
          message: "Authenticate verify token successful!", 
          status: 1,
          data: token_bearer, 
          //start_date:start_date,
          //end_date: end_date,
          start_date_en:start_date_en,
          end_date_en:end_date_en,
          start_date_thai:start_date_thai,
          end_date_thai:end_date_thai,
          StatusCode: '200',
        }
    })
    return  // exit process     
  }) 
  fastify.get('/private', {preValidation: [fastify.authenticate]}, async (request: FastifyRequest, reply: FastifyReply) => {
    const headers: any = request.headers         
    const query: any = request.query       
    const params: any = request.params        
    /******************************/
    const str: any = headers.authorization  
    const host: any = headers.host   
    const secret_key: any = headers.secret_key   
    /******************************/
      reply.header("Access-Control-Allow-Origin", "*");  
      reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
      reply.header('statusCode', 200);
      reply.header('status', true);  
      reply.code(200).send({
                          response: {
                              result: "Authenticate Verify token successful !",
                              message: "Protected area!!", 
                              status: 1, 
                              data: null, 
                              StatusCode: '200',
                          }
                    })   
      return  // exit process      
  }) 
  fastify.post('/private', {preValidation: [fastify.authenticate]}, async (request: FastifyRequest, reply: FastifyReply) => {
    const headers: any = request.headers           
    const body: any = request.body    
    /******************************/
    const str: any = headers.authorization  
    const host: any = headers.host   
    const secret_key: any = headers.secret_key   
    /******************************/
      reply.header("Access-Control-Allow-Origin", "*");  
      reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
      reply.header('statusCode', 200);
      reply.header('status', true);  
      reply.code(200).send({
                          response: {
                              result: "Authenticate Verify token successful!",
                              message: "Protected area!", 
                              status: 1, 
                              data: null, 
                              StatusCode: '200',
                          }
                    }) 
      return  // exit process        
  })  
  fastify.post('/activate',{schema: ActivateSchema}, async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header("Access-Control-Allow-Origin", "*");  
    reply.header('Access-Control-Allow-Methods', 'POST'); 
    const headers: any = request.headers;           
    const body: any = request.body;   
    const code: string = body.code; 
    if (code === null) {
        reply.code(401).send({
                                    response: { 
                                        message: "Please input code to activate account!", 
                                        status: 0,  
                                        StatusCode: '401',
                                    }
                                }) 
            return  // exit process  
    }   
    const tokendecode: any = fastify.jwt.verify(code); 
    //console.warn(`token_bearer `, token_bearer);
    const start_token: any = tokendecode.iat;
    const end_token: any = tokendecode.exp;
    const data_token: any = tokendecode.data;
    
    //console.warn(`start_token `, start_token);
    //console.warn(`end_token `, end_token); 
    let date: any = Date.now();
    var nowseconds = new Date().getTime();
    var now: any = nowseconds;
    var numberValuenow: any = Math.round(now / 1000); 
    //console.warn(`numberValuenow `, numberValuenow); 
    let expire_in_time1: number = (end_token - start_token); 
    let expire_in_time:number = (numberValuenow - end_token); 
    //console.warn(`expire_in_time `, expire_in_time);
    var start_date = new Date(start_token * 1000); 
    //console.warn(`start_date `, start_date);
    let end_date: any = new Date(end_token * 1000);
    //console.warn(`end_date `, end_date);
    let start_date_en: any = Functions.toEnDate(start_date);
    let end_date_en: any =  Functions.toEnDate(end_date);
    let start_date_thai: any =  Functions.toThaiDate(start_date);
    let end_date_thai: any = Functions.toThaiDate(end_date);  
    console.warn(`start_date_en=>`, start_date_en);
    console.warn(`end_date_en=>`, end_date_en);
    console.warn(`start_date_thai=>`, start_date_thai);
    console.warn(`end_date_thai=>`, end_date_thai);
    console.warn(`tokendecode=>`, tokendecode);
    console.warn(`count=> `, tokendecode.lengt); 
    var data: any = tokendecode;
    var profile_id: any = data['createsignin']['profile_id'];
    var user_id: number = data['createsignin']['user_id'];
    var username: number = data['createsignin']['username'];
    const today = new Date() 
    const dateTime = Functions.timeConvertermas(today)
    const inputupdate = {
                        status: 1, 
                        isActive: 1, 
                        last_sign_in:dateTime,
                    }  
    console.log("inputupdate", inputupdate); 
    await userModel.updateuid(db, user_id, inputupdate);
    try {
                reply.code(200).send({
                    response: {
                        message: "Activate successful!",
                        status: 1,
                        StatusCode: '200',
                        //user_id:user_id,
                        profile_id: profile_id,
                        username:username,
                        // date_en: start_date_en,
                        // date_thai: start_date_thai, 
                        data: data,  
                    }
                })
            return  // exit process   
    } catch (error: any) { 
                    reply.code(401).send({
                                        response: {
                                            result: "Error",
                                            message: "Activate error!", 
                                            status: 1, 
                                            token: null,
                                            StatusCode: '401',
                                        }
                                }) 
                    return  // exit process    
    }finally { 
                reply.code(403).send({
                                        response: {
                                            result: "Error",
                                            message: "Activate ,Error System something!", 
                                            status: 1, 
                                            token: null,
                                            StatusCode: '403',
                                        }
                                }) 
                    return  // exit process   
    }
  }) 
  fastify.post('/resetpassword',{schema: bodyemailSchema}, async (request: FastifyRequest, reply: FastifyReply) => {
        const reportError = ({message}: {message: string}) => {}
        reply.header("Access-Control-Allow-Origin", "*");  
        reply.header('Access-Control-Allow-Methods', 'POST'); 
        const body: any = request.body;
        const email: string = body.email; 
        try {         
            const rs: any = await userModel.reset_password(db, email);
            console.log('email=>' + email); 
            console.log('rs=>' + rs);
            if (rs.length > 0) {
                const user: any = rs[0]; 
                console.log(`user=>`, user);  
                const rss: any = []
                rss.user_id = user.user_id;
                rss.profile_id = user.profile_id;
                rss.username = user.username;
                rss.firstname = user.firstname;
                rss.lastname = user.lastname; 
                rss.email = user.email; 
                rss.level = user.level; 
                console.warn(`rss=>`, rss);   
                let date: any =  Date.now()
                var nowseconds = new Date().getTime() 
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
                const token = fastify.jwt.sign({user},{ expiresIn:'1d'})
                reply.code(200).send({
                                    response: {
                                        message: "Reset Password Successful!",
                                        status: 1, 
                                        ok: true,                                       
                                        statusCode: '200',
                                        data: user,
                                        token,
                                    }
                })   
                return  // exit process  
            } else { 
                reply.code(401).send({
                                    response: { 
                                        message: "Reset Password failed!", 
                                        status: 1,
                                        ok: false,
                                        statusCode: '401',
                                        data: null,
                                        token: null, 
                                    }
                              })   
              return  // exit process  
            } 
        }catch (error: any) { 
            console.log('error toUpperCase=>',error.toUpperCase());  
            console.log('message=>',error.message) 
            reportError({ message: error.message })
            console.log('reportError=>',reportError) 
            reply.code(500).send({
                                  response: { 
                                      message: getErrorMessage, 
                                      status: 1,
                                      ok: false,
                                      statusCode: '500',
                                      result: null,
                                      token: null, 
                                      data: null,
                                  }
                                })            
            return  // exit process     
        }finally{
              reply.code(500).send({
                                  response: { 
                                      message: "error",
                                      status: 1,
                                      ok: false,
                                      statusCode: '500',
                                      result: null,
                                      token: null,
                                      data: null,
                                  }
                                })                   
            return  // exit process     
        }  
  })
  fastify.post('/verifyresetpassword', {preValidation: [fastify.authenticate]}, async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header("Access-Control-Allow-Origin", "*");  
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    const headers: any = request.headers;           
    const body: any = request.body;   
    const host: any = headers.host;  
    const secret_key: any = headers.secret_key;
    const str: any = request.headers.authorization; // token in Bearer  header
    const token: any = str.replace("Bearer ", "");  
    const token_bearer: any = fastify.jwt.verify(token); 
    //console.warn(`token_bearer `, token_bearer);
    const start_token: any = token_bearer.iat;
    const end_token: any = token_bearer.exp;
    //console.warn(`start_token `, start_token);
    //console.warn(`end_token `, end_token); 
    let date: any = Date.now();
    var nowseconds = new Date().getTime();
    var now: any = nowseconds;
    var numberValuenow: any = Math.round(now / 1000); 
    //console.warn(`numberValuenow `, numberValuenow); 
    let expire_in_time1: number = (end_token - start_token); 
    let expire_in_time:number = (numberValuenow - end_token); 
    //console.warn(`expire_in_time `, expire_in_time);
    var start_date = new Date(start_token * 1000); 
    //console.warn(`start_date `, start_date);
    let end_date: any = new Date(end_token * 1000);
    //console.warn(`end_date `, end_date);
    let start_date_en: any = Functions.toEnDate(start_date);
    let end_date_en: any =  Functions.toEnDate(end_date);
    let start_date_thai: any =  Functions.toThaiDate(start_date);
    let end_date_thai: any = Functions.toThaiDate(end_date);  
    //console.warn(`start_date_en `, start_date_en);
    //console.warn(`end_date_en `, end_date_en);
    //console.warn(`start_date_thai `, start_date_thai);
    //console.warn(`end_date_thai `, end_date_thai);
    let users: any = token_bearer.user;  
    reply.code(200).send({
        response: {
          message: "Authenticate verify email token successful!", 
          status: 1,
          //data: users, 
          user_id: users.user_id, 
          profile_id: users.profile_id, 
          firstname: users.firstname, 
          lastname: users.lastname, 
          email: users.email, 
          username: users.username, 
          //start_date:start_date,
          //end_date: end_date,
          start_date_en:start_date_en,
          end_date_en:end_date_en,
         // start_date_thai:start_date_thai,
         // end_date_thai:end_date_thai,
          StatusCode: '200',
        }
    })
    return  // exit process     
  })   
} 