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
import registerSchema from '../schemas/registerSchema'  
import bodyseminarregister from '../schemas/bodyseminarregister'  
import bodysingupSchema from '../schemas/bodysingup'
import ActivateSchema from '../schemas/bodyActivate' 
import queryActivateSchema from '../schemas/queryActivate' 
var md5 = require('md5');
import { _publicfunctions } from '../utils/helpers/functions.helper';  
const Functions  = new _publicfunctions() 
export default async function seminar(fastify: FastifyInstance) {
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
        // Enrol course or  register seminar
        fastify.post('/register',{preValidation: [fastify.authenticate],schema: bodyseminarregister},  async (request: FastifyRequest, reply: FastifyReply) => {
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
                        reply.code(200).send({
                                                response: { 
                                                    message: "Register datainput",
                                                    status: 1,   
                                                    data:datainput,
                                                    rs:rs, idxs:idxs,
                                                    StatusCode: '200',
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
        fastify.get('/usersseminarlist', {preValidation: [fastify.authenticate]}, async (request: FastifyRequest, reply: FastifyReply) => {
             /******************************/
                reply.header("Access-Control-Allow-Origin", "*");  
                reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
                const headers: any = request.headers         
                const query: any = request.query       
                const params: any = request.params        
                /******************************/
                    const str: any = headers.authorization  
                    const host: any = headers.host   
                    const secret_key: any = headers.secret_key   
                    const active_datatime: string = query.active_datatime|| 1;
                    const status_active: string = query.status_active|| 1;
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
                    filter.seminar_id=seminar_id;
                    filter.title_id = title_id; 
                    filter.period_id = period_id; 
                    filter.status_active = status_active;
                    filter.keyword=keyword;                    
                    filter.isCount=1;
                    const rows = await Seminar_Model.filter_title_users_seminar(db, filter);
                    const getCount = rows
                    console.log("getCount", getCount) 
                    const row: number = rows.length; // count array 
                    const totalpages: number = Math.round((row / perpage)) || 1;
                    console.log(`total_pages=`); 
                    console.log(totalpages);
                    const filter1: any = {} 
                    filter1.seminar_id=seminar_id;
                    filter1.title_id = title_id; 
                    filter1.period_id = period_id; 
                    filter1.status_active = status_active;
                    filter1.keyword=keyword;
                    filter1.start=start;
                    filter1.end=end; 
                    filter1.order=orderBy;
                    filter1.pages=page;
                    filter1.sizepsge=perpage;
                    filter1.isCount=0;
                    const ResultArray = await Seminar_Model.filter_title_users_seminar(db, filter1);
                /*****************************************/
                try {      
                    let tempData = [];
                    for (const [key, value] of Object.entries(ResultArray)) {
                        // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ 
                        const seminar_id: number = value.seminar_id; 
                        const title_id:number = value.title_id;
                        const title_name: string = value.title_name;  
                        const title_detail: string = value.title_detail; 
                        const spake_time: string = value.spake_time; 
                        const title_url: string = value.title_url; 
                        const startdate: string = value.startdate;
                        const enddate: string = value.enddate; 
                        const fullname_narrator: string = value.fullname_narrator; 
                        const narrator_email: string = value.narrator_email;   
                        const firstname_seminar: string = value.firstname_seminar;
                        const lastname_seminar: string = value.lastname_seminar;
                        const phonenumber_seminar: string = value.phonenumber_seminar;
                        const email_seminar: string = value.email_seminar;
                        const fullname_semina: string = value.fullname_semina; 
                        const data = { 
                                    seminar_id : seminar_id,
                                    title_id: title_id, 
                                    title_name: title_name, 
                                    title_detail: title_detail, 
                                    spake_time: spake_time, 
                                    url: title_url, 
                                    startdate: startdate, 
                                    enddate: enddate, 
                                    fullname_narrator: fullname_narrator, 
                                    narrator_email: narrator_email, 
                                    firstname_seminar: firstname_seminar, 
                                    lastname_seminar: lastname_seminar, 
                                    phonenumber_seminar: phonenumber_seminar, 
                                    email_seminar: email_seminar, 
                                    fullname_semina: fullname_semina, 
                                } 
                        tempData.push(data); 
                    }
                    const resultData: any = tempData; // นำ array มาใส่ใน object เพื่อนำไปแปลงเป็น Json
                    // console.log(resultData) 
                    console.warn(resultData)    
                    reply.code(200).send({
                                        response: {
                                            result: "users seminar list!",
                                            message: "Result,Data successful!", 
                                            status: 1, 
                                            data: null, 
                                            StatusCode: '200',
                                        },
                                        input_query:query,
                                        total_page: totalpages,
                                        total: row, 
                                        page: page,
                                        perpage: perpage,
                                        data: resultData,
                                    })   
                        return  // exit process  
                 } catch (error: any) { 
                        reply.code(401).send({
                                            response: {
                                                result: "Error",
                                                message: "Result,Data  Unsuccessful!", 
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
                                                message: "Result,Data Unsuccessful,Error System something!", 
                                                status: 1, 
                                                token: null,
                                                StatusCode: '403',
                                            }
                                    }) 
                        return  // exit process   
                }        
        })  
} 