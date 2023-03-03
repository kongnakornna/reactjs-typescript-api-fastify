import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import * as path from 'path'
const multer = require('fastify-multer')
const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath })
const packageJSON:any = require('../../package.json')
const port:any = packageJSON.port;
const env:any = process.env 
//console.warn(`packageJSON=>`,  packageJSON);  
//console.warn(`port=>`,  port);  
const APIKEY:any = env.API_KEY
console.warn(`APIKEY=>`, APIKEY);  
//console.warn(`env=>`, env);  
/***********************/
export default async function index(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.header("Access-Control-Allow-Origin", "*");  
        reply.header('Access-Control-Allow-Methods', 'GET');    
        const getchar: string = getRandomint(5);
        reply.code(200).send({
                                response: {
                                    message: 'Welcome To Application Service!', 
                                    status: 1, 
                                    data:getchar,
                                    StatusCode: '200',
                                }
                          })
        return  // exit process        
  })
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.header("Access-Control-Allow-Origin", "*");  
        reply.header('Access-Control-Allow-Methods', 'POST'); 
        const getchar: string = getRandomint(5);
        reply.code(200).send({
                                    response: {
                                        message: 'Welcome To Application Service!', 
                                        status: 1, 
                                        data:getchar,
                                        StatusCode: '200',
                                    }
                            }) 
        return  // exit process                      
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
    const getchar: string = getRandomchar(16);
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
    let start_date_en: any = toEnDate(start_date);
    let end_date_en: any =  toEnDate(end_date);
    let start_date_thai: any =  toThaiDate(start_date);
    let end_date_thai: any = toThaiDate(end_date);  
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
  fastify.post('/jwt/sign', async (request: FastifyRequest, reply: FastifyReply) => {
    const headers: any = request.headers || null;
    const query: any = request.query || null;
    const body: any = request.body;
    const params: any = request.params || null;  
    reply.header("Access-Control-Allow-Origin", "*");  
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    if (body.APIkey == null) {  
              reply.code(500).send({
                                  response: {
                                      message: "Error APIkey is null",
                                      status: 1, 
                                      data: null,
                                      token: null,
                                      StatusCode: '500',
                                  }
                    }) 
    }else if (body.APIkey == APIKEY) { 
        const token = fastify.jwt.sign({
              first_name: 'demo',
              last_name: 'demo',
              emsail: 'demo@gmail.com',
            }) 
        reply.code(200).send({
                            response: {
                                message: "Create token!", 
                                status: 1, 
                                data: null,
                                token: token,
                                StatusCode: '200',
                            }
                      }) 
        return  // exit process       
    }else{
        reply.code(200).send({
                            response: {
                                message: "API key wrong, please check!", 
                                status: 1, 
                                data: null,
                                token: null,
                                StatusCode: '200',
                            }
                      }) 
        return  // exit process    

    } 
  })
  fastify.post('/jwt/private', {preValidation: [fastify.authenticate] /*ตรวจสอบ Tokem*/}, async (request: FastifyRequest, reply: FastifyReply) => {
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
} 