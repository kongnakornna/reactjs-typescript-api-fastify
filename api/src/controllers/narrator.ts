import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import * as path from 'path'
import * as knex from 'knex'
import * as crypto from 'crypto'
import { UserModel } from '../models/user_model'
import { FileModel } from '../models/file'
import { SdusersNarratorModel } from '../models/sd_users_narrator_model'
import { SdusersSeminarModel } from '../models/sd_users_seminar_model'
import { SeminarDetailModel } from '../models/seminar_detail_model'
import { SeminarTitleModel } from '../models/seminar_title_model'
import { SeminarModels } from '../models/seminar_model'
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
export default async function narrator(fastify: FastifyInstance) {
        const userModel = new UserModel(); 
        const File_Model = new FileModel(); 
        const usersNarratorModel = new SdusersNarratorModel(); 
        const SeminarModel = new SdusersSeminarModel(); 
        const DetailModel = new SeminarDetailModel(); 
        const TitleModel = new SeminarTitleModel(); 
        const Seminar_Model = new SeminarModels(); 
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
                const phonenumber: string = body.phonenumber;
                const emails: string = body.email; 
                const today = new Date() 
                const create =  Functions.timeConvertermas(today)
                const status_user: string = body.status || 0;
                const date: string = body.date;
                const active: string = body.active|| 0;
                const activedate: string = body.activedate || null;
                const password: string = body.password;
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
                const validation_email: any = await usersNarratorModel.validation_email(db, emails);
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
                const passwd:any = Functions.passwordValidator(password);
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
                var encPassword = crypto.createHash('md5').update(password).digest('hex'); 
                try { 
                        const input: any = {}  
                        input.firstname = firstname;
                        input.lastname = lastname;
                        input.fullname = fullname;
                        input.phonenumber = phonenumber; 
                        input.email = emails;
                        input.create = create;
                        input.active= active;
                        input.activedate= body.activedate; 
                        input.password = encPassword;
                        input.password_temp = password;  
                        const rs: any = await usersNarratorModel.create_data(db, input);
                        let idxs: any = await usersNarratorModel.last_id(db);
                        const luser: any = idxs[0]
                        console.log("luser", luser); 
                        let idx: Number = luser.narrator_id;
                        console.log("idx", idx);     
                        const createsignin:any = []
                        createsignin.narrator_id = idx;
                        createsignin.email = email;
                        createsignin.firstname = firstname; 
                        createsignin.lastname = lastname; 
                        createsignin.create = create;  
                        const token = fastify.jwt.sign({ createsignin }, { expiresIn: '1d' });  //use for active status user
                        reply.code(201).send({
                                                response: { 
                                                    message: "Register successful",
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
                                                message: "Register Unsuccessful!", 
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
                                                message: "Sign up Unsuccessful ,Error System something!", 
                                                status: 1, 
                                                token: null,
                                                StatusCode: '403',
                                            }
                                    }) 
                        return  // exit process   
                }
        }) 
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
                    const rs: any = await usersNarratorModel.login(db, username, encPassword);
                    console.log('username=>' + username);
                    console.log('password=>' + password);
                    console.log('encPassword=>' + encPassword);
                    console.log('rs=>' + rs);
                    if (rs.length > 0) {
                        const user: any = rs[0]; 
                        console.log(`user=>`, user);  
                        const rss:any = []
                        rss.narrator_id = user.narrator_id;
                        rss.email = user.email;
                        rss.firstname = user.firstname;
                        rss.lastname = user.lastname; 
                        console.warn(`rss=>`, rss);   
                        let date: any =  Date.now()
                        var nowseconds = new Date().getTime() 
                        /*
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
                                    email: user.email, 
                                    firstname: user.firstname,
                                    lastname: user.lastname
                        },{
                            expiresIn: '1d'	// expires in 365 days
                        })
                        reply.code(200).send({
                                            response: {
                                                message: "Create token Successful!",
                                                status: 1, 
                                                ok: true,                                       
                                                statusCode: '200',
                                                data: {
                                                        user_id: user.user_id,
                                                        email: user.email,
                                                        rstname: user.firstname,
                                                        lastname: user.lastname, 
                                                    },
                                                token,
                                            }
                        })   
                        return  // exit process  
                    } else { 
                        reply.code(401).send({
                                            response: { 
                                                message: "Login failed!", 
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
            let start_date_en: any = Functions.toEnDate(start_date);
            let end_date_en: any =  Functions.toEnDate(end_date);
            let start_date_thai: any =  Functions.toThaiDate(start_date);
            let end_date_thai: any = Functions.toThaiDate(end_date);  
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
            //var firstname: any = data['createsignin']['firstname'];
            var narrator_id: number = data['createsignin']['narrator_id'];
            var email: number = data['createsignin']['email'];
            const today = new Date()
            const dateTime = Functions.timeConvertermas(today); 
            const inputupdate = {
                                status: 1, 
                                active: 1, 
                                activedate:dateTime,
                            }  
            console.log("inputupdate", inputupdate); 
            await usersNarratorModel.activate(db, narrator_id, inputupdate);
            try {
                        reply.code(200).send({
                            response: {
                                message: "Activate successful!",
                                status: 1,
                                StatusCode: '200', 
                                email:email,
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
} 