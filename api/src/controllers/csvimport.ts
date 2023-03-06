import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import * as path from 'path'
import * as knex from 'knex'
import * as crypto from 'crypto'
const fs = require('fs');
const envPath = path.join(__dirname, '../../../.env')
require('dotenv').config({ path: envPath }) 
const file_csv = path.join(__dirname, '../../../public/sd_users_seminar.csv')
const filecsv = process.env.file_csv 

import { UserModel } from '../models/user_model'
import { FileModel } from '../models/file'
import { SdusersNarratorModel } from '../models/sd_users_narrator_model'
import { SdusersSeminarModel } from '../models/sd_users_seminar_model'
import { SeminarDetailModel } from '../models/seminar_detail_model'
import { SeminarTitleModel } from '../models/seminar_title_model'
import { SeminarModels } from '../models/seminar_model'
import { SeminarPeriodModel } from '../models/seminar_period_model'
// Validator data by schemas
import bodyemailSchema from '../schemas/bodyemail'
import bodysinginSchema from '../schemas/bodysingin'
import registerSchema from '../schemas/registerSchema'  
import bodyseminarregister from '../schemas/bodyseminarregister'  
import bodysingupSchema from '../schemas/bodysingup'
import ActivateSchema from '../schemas/bodyActivate' 
import queryActivateSchema from '../schemas/queryActivate' 
import bodycreatetitle from '../schemas/bodycreatetitle' 
import bodytitleupdate from '../schemas/bodytitleupdate'
import query_string_titledelete from '../schemas/query_string_titledelete'
import bodyseminar_detail from '../schemas/bodyseminar_detail'
import singinseminaruserSchema from '../schemas/bodysinginseminaruser'
var md5 = require('md5');
import { _publicfunctions } from '../utils/helpers/functions.helper';  
import { _Validator } from '../utils/helpers/validator.helper';  
const Validator = new _Validator() 
const Functions = new _publicfunctions() 
import {encode, decode} from 'string-encode-decode'
/***********************/
export default async function csvimport(fastify: FastifyInstance) {
    const userModel = new UserModel(); 
    const File_Model = new FileModel(); 
    const usersNarratorModel = new SdusersNarratorModel(); 
    const SeminarUserModel = new SdusersSeminarModel(); 
    const SeminarModel = new SdusersSeminarModel(); 
    const DetailModel = new SeminarDetailModel(); 
    const TitleModel = new SeminarTitleModel(); 
    const Seminar_Model = new SeminarModels(); 
    const Seminar_Period_Model = new SeminarPeriodModel(); 
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
    
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            const getchar: string = Functions.getRandomint(5);
            let en = encode(getchar);
            let de = decode(en);
            reply.code(200).send({
                                    response: {
                                        message: 'Route GET:Welcome To Application Microservice!', 
                                        status: 1, 
                                        //gen:getchar,
                                        en:en,
                                        data:de,
                                        error:"OK",
                                        StatusCode: '200',
                                    }
                            })
            return  // exit process        
    })
    fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            const getchar: string = Functions.getRandomint(5);
            let en = encode(getchar);
            let de = decode(en);
            reply.code(200).send({
                                        response: {
                                            message: 'Route POST:Welcome To Application Microservice!', 
                                            status: 1, 
                                            //gen:getchar,
                                            en:en,
                                            data:de,
                                            error:"OK",
                                            StatusCode: '200',
                                        }
                                }) 
            return  // exit process                      
    })
    fastify.post('/singup',{schema: registerSchema},  async (request: FastifyRequest, reply: FastifyReply) => {
                const reportError = ({message}: {message: string}) => {}
                reply.header("Access-Control-Allow-Origin", "*");  
                reply.header('Access-Control-Allow-Methods', 'POST'); 
                const headers: any = request.headers || null;
                const body: any = request.body;
                const getchar: string =  Functions.getRandomchar(16);
                const firstname: string = body.firstname;
                const lastname: string = body.lastname;
                const fullname: string = body.fullname;
                const phonenumber: string = body.phonenumber;
                const emails: string = body.email; 
                const today = new Date() 
                const create = Functions.timeConvertermas(today);
                const status_user: string = body.status || 0;
                const date: string = body.date;
                const active: string = body.active|| 0;
                const activedate: string = body.activedate || null;
                const password: string = body.password;
                const issued_at=Date.now()
                const timestamp = Date.now()
                /********************************/
                const email: any =  Functions.isemailValid(emails);
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
                const validation_email: any = await SeminarModel.validation_email(db, emails);
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
                        const rs: any = await SeminarModel.create_data(db, input);
                        let idxs: any = await SeminarModel.last_seminar_id(db);
                        const luser: any = idxs[0]
                        console.log("luser", luser); 
                        let idx: Number = luser.seminar_id;
                        console.log("idx", idx);     
                        const createsignin:any = []
                        createsignin.seminar_id = idx;
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
    fastify.post('/readcsv',{schema: registerSchema},  async (request: FastifyRequest, reply: FastifyReply) => {
                const reportError = ({message}: {message: string}) => {}
                reply.header("Access-Control-Allow-Origin", "*");  
                reply.header('Access-Control-Allow-Methods', 'POST'); 
                const headers: any = request.headers || null;
                const body: any = request.body;
                const getchar: string =  Functions.getRandomchar(16);  
                try { 
                        const input: any = {} 
                        //console.warn(`post `, post);             
                        var filedata: any = file_csv;  
                        console.warn(`filedata `, filedata);       
                        let rawdata = fs.readFileSync(path.resolve(__dirname,filedata));
                        console.log(`rawdata `, rawdata);  
                        let filelog = JSON.parse(rawdata);
                        reply.code(201).send({
                                                response: { 
                                                    message: "Register successful",
                                                    status: 1,  
                                                    rawdata:rawdata,
                                                    filelog:filelog, 
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
}  