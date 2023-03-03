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
                const getchar: string = getRandomchar(16);
                const today = new Date()
                const dates = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                const datetime = dates + ' ' + time
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
                const seminar_id: number = data['createsignin']['seminar_id'];
                var email: number = data['createsignin']['email'];
                const validation_input: any = {}                          
                validation_input.seminar_title_id = seminar_title_id; 
                validation_input.period_id = period_id;  
                validation_input.seminar_id = seminar_id;
                console.warn(`validation_input=> `, validation_input); 
                reply.code(401).send({
                                            response: { 
                                                message: "Test!", 
                                                status: 0,  
                                                StatusCode: '200',
                                                body:body,
                                                tokendecode:tokendecode,
                                            }
                                        }) 
                return  // exit process   
                
                const validation_period_id: any = await Seminar_Model.check_validate(db,seminar_title_id,seminar_id,period_id);
                console.warn(`validation_period_id_count=> `, validation_period_id.lengt); 
                if (validation_period_id.length > 0) {
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
                        datainput.datetime = datetime;
                        datainput.period_id = period_id;  
                        datainput.seminar_id = seminar_id;
                        datainput.active_datatime = active_datatime;
                        datainput.status_active = status_active;
                        const rs: any = await Seminar_Model.seminar_register(db, datainput)
                        let idxs: any = await usersNarratorModel.last_id(db);
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
       // fastify.get('/usersseminarlist', {preValidation: [fastify.authenticate]}, async (request: FastifyRequest, reply: FastifyReply) => {
        fastify.get('/usersseminarlist', async (request: FastifyRequest, reply: FastifyReply) => {
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
                    reply.code(200).send({
                                        response: {
                                            result: "users seminar list!",
                                            message: "Result,Data successful!", 
                                            status: 1, 
                                            data: null, 
                                            StatusCode: '200',
                                        },
                                        input_query:query, 
                                    })   
                        return  // exit process  
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
        function toThaiDate(date: any) { 
            let monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]; 
                let year = date.getFullYear() + 543;
                let month = monthNames[date.getMonth()];
                let numOfDay = date.getDate();
                let hour = date.getHours().toString().padStart(2, "0");
                let minutes = date.getMinutes().toString().padStart(2, "0");
                let second = date.getSeconds().toString().padStart(2, "0");
            return `${numOfDay} ${month} ${year} ` +`${hour}:${minutes}:${second} น.`;
        }
        function toEnDate(date: any) { 
            let monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]; 
            let monthNameslong = ["January", "February", "March.", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
            let year = date.getFullYear()+ 0;
            let month = monthNameslong[date.getMonth()];
            let numOfDay = date.getDate();
            let hour = date.getHours().toString().padStart(2, "0");
            let minutes = date.getMinutes().toString().padStart(2, "0");
            let second = date.getSeconds().toString().padStart(2, "0");
            return `${numOfDay} ${month} ${year} ` +`${hour}:${minutes}:${second}`;
        }
        function timeConverter(UNIX_timestamp:any){
                var a = new Date(UNIX_timestamp * 1000);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var sec = a.getSeconds();
                var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                return time;
        }  
        function toTimestamp(strDate: any){ var datum = Date.parse(strDate); return datum/1000;}
        function getRandomString(length: any) {
                //var randomChars: any = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
                var randomChars: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#';
                var result: any =  ''
                for ( var i = 0; i < length; i++ ) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
                }
                return result
        }
        function getRandomchar(length: any) { 
                var randomChars: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var result: any =  ''
                for ( var i = 0; i < length; i++ ) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
                }
                return result
        }
        function getRandomint(length: any) { 
                var randomChars: any =  '0123456789';
                var result: any =  ''
                for ( var i = 0; i < length; i++ ) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
                }
                return result
        }
        function getRandomsrtsmall(length: any) { 
                var randomChars: any =  'abcdefghijklmnopqrstuvwxyz';
                var result: any =  ''
                for ( var i = 0; i < length; i++ ) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
                }
                return result
        }
        function getRandomsrtbig(length: any) { 
                var randomChars: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var result: any =  ''
                for ( var i = 0; i < length; i++ ) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
                }
                return result
        }
        function passwordValidator(inputtxt: any){ 
            var paswd :any= "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
            if(inputtxt.match(paswd)){  
                console.log('Your validate password  Correct, try another...:'+inputtxt);
                return true;
            }else{  
                    console.log('You validate password Wrong...:'+inputtxt);
                return false;
            }
        }  
        function generatePassword(passwordLength: any) {
            var numberChars = "0123456789";
            var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var lowerChars = "abcdefghijklmnopqrstuvwxyz";
            var vaChars = "!@#$%^&*";
            var allChars = numberChars + upperChars + lowerChars+ vaChars;
            var randPasswordArray = Array(passwordLength);
            randPasswordArray[0] = numberChars;
            randPasswordArray[1] = upperChars;
            randPasswordArray[2] = lowerChars;
            randPasswordArray = randPasswordArray.fill(allChars, 3);
            return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
        }
        function shuffleArray(array: any) {
            for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            }
            return array;
        } 
        var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        function isemailValid(email: any) {
            if (!email)
                return false;

            if(email.length>254)
                return false;

            var valid = emailRegex.test(email);
            if(!valid)
                return false;

            // Further checking of some things regex can't handle
            var parts = email.split("@");
            if(parts[0].length>64)
                return false;

            var domainParts = parts[1].split(".");
            if(domainParts.some(function(part: any) { return part.length>63; }))
                return false;

            return true;
        }
} 