import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import * as knex from 'knex'
import * as crypto from 'crypto'
import { UserModel } from '../models/user_model'
import bodysinginSchema from '../schemas/bodysingin'
import { _publicfunctions } from '../utils/helpers/functions.helper';  
import { _Validator } from '../utils/helpers/validator.helper';  
const Validator = new _Validator() 
const Functions = new _publicfunctions() 
/***********************/
export default async function login(fastify: FastifyInstance) {
  const userModel = new UserModel()
  const db: knex = fastify.db
  fastify.post('/',{schema: bodysinginSchema}, async (request: FastifyRequest, reply: FastifyReply) => {
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
            const encPassword = crypto.createHash('md5').update(password).digest('hex');
            const rs: any = await userModel.login(db, username, encPassword);
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
                reply.code(200).send({
                                    response: {
                                        message: "Create token Successful!",
                                        status: 1, 
                                        ok: true,                                       
                                        statusCode: '200',
                                        data: {
                                                  user_id: user.user_id,
                                                  username: user.username,
                                                  rstname: user.firstname,
                                                  lastname: user.lastname,
                                                  email: user.email
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
        }catch (error: any) { 
            console.log('error toUpperCase=>',error.toUpperCase());  
            console.log('message=>',error.message) 
            reportError({ message: error.message })
            console.log('reportError=>',reportError) 
            reply.code(500).send({
                                  response: { 
                                      message: 'gError', 
                                      status: 1,
                                      ok: false,
                                      statusCode: '500',
                                  }
                                })            
            return  // exit process     
        }finally {
              reply.code(500).send({
                                  response: { 
                                      message: "error",
                                      status: 1,
                                      ok: false,
                                      statusCode: '500',
                                  }
                                })                   
            return  // exit process     
        } 
      }
  })
  fastify.post('/verifylogin', {preValidation: [fastify.authenticate]/*สรวจสอบ Tokem*/}, async (request: FastifyRequest, reply: FastifyReply) => {
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
}