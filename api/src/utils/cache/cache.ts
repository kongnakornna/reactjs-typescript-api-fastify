import * as path from 'path'
const envPath = path.join(__dirname, '../../../.env')
require('dotenv').config({ path: envPath })
import objConfig from './rediscluster-config'
const util = require('util');
const { promisify } = require('util');
const lodash = require('lodash');
import lo from 'lodash'
const envprocess: any = process.env;
const env: any = process.env;
const redis_option: any = env.redis_option || '1';
const redis_port: any = env.redis_port || '6379';
const redis_host: any = env.redis_host || 'localhost';
//const redis_password: any = env.redis_password || '';
//const redis_key_file: any = env.REDIS_KEY_FILE || '';
//const redis_cert: any = env.REDIS_CERT|| '';
//const redis_ca : any = env.REDIS_CA|| '';
const axios = require('axios');
const redis = require('redis');
const ioRedis = require('ioredis');
const RedisTimeout = require('ioredis-timeout');
const moment = require('moment');
//const client = redis.createClient(redis_port, redis_host);
const retRet = {
                'result': true,
                'remark': 'success',
                'runlotime': null,
                'data': []
} 
const Call = () => { // Connection Redis Cluster DB  ส่วนนี้ใช้ในการ เชื่อมต่อ host
  var client = redis.createClient({
            host: redis_host,
            port: parseInt(redis_port),
           // password: redis_password
        })
    RedisTimeout(client, 3000)
        client.on('ready', () => { 
            console.log('2rd Cache Redis Cluster Connect is success')
        })
        client.on('error', (err: any) => {
            console.log(`2rd init Cache Redis Cluster init fail : ${err}`)
        })
} 
 
const client = redis.createClient({
            host: redis_host,
            port: parseInt(redis_port),
           // password: redis_password
})
RedisTimeout(client, 3000)
        client.on('ready', () => { 
            console.log(' Redis Connect is success')
        })
        client.on('error', (err: any) => {
            console.log(`Redis init fail : ${err}`)
        })
const clientDecode:any = JSON.stringify(client)
//console.log(`clientDecode : ${clientDecode}`); 
console.log(`redis_host : ${redis_host}`); 
console.log(`redis_port : ${redis_port}`);
console.log(`redis_option : ${redis_option}`);
console.log(`redis_retRet : ${retRet}`); 
 
const clienton = client.on('ready', () => {
   // console.log('Services Connecting to redis!',' host:'+redis_host+' port:'+redis_port+' password :'+redis_password); 
     console.log('Services Connecting to redis!',' host:'+redis_host+' port:'+redis_port); 
});
const clienterror = client.on('error', (err: any) => {
    console.log(`REDIS init fail : ${err}`)
})
const redis_ready = client.ready
console.log('redis ready',redis_ready);
export class CacheDataOne {
        async Getkey(keycache: any) {   
                console.log('Getkey_keycache=>',keycache);
                const data = client.get(keycache);  // set data cache 
                console.log('Getkey_keycache_data',data); 
            return data
        }
        async SetCacheData(setData: any) { 
                const time = setData.time;   
                const keycache = setData.keycache;
                const data = setData.data;
                console.log('setcache setData',setData);
                await client.setex(keycache, time, JSON.stringify(data));  // set data cache 
                console.log('keycache',keycache); 
            return keycache
        }
        async SetCacheKey(setData: any) {   
            const keycache = setData.keycache;
            const data = setData.data;
            console.log('SetCacheKey_setData',setData);
            await client.set(keycache,JSON.stringify(data));  // set data cache 
            console.log('SetCacheKey_keycache',keycache); 
        return keycache
        }
        async UpdateCacheData(setData: any) {  
                const time = setData.time;   
                const keycache = setData.keycache;
                const data = setData.data;
                console.log('Update setData',setData);
                await client.hset(keycache, time, JSON.stringify(data));  // set data cache 
                console.log('keycache',keycache); 
            return keycache
        }
        async getObject (key: any) {
            // see https://github.com/NodeRedis/node_redis#promises
            const result = await promisify(client.get).bind(client)(key);
            if (result) {
                const rs =await JSON.parse(result);
                console.log('getObject_key=>', key); 
                console.log('getObject=>', rs); 
                return  rs
            }
                console.log('getObject_key=>', key); 
                console.log('getObject=>', result); 
            return result;
        }
        async GetCacheData(keycache: any) { 
            try {
                console.log('keycache=>',keycache); 
                const result =await promisify(client.get).bind(client)(keycache).then(console.log('then keycache=>',keycache)) // get data cache
                    console.log('GetCacheData=>',result); 
                    const resultcache = JSON.parse(result); 
                    console.log('resultcache=>',resultcache); 
                return resultcache
            } catch (error) {
                console.log('keycache=>',keycache); 
                console.error(error)
            }
            /*

            RedisService = {
                getAsync: promisify(client.get).bind(client),
                setAsync: promisify(client.set).bind(client),
            }
               // const re =await await client.multi().get(keycache).exec();  
                const result =await promisify(client.get).bind(client)(keycache).then(console.log('GetCacheData_result=>',result)) // get data cache
                
                //  const result =await util.promisify(client.get).bind(client)(keycache); // get data cache
                console.log('client=>',client); 
                console.log('GetCacheData_result=>',result); 
                const resultcache = JSON.parse(result); 
                //resultcache.toString()
                //const resultcache = Object.create(resultcaches);
                console.log('GetCacheData_resultcache=>',resultcache);
                console.log('keycache=>',keycache);  
                return resultcache
            */
        }
        async DeleteCacheData(keycache: any) {  
                await promisify(client.del).bind(client)(keycache); // del data cache 
                console.log('del keycache',keycache); 
                return keycache
        }
        async OTP(keycache: any) {
            let date: any =  Date.now()
            let nowseconds = new Date().getTime()
            let timestamp: any = nowseconds
            let datenew = new Date(timestamp);
            const dayth = toThaiDate(datenew);
            const dayen = toEnDate(datenew);
            const time = 30;    
            const data = getRandomint(6);
            const keyotp = getRandomString(7);
            //  const key: any = 'OTP_'+keyotp+'_'+data+'_'+timestamp;
            const key: any = 'OTP_'+data;
            console.log('Random int', data);
            console.log('key otp',keyotp);
            await client.setex(key,time,JSON.stringify(data));  // set data cache 
            console.log('keycache', key); 
            const getOTP =await promisify(client.get).bind(client)(key); // get data cache
            const result_cache_OTP = JSON.parse(getOTP);
            let startDate = new Date(timestamp);
            let endDate = new Date(timestamp);
            if (startDate < endDate){
            // Do something
            }
            const OTP = {
                            key: key,
                            time:time, 
                            OTP: result_cache_OTP,
                            day_th: dayth,
                            day_en: dayen,  
                            timestamp:timestamp, 
                            time_start:datenew, 
                            }
                console.log('OTP', OTP); 
                return OTP
            // await client.disconnect();
        }
        async validateOTP(setData: any) {
            const keycache = setData.keycache; //  var otpvalchk = 'OTP_Auth_' + otpval + '_' + timestamp;
            const otpval = setData.otpval;
            const timestamp = setData.timestamp;
            const keycachedata = 'OTP_'+otpval;
            const rsOTP = await promisify(client.get).bind(client)(keycachedata); // get data cache   
            const resultlocacheloOTP = JSON.parse(rsOTP);
            console.log('validateOTP otp val=>',otpval);
            console.log('validateOTP rs OTP=>', resultlocacheloOTP);
            console.log('validateOTP key=>',keycachedata);
            if (otpval == resultlocacheloOTP) {
                var status:number=1
            } else {
                var status:number=0
            }
            return status 
        }
        async Run(keycache: any) {  
            const time = 30;    
            const data = getRandomint(6);
            const keyotp = getRandomString(12);
            const key: any = 'OTP_'+keyotp+'_'+data;
            console.log('Random int', data);
            console.log('key otp',keyotp);
            await client.setex(key,time,JSON.stringify(data));  // set data cache 
            console.log('keycache', key); 
            const result =await promisify(client.get).bind(client)(key); // get data cache
            const resultcache = JSON.parse(result);
            const run = {
                            key: key,
                            time:time, 
                            OTP:resultcache, 
                        }
            console.log('run', run); 
            return run
            // await client.disconnect();
        }
        /***********/
        async Set(setData: any) {
            const TimeExpire = setData.time;
            const keycache = setData.keycache;
            const Value = setData.data;
            //console.log('setcache setData', setData);
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
                    if (client === null) {
                        await Call()  // Connection Redis ส่วนนี้ใช้ในการ เชื่อมต่อ host
                    }
                    // execute
                    try {
                        //console.log('Set  keycache ', keycache)
                        //console.log('Set  TimeExpire ', TimeExpire)
                        //console.log('Set  Value ', Value)
                        client.set(keycache, Value, 'EX', TimeExpire, (err: any, res: any) => {
                        if (err) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `err : ${err.stack}`
                        } else {
                            Cacheloobjects.data = res
                        }
                        })
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err.stack}`
        
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async Get(setData: any) {
            const keycache = setData.keycache;
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
        
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
        
                    // execute
                    try {
                        console.log('Get  keycache ', keycache); 
                        client.get(keycache, (err: any, res: any) => {
                        if (err) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `err : ${err.stack}`
                            console.log('Cacheloobjects ', Cacheloobjects); 
                        } else {
                            Cacheloobjects.data = res
        
                            if (res === null) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `key not found`
                            console.log('Cacheloobjects ', Cacheloobjects); 
                            }
                        }
                        })
                        // console.log('Get  Cacheloobjects ', Cacheloobjects) 
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err.stack}`
                        console.log('Cacheloobjects ', Cacheloobjects); 
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        console.log('Cacheloobjects ', Cacheloobjects); 
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async Del(setData: any) {
            const keycache = setData.keycache;
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
        
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
        
                    // execute
                    try {
                        client.del(keycache, (err: any, res: any) => {
                        if (err) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `err : ${err}`
                        } else {
                            Cacheloobjects.data = res
                            if (res === 0) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `key not found`
                            }
                        }
                        })
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err.sack}`
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async flush(Scankeys = '*') { 
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
        
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
        
                    // execute
                    try {
                        const stackNode = client.nodes('master').map((node: any) => {
                        return node.keys(Scankeys)
                        })
        
                        Promise.all(stackNode).then(res => {
                        const arrFlat = lo.flattenDeep(res)
        
                        const stackKey = arrFlat.map((key: any) => {
                            client.del(key)
                        })
        
                        Promise.all(stackKey).then(res => {
                            Cacheloobjects.data = {
                            flush: arrFlat.length,
                            keys: lo.orderBy(arrFlat, [], ['asc'])
                            }
                        })
                        })
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err.stack}`
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async Expire(setData: any) {
            const TimeExpire = setData.time;
            const keycache = setData.keycache;
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
                    // execute
                    try {
                        // console.log('Expire  keycache ', keycache)
                        // console.log('Expire  TimeExpire ',TimeExpire)
                        client.expire(keycache, TimeExpire, (err: any, res: any) => {
                        if (err) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `err : ${err.stack}`
                        } else {
                            Cacheloobjects.data = res
                            if (res === 0) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `key not found`
                            }
                        }
                        })
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err.stack}`
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async Exists(setData: any) {
            const keycache = setData.keycache;
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
                    // execute
                    try {
                        // console.log('Exists  keycache ',keycache)
                        client.exists(keycache, (err: any, res: any) => {
                        if (err) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `err : ${err}`
                        } else {
                            Cacheloobjects.data = res
                        }
                        })
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err}`
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async Scan(Scankeys = '*') { 
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
        
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
        
                    // execute
                    try {
                        const promiseStack = client.nodes('master').map((node: any) => {
                        return node.keys(Scankeys)
                        })
        
                        Promise.all(promiseStack).then(res => {
                        const arrFlat = lo.flattenDeep(res)
                        Cacheloobjects.data = {
                            found: arrFlat.length,
                            keys: lo.orderBy(arrFlat, [], ['asc'])
                        }
                        })
                    } catch (err: any) {
                        Cacheloobjects.result = false
                        Cacheloobjects.remark = `catch : ${err.stack}`
                    } finally {
                        Cacheloobjects.runlotime = Date.now() - et
                        return resolve(Cacheloobjects)
                    }
                })
        }
        async Ttl(setData: any) {
            // เช็คเวลาที่เหลือของข้อมูล
            const TimeExpire = setData.time;
            const keycache = setData.keycache;
            const Value = setData.data;
            return new Promise(async (resolve) => {
                    const et: any = Date.now()
                    const Cacheloobjects = Object.create(retRet)
        
                    if (client === null) {
                        await Call()  // Connection Redis
                    }
        
                    // execute
                    try {
                        client.ttl(keycache, (err: any, res: any) => {
                        if (err) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `err : ${err.stack}`
                        } else {
                            if (res === -2) {
                            Cacheloobjects.result = false
                            Cacheloobjects.remark = `key not found`
                            } else if (res === -1) {
                            Cacheloobjects.data = {
                                inlosecond: res,
                                atlotime: '9999-12-31 23:59:59'
                            }
                            } else {
                            Cacheloobjects.data = {
                                inlosecond: res,
                                atlotime: moment().add(res, 's').format('YYYY-MM-DD HH:mm:ss')
                            }
                            }
                        }
                    })
                } catch (err: any) {
                    Cacheloobjects.result = false
                    Cacheloobjects.remark = `catch : ${err.satck}`
                } finally {
                    Cacheloobjects.runlotime = Date.now() - et
                    return resolve(Cacheloobjects)
                }
                })
        }
    /***********/
}
function getRandomString(length: any) { 
  var randomChars: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#';
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