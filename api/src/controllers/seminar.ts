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
/***********************/
export default async function seminar(fastify: FastifyInstance) {
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
    //create data sd_users_seminar
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
    fastify.post('/singin',{schema: singinseminaruserSchema},async (request: FastifyRequest, reply: FastifyReply) => {
                 
            const reportError = ({message}: {message: string}) => {}
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'POST'); 
            const body: any = request.body;
            const email: string = body.email;
            const password: string = body.password; 
            console.log('email=>',email) 
            console.log('password=>',password)  
            var encPassword = crypto.createHash('md5').update(password).digest('hex'); 
           
                const rs: any = await SeminarModel.login(db, email, encPassword);
                console.log('email=>' + email);
                console.log('password=>' + password);
                console.log('encPassword=>' + encPassword);
                console.log('rs=>' + rs);
                if (rs.length > 0) {
                    const user: any = rs[0];
                    console.log(`user=>`, user);
                    const rss: any = []
                    rss.seminar_id = user.seminar_id;
                    rss.email = user.email;
                    rss.firstname = user.firstname;
                    rss.lastname = user.lastname;
                    console.warn(`rss=>`, rss);
                    let date: any = Date.now()
                    var nowseconds = new Date().getTime() 
                    const token = fastify.jwt.sign({
                        seminar_id: rss.seminar_id,
                        email: rss.email,
                        firstname: rss.firstname,
                        lastname: rss.lastname
                    }, {
                        expiresIn: '1d'	// expires in 365 days
                    })
                    reply.code(200).send({
                        response: {
                            message: "Create token Successful!",
                            status: 1,
                            ok: true,
                            statusCode: '200',
                            data: {
                                seminar_id: rss.seminar_id,
                                email: rss.email,
                                firstname: rss.firstname,
                                lastname: rss.lastname
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
                    return  // exit process  
                }
             try {
             } catch (error: any) { 
                            reply.code(401).send({
                                                response: {
                                                    result: "Error",
                                                    message: "Error!", 
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
            let start_date_en: any =  Functions.toEnDate(start_date);
            let end_date_en: any =   Functions.toEnDate(end_date);
            let start_date_thai: any =   Functions.toThaiDate(start_date);
            let end_date_thai: any =  Functions.toThaiDate(end_date);  
            console.warn(`start_date_en=>`, start_date_en);
            console.warn(`end_date_en=>`, end_date_en);
            console.warn(`start_date_thai=>`, start_date_thai);
            console.warn(`end_date_thai=>`, end_date_thai);
            console.warn(`tokendecode=>`, tokendecode);
            console.warn(`count=> `, tokendecode.lengt); 
            var data: any = tokendecode;
            //var firstname: any = data['createsignin']['firstname'];
            var seminar_id: number = data['createsignin']['seminar_id'];
            var email: number = data['createsignin']['email'];
            const today = new Date()
            const dateTime = Functions.timeConvertermas(today); 
            const inputupdate = {
                                status: 1, 
                                active: 1, 
                                activedate:dateTime,
                            }  
            console.log("inputupdate", inputupdate); 
            await SeminarModel.activate(db, seminar_id, inputupdate);
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
    // Enrol course or  register seminar
    fastify.post('/registereminar',{preValidation: [fastify.authenticate],schema: bodyseminarregister},  async (request: FastifyRequest, reply: FastifyReply) => {
                const reportError = ({message}: {message: string}) => {}
                reply.header("Access-Control-Allow-Origin", "*");  
                reply.header('Access-Control-Allow-Methods', 'POST'); 
                const headers: any = request.headers || null;
                const body: any = request.body;
                const getchar: string =  Functions.getRandomchar(16);
                const today = new Date() 
                const datetime: string =  Functions.timeConvertermas(today);
                console.warn(`datetime=> `, datetime); 
                const seminar_title_id: string = body.seminar_title_id;
                if (seminar_title_id === null) {
                    reply.code(401).send({
                                            response: { 
                                                message: "Error seminar_title_id is null please input seminar_title_id!", 
                                                status: 0,  
                                                StatusCode: '401',
                                            }
                                        }) 
                    return  // exit process  
                }  
                const active_datatime: string = body.active_datatime|| 1;
                const status_active: string = body.status_active|| 1;
                const period_id: string = body.period_id;
                if (period_id === null) {
                    reply.code(401).send({
                                            response: { 
                                                message: "Error period_id is null please input period_id!", 
                                                status: 0,  
                                                StatusCode: '401',
                                            }
                                        }) 
                    return  // exit process  
                }  
                const issued_at=Date.now()
                const timestamp = Date.now()
                /********************************/
                const str: any = request.headers.authorization  // token in Bearer  header
                const token: any = str.replace("Bearer ", "")  
                const tokendecode: any = fastify.jwt.verify(token) 
                const jwtdata: any = {}
                jwtdata.token = tokendecode    
                const start_token: any = tokendecode.iat;
                const end_token: any = tokendecode.exp;
                const data_token: any = tokendecode.data;
                console.warn(`tokendecode=>`, tokendecode);
                console.warn(`count=> `, tokendecode.lengt); 
                var data: any = tokendecode; 
                const seminar_id: number = data['seminar_id'];
                var email: string = data['email'];
                const validation_input: any = {}                          
                validation_input.seminar_title_id = seminar_title_id; 
                validation_input.period_id = period_id;  
                validation_input.seminar_id = seminar_id;
                validation_input.email = email; 
                const validation_email: any = await Seminar_Model.check_validate(db,seminar_title_id,seminar_id,period_id);
                if (validation_email.length > 0) {
                                reply.code(401).send({
                                                        response: { 
                                                        message: "Register Duplicate , Please change seminar seminar_title_id and seminar_id and period_id", 
                                                        status: 0,  
                                                        StatusCode: '200',
                                                        }
                                                    }) 
                                return  // exit process  
                } 
                try { 
                        const datainput: any = {}                          
                        datainput.seminar_title_id = seminar_title_id;
                        datainput.datetime =  Functions.timeConvertermas(today);
                        datainput.period_id = period_id;  
                        datainput.seminar_id = seminar_id; 
                        datainput.status_active = status_active; 
                        const rs: any = await Seminar_Model.seminar_register(db, datainput)
                        let idxs: any = await usersNarratorModel.last_id(db); 
                        reply.code(201).send({
                                                response: { 
                                                    message: "Register datainput",
                                                    status: 1,   
                                                    data:datainput,
                                                    rs:rs, idxs:idxs,
                                                    StatusCode: '201',
                                                }
                                    }) 
                        return  // exit process  
                        
                        const luser: any = idxs[0]
                        console.log("luser", luser); 
                        let idx: Number = luser.id;
                        console.log("idx", idx);    
                        const input: any = {}  
                        input.id = idx;
                        input.seminar_id = seminar_id;
                        input.seminar_title_id = seminar_title_id;
                        input.datetime = datetime;
                        input.period_id = period_id;  
                        const token = fastify.jwt.sign({ input }, { expiresIn: '1d' });  //use for active status user
                        reply.code(200).send({
                                                response: { 
                                                    message: "Register seminar successful",
                                                    status: 1,  
                                                    token,
                                                    data:datainput,
                                                    StatusCode: '200',
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
    // display information or  select data
    //fastify.get('/usersseminarlist',{preValidation: [fastify.authenticate]},async (request: FastifyRequest, reply: FastifyReply) => {
    fastify.get('/usersseminarlist',async (request: FastifyRequest, reply: FastifyReply) => {
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const query: any = request.query       
                    /* 
                    const headers: any = request.headers   
                    const params: any = request.params     
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    */
                    const active_datatime: string = query.active_datatime || 1;
                    const status_active: string = query.status_active|| null;
                    const period_id: string = query.period_id;                    
                    const keyword = query.keyword; 
                    const seminar_id= query.seminar_id; 
                    const title_id = query.title_id; 
                    const email= query.email;
                    const start= query.start;
                    const end = query.end;    
                    const isCount = query.isCount;
                    const orderBy = query.orderBy || "desc";
                    const limit = query.limit;  
                    const status = query.status || 1;
                    const page: number = Number(query?.page) || 1;
                    const perpage: number = Number(query?.perpage) || 20;            
                    const filter: any = {} 
                    filter.seminar_id=seminar_id || null; 
                    filter.title_id = title_id || null; 
                    filter.period_id = period_id || null;  
                    filter.status_active = status_active || null; 
                    filter.status = status || 1; 
                    filter.keyword=keyword || null;                     
                    filter.isCount = 1;
                    const rows: any = await Seminar_Model.filter_title_users_seminar(db, filter);                      
                    const getCount = rows
                    console.log("getCount", getCount) 
                    const row: number = rows.length; // count array 
                    if(row==0){
                        reply.code(200).send({
                                        response: {
                                            message: "Result,Data is null!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: 0,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: null,
                                        }
                                        
                                    })   
                                    
                        return  // exit process 
                    }
                    const totalpages: number = Math.round((row / perpage)) || 1;
                    console.log(`total_pages=`,totalpages);
                    const filter1: any = {} 
                    filter1.seminar_id=seminar_id || null; 
                    filter1.title_id = title_id || null; 
                    filter1.period_id = period_id || null; 
                    filter1.status_active = status_active || null; 
                    filter1.status = status || 1; 
                    filter1.keyword=keyword || null; 
                    filter1.start=start || null; 
                    filter1.end=end || null; 
                    filter1.order=orderBy || null; 
                    filter1.pages=page || 1; 
                    filter1.sizepsge=perpage || 10; 
                    filter1.isCount=0;
                    const ResultArray: any = await Seminar_Model.filter_title_users_seminar(db, filter1);   
                    let tempData = [];
                    for (const [key, value] of Object.entries(ResultArray)) {
						// เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ 
                        const seminar_id: number = ResultArray[key].seminar_id; 
                        const title_id:number = ResultArray[key].title_id;
                        const title_name: string = ResultArray[key].title_name; 
                        const title: string = ResultArray[key].title;  
                        const location: string = ResultArray[key].location;  
                        const province: string = ResultArray[key].province;   
                        //const title_detail: string = ResultArray[key].title_detail; 
                        const spake_time: string = ResultArray[key].spake_time; 
                        const title_url: string = ResultArray[key].title_url; 
                        const startdate: string = Functions.timeConvertermas(ResultArray[key].startdate);
                        const enddate: string = Functions.timeConvertermas(ResultArray[key].enddate); 
                        const narrator_firstname: string = ResultArray[key].narrator_firstname; 
                        const narrator_lastname: string = ResultArray[key].narrator_lastname;  
                        const fullname_narrator: string = ResultArray[key].fullname_narrator; 
                        const narrator_email: string = ResultArray[key].narrator_email;   
                        const firstname_seminar: string = ResultArray[key].firstname_seminar;
                        const lastname_seminar: string = ResultArray[key].lastname_seminar;
                        const phonenumber_seminar: string = ResultArray[key].phonenumber_seminar;
                        const email_seminar: string = ResultArray[key].email_seminar;
                        const fullname_semina: string = ResultArray[key].fullname_semina;  
                        const filter2: any = {}  
                        filter2.title_id = title_id || null;  
                        const detail: any = await Seminar_Model.seminar_detail(db, filter2); 
                        let tempDataDetail = [];
                        for (const [key, value] of Object.entries(detail)) { 
                            const idx: number = detail[key].idx; 
                            const detail_name:string = detail[key].detail_name;
                            const startdate: string = Functions.timeConvertermas(detail[key].startdate);  
                            const enddate: string = Functions.timeConvertermas(detail[key].enddate);   
                            const datas = {  
                                        idx: idx, 
                                        detail_name: detail_name, 
                                        startdate: startdate, 
                                        enddate: enddate,  
                                    } 
                            tempDataDetail.push(datas); 
                        }
                        const data = { 
                                    seminar_id : seminar_id,
                                    title_id: title_id, 
                                    title_name: title_name, 
                                    title: title, 
                                    location: location, 
                                    province: province, 
                                    //title_detail: title_detail, 
                                    spake_time: spake_time, 
                                    url: title_url, 
                                    startdate: startdate, 
                                    enddate: enddate, 
                                    narrator: fullname_narrator,  
                                    fullname_narrator: narrator_firstname+' '+narrator_lastname, 
                                    narrator_email: narrator_email, 
                                    // firstname_seminar: firstname_seminar, 
                                    // lastname_seminar: lastname_seminar, 
                                    fullname_seminar: lastname_seminar+' '+firstname_seminar, 
                                    phonenumber_seminar: phonenumber_seminar, 
                                    email_seminar: email_seminar, 
                                    fullname_semina: fullname_semina, 
                                   // detail: tempDataDetail, 
                                } 
                        tempData.push(data); 
                    }
                    const resultData: any = tempData; // นำ array มาใส่ใน object เพื่อนำไปแปลงเป็น Json
                    // console.log("filter1=>", filter1) 
                    // console.warn("resultData=>", resultData)  
                    reply.code(200).send({
                                        response: {
                                            message: "Result,Data successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: totalpages,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: resultData,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500',  
                                            total_page: 0,
                                            total: 0, 
                                            page: 0,
                                            perpage: 0,
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
    fastify.post('/usersseminarlist',{preValidation: [fastify.authenticate]},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    const active_datatime: string = body.active_datatime || 1;
                    const status_active: string = body.status_active|| null;
                    const period_id: string = body.period_id;                    
                    const keyword = body.keyword; 
                    const seminar_id= body.seminar_id; 
                    const title_id = body.title_id; 
                    const email= body.email;
                    const start= body.start;
                    const end = body.end;    
                    const isCount = body.isCount;
                    const orderBy = body.orderBy || "desc";
                    const limit = body.limit;  
                    const status =body.status || 1;
                    const page: number = Number(query?.page) || 1;
                    const perpage: number = Number(query?.perpage) || 10;            
                    const filter: any = {} 
                    filter.seminar_id=seminar_id || null; 
                    filter.title_id = title_id || null; 
                    filter.period_id = period_id || null;  
                    filter.status_active = status_active || null; 
                    filter.status = status || 1; 
                    filter.keyword=keyword || null;                     
                    filter.isCount = 1;
                    const rows: any = await Seminar_Model.filter_title_users_seminar(db, filter);                      
                    const getCount = rows
                    console.log("getCount", getCount) 
                    const row: number = rows.length; // count array 
                    if(row==0){
                        reply.code(200).send({
                                        response: {
                                            message: "Result,Data is null!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: 0,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: null,
                                        }
                                        
                                    })   
                                    
                        return  // exit process 
                    }
                    const totalpages: number = Math.round((row / perpage)) || 1;
                    console.log(`total_pages=`,totalpages);
                    const filter1: any = {} 
                    filter1.seminar_id=seminar_id || null; 
                    filter1.title_id = title_id || null; 
                    filter1.period_id = period_id || null; 
                    filter1.status_active = status_active || null; 
                    filter1.status = status || 1; 
                    filter1.keyword=keyword || null; 
                    filter1.start=start || null; 
                    filter1.end=end || null; 
                    filter1.order=orderBy || null; 
                    filter1.pages=page || 1; 
                    filter1.sizepsge=perpage || 50; 
                    filter1.isCount=0;
                    const ResultArray: any = await Seminar_Model.filter_title_users_seminar(db, filter1);   
                    let tempData = [];
                    for (const [key, value] of Object.entries(ResultArray)) {
						// เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ 
                        const seminar_id: number = ResultArray[key].seminar_id; 
                        const title_id:number = ResultArray[key].title_id;
                        const title_name: string = ResultArray[key].title_name; 
                        const title: string = ResultArray[key].title;  
                        const location: string = ResultArray[key].location;  
                        const province: string = ResultArray[key].province;   
                        //const title_detail: string = ResultArray[key].title_detail; 
                        const spake_time: string = ResultArray[key].spake_time; 
                        const title_url: string = ResultArray[key].title_url; 
                        const startdate: string = Functions.timeConvertermas(ResultArray[key].startdate);
                        const enddate: string = Functions.timeConvertermas(ResultArray[key].enddate); 
                        const narrator_firstname: string = ResultArray[key].narrator_firstname; 
                        const narrator_lastname: string = ResultArray[key].narrator_lastname;  
                        const fullname_narrator: string = ResultArray[key].fullname_narrator; 
                        const narrator_email: string = ResultArray[key].narrator_email;   
                        const firstname_seminar: string = ResultArray[key].firstname_seminar;
                        const lastname_seminar: string = ResultArray[key].lastname_seminar;
                        const phonenumber_seminar: string = ResultArray[key].phonenumber_seminar;
                        const email_seminar: string = ResultArray[key].email_seminar;
                        const fullname_semina: string = ResultArray[key].fullname_semina;  
                        const filter2: any = {}  
                        filter2.title_id = title_id || null;  
                        const detail: any = await Seminar_Model.seminar_detail(db, filter2); 
                        let tempDataDetail = [];
                        for (const [key, value] of Object.entries(detail)) { 
                            const idx: number = detail[key].idx; 
                            const detail_name:string = detail[key].detail_name;
                            const startdate: string = Functions.timeConvertermas(detail[key].startdate);  
                            const enddate: string = Functions.timeConvertermas(detail[key].enddate);   
                            const datas = {  
                                        idx: idx, 
                                        detail_name: detail_name, 
                                        startdate: startdate, 
                                        enddate: enddate,  
                                    } 
                            tempDataDetail.push(datas); 
                        }
                        const data = { 
                                    seminar_id : seminar_id,
                                    title_id: title_id, 
                                    title_name: title_name, 
                                    title: title, 
                                    location: location, 
                                    province: province, 
                                    //title_detail: title_detail, 
                                    spake_time: spake_time, 
                                    url: title_url, 
                                    startdate: startdate, 
                                    enddate: enddate, 
                                    narrator: fullname_narrator,  
                                    fullname_narrator: narrator_firstname+' '+narrator_lastname, 
                                    narrator_email: narrator_email, 
                                    // firstname_seminar: firstname_seminar, 
                                    // lastname_seminar: lastname_seminar, 
                                    fullname_seminar: lastname_seminar+' '+firstname_seminar, 
                                    phonenumber_seminar: phonenumber_seminar, 
                                    email_seminar: email_seminar, 
                                    fullname_semina: fullname_semina, 
                                   // detail: tempDataDetail, 
                                } 
                        tempData.push(data); 
                    }
                    const resultData: any = tempData; // นำ array มาใส่ใน object เพื่อนำไปแปลงเป็น Json
 
                    // console.log("filter1=>", filter1) 
                    // console.warn("resultData=>", resultData)  
                    reply.code(200).send({
                                        response: {
                                            message: "Result,Data successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: totalpages,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: resultData,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500',  
                                            total_page: 0,
                                            total: 0, 
                                            page: 0,
                                            perpage: 0,
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    }) 
    //select title
    fastify.get('/titlelist',async (request: FastifyRequest, reply: FastifyReply) => {
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const query: any = request.query       
                    /* 
                    const headers: any = request.headers   
                    const params: any = request.params     
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    */
                    const active_datatime: string = query.active_datatime || 1;
                    const status_active: string = query.status_active|| null;
                    const period_id: string = query.period_id;                    
                    const keyword = query.keyword; 
                    const seminar_id= query.seminar_id; 
                    const title_id = query.title_id; 
                    const narrator_id = query.narrator_id; 
                    const location = query.location; 
                    const province = query.province; 
                    const telephone = query.telephone; 
                    const email= query.email;
                    const start= query.start;
                    const end = query.end;    
                    const isCount = query.isCount;
                    const orderBy = query.orderBy || "desc";
                    const limit = query.limit;  
                    const status = query.status || 1;
                    const page: number = Number(query?.page) || 1;
                    const perpage: number = Number(query?.perpage) || 20;            
                    const filter: any = {} 
                    filter.seminar_id=seminar_id || null; 
                    filter.title_id = title_id || null; 
                    filter.period_id = period_id || null;  
                    filter.status_active = status_active || null; 
                    filter.status = status || 1; 
                    filter.keyword=keyword || null;  
                    filter.narrator_id = narrator_id || null;  
                    filter.location = location || null;  
                    filter.province = province || null;  
                    filter.telephone=telephone || null;   
                    filter.isCount = 1;
                    const rows: any = await Seminar_Model.filter_title(db, filter);                      
                    const getCount = rows
                    console.log("getCount", getCount) 
                    const row: number = rows.length; // count array 
                    if(row==0){
                        reply.code(200).send({
                                        response: {
                                            message: "Result,Data is null!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: 0,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: null,
                                        }
                                        
                                    })   
                                    
                        return  // exit process 
                    }
                    const totalpages: number = Math.round((row / perpage)) || 1;
                    console.log(`total_pages=`,totalpages);
                    const filter1: any = {} 
                    filter1.seminar_id=seminar_id || null; 
                    filter1.title_id = title_id || null; 
                    filter1.period_id = period_id || null; 
                    filter1.status_active = status_active || null; 
                    filter1.status = status || 1; 
                    filter1.keyword=keyword || null; 
                    filter1.narrator_id = narrator_id || null;  
                    filter1.location = location || null;  
                    filter1.province = province || null;  
                    filter1.telephone=telephone || null;   
                    filter1.start=start || null; 
                    filter1.end=end || null; 
                    filter1.order=orderBy || null; 
                    filter1.pages=page || null;  
                    filter1.perpage=perpage || 20; 
                    filter1.isCount=0;
                    const ResultArray: any = await Seminar_Model.filter_title(db, filter1);   
                    let tempData = [];
                    for (const [key, value] of Object.entries(ResultArray)) {
						// เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ 
                        const title_id: number = ResultArray[key].idx; 
                        const title:string = ResultArray[key].title;
                        const firstname: string = ResultArray[key].firstname; 
                        const lastname: string = ResultArray[key].lastname;  
                        const fullname: string = ResultArray[key].fullname;  
                        const date: string = ResultArray[key].date;  
                        const start: string = Functions.timeConvertermas(ResultArray[key].start);  
                        const end: string = Functions.timeConvertermas(ResultArray[key].end);   
                        const filter2: any = {}  
                        filter2.title_id = title_id || null;  
                        const detail: any = await Seminar_Model.seminar_detail(db, filter2); 
                        let tempDataDetail = [];
                        for (const [key, value] of Object.entries(detail)) { 
                            const idx: number = detail[key].idx; 
                            const detail_name:string = detail[key].detail_name;
                            const startdate: string = Functions.timeConvertermas(detail[key].startdate);  
                            const enddate: string = Functions.timeConvertermas(detail[key].enddate);   
                            const datas = {  
                                        idx: idx, 
                                        detail_name: detail_name, 
                                        startdate: startdate, 
                                        enddate: enddate,  
                                    } 
                            tempDataDetail.push(datas); 
                        }
                        const data = { 
                                    title_id : title_id,
                                    title: title,  
                                    full_name_narrator: firstname+' '+lastname, 
                                    start: start, 
                                    end: end,  
                                    date: Functions.timeConvertermas(date),   
                                    detail: tempDataDetail, 
                                } 
                        tempData.push(data); 
                    }
                    const resultData: any = tempData; // นำ array มาใส่ใน object เพื่อนำไปแปลงเป็น Json
                    // console.log("filter1=>", filter1) 
                    // console.warn("resultData=>", resultData)  
                    reply.code(200).send({
                                        response: {
                                            message: "Result,Data successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: totalpages,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: resultData,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500',  
                                            total_page: 0,
                                            total: 0, 
                                            page: 0,
                                            perpage: 0,
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
    //create title
    fastify.post('/createtitle',{preValidation: [fastify.authenticate],schema: bodycreatetitle},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    /*******************/  
                    const today = new Date() 
                    const createdate =  Functions.timeConvertermas(today)
                    const title = body.title
                    const narrator_id = body.narrator_id 
                    const datetime_start = body.datetime_start
                    const datetime_end = body.datetime_end
                    const url = body.url
                    const detail = body.detail
                    const spake_time = body.spake_time
                    const location = body.location
                    const province = body.province
                    const telephone = body.telephone
                    const validation_input = body.email  
                    const validation_email: any = await TitleModel.check_email(db,validation_input);
                    /*
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
                    */
                    const input: any = {} 
                    input.title=title || null; 
                    input.narrator_id = narrator_id || null; 
                    input.create = createdate;  
                    input.datetime_start = datetime_start || null; 
                    input.datetime_end = datetime_end || null; 
                    input.url=url || null;    
                    input.detail=detail || null; 
                    input.spake_time = spake_time || null; 
                    input.location = location || null;  
                    input.province = province || null; 
                    input.telephone = telephone || null; 
                    input.email=validation_input || null;    
                    const rows: any = await TitleModel.create_data(db, input); 
                    reply.code(200).send({
                                        response: {
                                            message: "Create date successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',   
                                            data: null,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500', 
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
    //update title
    fastify.post('/updatetitle',{preValidation: [fastify.authenticate],schema: bodytitleupdate},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    /*******************/  
                    const today = new Date() 
                    const createdate =  Functions.timeConvertermas(today)
                    const id = body.id
                    const title = body.title
                    const narrator_id = body.narrator_id 
                    const datetime_start = body.datetime_start
                    const datetime_end = body.datetime_end
                    const url = body.url
                    const detail = body.detail
                    const spake_time = body.spake_time
                    const location = body.location
                    const province = body.province
                    const telephone = body.telephone
                    const validation_input = body.email  
                    const validation_email: any = await TitleModel.check_email(db, validation_input);
                    /*
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
                    */
                    const input: any = {} 
                    input.title=title; 
                    input.narrator_id = narrator_id; 
                    input.create = createdate;  
                    input.datetime_start = datetime_start; 
                    input.datetime_end = datetime_end 
                    input.url=url;    
                    input.detail=detail; 
                    input.spake_time = spake_time; 
                    input.location = location;  
                    input.province = province; 
                    input.telephone = telephone; 
                    input.email=validation_input;    
                    const rows: any = await TitleModel.update_by_id(db,id,input); 
                    reply.code(200).send({
                                        response: {
                                            message: "Create date successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',   
                                            data: null,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500', 
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    }) 
    //delete title
    fastify.get('/deletetitle',{preValidation: [fastify.authenticate],schema: query_string_titledelete},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    /*******************/  
                    const today = new Date() 
                    const createdate =  Functions.timeConvertermas(today)
                    const id = query.id 
                    const validation_id: any = await TitleModel.check_data_by_id(db,id);
                    if (validation_id.length==0) {
                                    reply.code(200).send({
                                                            response: { 
                                                            message: "data not found", 
                                                            status: 0,  
                                                            StatusCode: '200',
                                                            }
                                                        }) 
                                    return  // exit process  
                    }  
                    const rt: any = await TitleModel.remove_by_id(db, id); 
                    reply.code(200).send({
                                        response: {
                                            message: "Delete date successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',   
                                            data: null,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500', 
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    }) 
    // create seminar_detail
    fastify.post('/createseminardetail',{preValidation: [fastify.authenticate],schema: bodyseminar_detail},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    /*******************/  
                    const today = new Date() 
                    const seminar_title_id = body.seminar_title_id
                    const title = body.title  
                    const detail = body.detail
                    const cteate =  Functions.timeConvertermas(today)
                    const datetime =  Functions.timeConvertermas(today) 
                    const startdate = body.startdate
                    const enddate = body.enddate  
                    const input: any = {} 
                    input.seminar_title_id=seminar_title_id; 
                    input.title = title;  
                    input.detail = detail;  
                    input.cteate = cteate; 
                    input.datetime = datetime;   
                    input.startdate=startdate || null; 
                    input.enddate = enddate || null;  
                    const rows: any = await DetailModel.create_data(db, input); 
                    reply.code(200).send({
                                        response: {
                                            message: "Create date successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',   
                                            data: null,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500', 
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
    // update seminar_detail
    fastify.post('/updateseminardetail',{preValidation: [fastify.authenticate],schema: bodyseminar_detail},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    /*******************/  
                    const today = new Date() 
                    const id = body.id
                    const seminar_title_id = body.seminar_title_id
                    const title = body.title  
                    const detail = body.detail
                    const cteate =  Functions.timeConvertermas(today)
                    const datetime =  Functions.timeConvertermas(today) 
                    const startdate = body.startdate
                    const enddate = body.enddate  
                    const input: any = {} 
                    input.id=id; 
                    input.seminar_title_id=seminar_title_id; 
                    input.title = title;  
                    input.detail = detail;  
                    input.cteate = cteate; 
                    input.datetime = datetime;   
                    input.startdate=startdate || null; 
                    input.enddate = enddate || null;  
                    const rows: any = await DetailModel.update_by_id(db,id,input); 
                    reply.code(200).send({
                                        response: {
                                            message: "Update date successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',   
                                            data: null,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500', 
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
    // delete seminar_detail
    fastify.get('/deleteseminardetail',{preValidation: [fastify.authenticate],schema: query_string_titledelete},async (request: FastifyRequest, reply: FastifyReply) => {
            /******************************/
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const headers: any = request.headers         
                    const query: any = request.query       
                    const params: any = request.params        
                    const body: any = request.body  
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    /*******************/  
                    const today = new Date() 
                    const createdate =  Functions.timeConvertermas(today)
                    const id = query.id 
                    const validation_id: any = await DetailModel.check_data_by_id(db,id);
                    if (validation_id.length==0) {
                                    reply.code(200).send({
                                                            response: { 
                                                            message: "data not found", 
                                                            status: 0,  
                                                            StatusCode: '200',
                                                            }
                                                        }) 
                                    return  // exit process  
                    }  
                    const rt: any = await DetailModel.remove_by_id(db, id); 
                    reply.code(200).send({
                                        response: {
                                            message: "Delete date successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',   
                                            data: null,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500', 
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    }) 
    //seminar_period Seminar_Period_Model
    fastify.get('/eventlog',async (request: FastifyRequest, reply: FastifyReply) => {
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const query: any = request.query       
                    /* 
                    const headers: any = request.headers   
                    const params: any = request.params     
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    */                  
                    const keyword = query.keyword; 
                    const seminar_id= query.seminar_id; 
                    const title_id = query.title_id;  
                    const id= query.id;
                    const email= query.email;
                    const start= query.start;
                    const end = query.end;    
                    const isCount = query.isCount;
                    const orderBy = query.orderBy || "desc";
                    const limit = query.limit;  
                    const status = query.status || 1;
                    const page: number = Number(query?.page) || 1;
                    const perpage: number = Number(query?.perpage) || 20;            
                    const filter: any = {} 
                    filter.id = id
                    filter.title_id = title_id
                    filter.seminar_id = seminar_id
                    filter.email = email
                    filter.status = status || 1; 
                    filter.keyword=keyword || null;  
                    filter.start=start || null; 
                    filter.end=end || null; 
                    filter.isCount = 1;
                    const rows: any = await Seminar_Period_Model.filter_data_log(db, filter);                      
                    const getCount = rows
                    console.log("getCount", getCount) 
                    const row: number = rows.length; // count array 
                    if(row==0){
                        reply.code(200).send({
                                        response: {
                                            message: "Result,Data is null!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: 0,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: null,
                                        }
                                        
                                    })   
                                    
                        return  // exit process 
                    }
                    const totalpages: number = Math.round((row / perpage)) || 1;
                    console.log(`total_pages=`,totalpages);
                    const filter1: any = {}  
                    filter1.id = id
                    filter1.title_id = title_id
                    filter1.seminar_id = seminar_id
                    filter1.email = email
                    filter1.status = status || 1; 
                    filter1.keyword=keyword || null;  
                    filter1.start=start || null; 
                    filter1.end=end || null; 
                    filter1.order=orderBy || null; 
                    filter1.pages=page || null;  
                    filter1.perpage=perpage || 20; 
                    filter1.isCount=0;
                    const ResultArray: any = await Seminar_Period_Model.filter_data_log(db, filter1);   
                    let tempData = [];
                    for (const [key, value] of Object.entries(ResultArray)) {
						// เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ 
                        const idx: number = ResultArray[key].idx; 
                        const title:string = ResultArray[key].title_name;
                        const title_url: string = ResultArray[key].title_url; 
                        const narrator_fullname: string = ResultArray[key].narrator_fullname;  
                        const narrator_nickname: string = ResultArray[key].narrator_nickname;  
                        const seminar_id: string = ResultArray[key].seminar_id;  
                        const startdate: string = Functions.timeConvertermas(ResultArray[key].startdate);  
                        const enddate: string = Functions.timeConvertermas(ResultArray[key].enddate); 
                        const firstname_seminar: string = ResultArray[key].firstname_seminar;  
                        const lastname_seminar: string = ResultArray[key].lastname_seminar;  
                        const phonenumber_seminar: string = ResultArray[key].phonenumber_seminar;  
                        const email_seminar: string = ResultArray[key].email_seminar;   
                        const data = { 
                                    idx : idx,
                                    title: title,  
                                    title_url: title_url, 
                                    start: startdate, 
                                    end: enddate,
                                    narrator_fullname: narrator_fullname, 
                                    narrator_nickname: narrator_nickname, 
                                    seminar_id: seminar_id, 
                                    firstname_seminar: firstname_seminar, 
                                    lastname_seminar: lastname_seminar, 
                                    phonenumber_seminar: phonenumber_seminar, 
                                    email_seminar: email_seminar, 
                                } 
                        tempData.push(data); 
                    }
                    const resultData: any = tempData; // นำ array มาใส่ใน object เพื่อนำไปแปลงเป็น Json
                    // console.log("filter1=>", filter1) 
                    // console.warn("resultData=>", resultData)  
                    reply.code(200).send({
                                        response: {
                                            message: "Result,Data successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: totalpages,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: resultData,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500',  
                                            total_page: 0,
                                            total: 0, 
                                            page: 0,
                                            perpage: 0,
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
    fastify.get('/seminarperiodeventlog',async (request: FastifyRequest, reply: FastifyReply) => {
            reply.header("Access-Control-Allow-Origin", "*");  
            reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            try {
                    const query: any = request.query       
                    /* 
                    const headers: any = request.headers   
                    const params: any = request.params     
                    const str: any = request.headers.authorization; // token in Bearer  header
                    const token: any = str.replace("Bearer ", "");  
                    const token_bearer: any = fastify.jwt.verify(token); 
                    console.warn(`token_bearer `, token_bearer);
                    const start_token: any = token_bearer.iat;
                    const end_token: any = token_bearer.exp;
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    */                  
                    const keyword = query.keyword; 
                    const seminar_id= query.seminar_id; 
                    const title_id = query.title_id;  
                    const id= query.id;
                    const email= query.email;
                    const start= query.start;
                    const end = query.end;    
                    const isCount = query.isCount;
                    const orderBy = query.orderBy || "desc";
                    const limit = query.limit;  
                    const status = query.status || 1;
                    const page: number = Number(query?.page) || 1;
                    const perpage: number = Number(query?.perpage) || 20;            
                    const filter: any = {} 
                    filter.id = id
                    filter.title_id = title_id
                    filter.seminar_id = seminar_id
                    filter.email = email
                    filter.status = status || 1; 
                    filter.keyword=keyword || null;  
                    filter.start=start || null; 
                    filter.end=end || null; 
                    filter.isCount = 1;
                    const rows: any = await Seminar_Period_Model.filter_seminar_period_event_log(db, filter);                      
                    const getCount = rows
                    console.log("getCount", getCount) 
                    const row: number = rows.length; // count array 
                    if(row==0){
                        reply.code(200).send({
                                        response: {
                                            message: "Result,Data is null!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: 0,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: null,
                                        }
                                        
                                    })   
                                    
                        return  // exit process 
                    }
                    const totalpages: number = Math.round((row / perpage)) || 1;
                    console.log(`total_pages=`,totalpages);
                    const filter1: any = {}  
                    filter1.id = id
                    filter1.title_id = title_id
                    filter1.seminar_id = seminar_id
                    filter1.email = email
                    filter1.status = status || 1; 
                    filter1.keyword=keyword || null;  
                    filter1.start=start || null; 
                    filter1.end=end || null; 
                    filter1.order=orderBy || null; 
                    filter1.pages=page || null;  
                    filter1.perpage=perpage || 20; 
                    filter1.isCount=0;
                    const ResultArray: any = await Seminar_Period_Model.filter_seminar_period_event_log(db, filter1);   
                    let tempData = [];
                    for (const [key, value] of Object.entries(ResultArray)) {
						// เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ 
                        const idx: number = ResultArray[key].idx; 
                        const title:string = ResultArray[key].title_name;
                        const title_url: string = ResultArray[key].title_url; 
                        const narrator_fullname: string = ResultArray[key].narrator_fullname;  
                        const narrator_nickname: string = ResultArray[key].narrator_firstname;  
                        const narrator_firstname: string = ResultArray[key].narrator_firstname;  
                        const narrator_lastname: string = ResultArray[key].narrator_lastname;  
                        const seminar_id: string = ResultArray[key].seminar_id;  
                        const startdate: string = Functions.timeConvertermas(ResultArray[key].startdate);  
                        const enddate: string = Functions.timeConvertermas(ResultArray[key].enddate); 
                        const firstname_seminar: string = ResultArray[key].firstname_seminar;  
                        const lastname_seminar: string = ResultArray[key].lastname_seminar;  
                        const phonenumber_seminar: string = ResultArray[key].phonenumber_seminar;  
                        const email_seminar: string = ResultArray[key].email_seminar;   
                        const data = { 
                                    idx : idx,
                                    title: title,  
                                    title_url: title_url, 
                                    start: startdate, 
                                    end: enddate,
                                    narrator: narrator_firstname+' '+narrator_lastname, 
                                    seminar_id: seminar_id, 
                                    seminar: firstname_seminar+' '+lastname_seminar, 
                                    phonenumber_seminar: phonenumber_seminar, 
                                    email_seminar: email_seminar, 
                                } 
                        tempData.push(data); 
                    }
                    const resultData: any = tempData; // นำ array มาใส่ใน object เพื่อนำไปแปลงเป็น Json
                    // console.log("filter1=>", filter1) 
                    // console.warn("resultData=>", resultData)  
                    reply.code(200).send({
                                        response: {
                                            message: "Result,Data successful!", 
                                            error:'OK',                                            
                                            StatusCode: '200',  
                                            total_page: totalpages,
                                            total: row, 
                                            page: page,
                                            perpage: perpage,
                                            data: resultData,
                                        }
                                        
                                    })   
                                    
                return  // exit process 
            } catch (err) { 
                fastify.log.error('err=>', err);
                if (err) { 
                    fastify.log.error(err)
                    // process.exit(1)            
                    return  // exit process    
                } 
                reply.code(500).send({
                                        response: {
                                            message: "Eror Result!", 
                                            error:err,                                            
                                            StatusCode: '500',  
                                            total_page: 0,
                                            total: 0, 
                                            page: 0,
                                            perpage: 0,
                                            data: null,
                                        }
                                        
                                })    
                        // process.exit(1)            
                        return  // exit process    
            }           
    })  
}  