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
import { _publicfunctions } from '../utils/helpers/functions.helper';  
import { _Validator } from '../utils/helpers/validator.helper';  
const Validator = new _Validator() 
const Functions = new _publicfunctions() 
/***********************/
import {encode, decode} from 'string-encode-decode'
/***********************/
export default async function index(fastify: FastifyInstance) {
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
  fastify.post('/createtoken', async (request: FastifyRequest, reply: FastifyReply) => {
    const reportError = ({message}: {message: string}) => {}
    reply.header("Access-Control-Allow-Origin", "*");  
    reply.header('Access-Control-Allow-Methods', 'POST'); 
    const headers: any = request.headers || null;
    const query: any = request.query || null;
    const body: any = request.body;
    const params: any = request.params || null;  
    const apikey : any = request.headers.apikey || null;
    const getchar: string = Functions.getRandomchar(16);
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
} 

// https://restfulapi.net/http-status-codes/
/*
1×× Informational

100 Continue
101 Switching Protocols
102 Processing

2×× Success

200 OK
201 Created
202 Accepted
203 Non-authoritative Information
204 No Content
205 Reset Content
206 Partial Content
207 Multi-Status
208 Already Reported
226 IM Used

3×× Redirection

300 Multiple Choices
301 Moved Permanently
302 Found
303 See Other
304 Not Modified
305 Use Proxy
307 Temporary Redirect
308 Permanent Redirect

4×× Client Error

400 Bad Request
401 Unauthorized
402 Payment Required
403 Forbidden
404 Not Found
405 Method Not Allowed
406 Not Acceptable
407 Proxy Authentication Required
408 Request Timeout
409 Conflict
410 Gone
411 Length Required
412 Precondition Failed
413 Payload Too Large
414 Request-URI Too Long
415 Unsupported Media Type
416 Requested Range Not Satisfiable
417 Expectation Failed
418 I’m a teapot
421 Misdirected Request
422 Unprocessable Entity
423 Locked
424 Failed Dependency
426 Upgrade Required
428 Precondition Required
429 Too Many Requests
431 Request Header Fields Too Large
444 Connection Closed Without FastifyReply
451 Unavailable For Legal Reasons
499 Client Closed Request

5×× Server Error

500 Internal Server Error
501 Not Implemented
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
505 HTTP Version Not Supported
506 Variant Also Negotiates
507 Insufficient Storage
508 Loop Detected
510 Not Extended
511 Network Authentication Required
599 Network Connect Timeout Error

*/