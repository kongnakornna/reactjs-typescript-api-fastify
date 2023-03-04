"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,i){void 0===i&&(i=r);var s=Object.getOwnPropertyDescriptor(t,r);s&&("get"in s?t.__esModule:!s.writable&&!s.configurable)||(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,i,s)}:function(e,t,r,i){e[i=void 0===i?r:i]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},fastify=(Object.defineProperty(exports,"__esModule",{value:!0}),__importStar(require("fastify"))),path=__importStar(require("path")),multer=require("fastify-multer"),envPath=path.join(__dirname,"./.env"),packageJSON=(require("dotenv").config({path:envPath}),require("../package.json")),port=packageJSON.port,env=process.env,router_1=__importDefault(require("./router/router")),app=fastify.fastify({logger:{level:"info"}});app.register(multer.contentParser),app.register(require("fastify-cors"),{origin:"*",credentials:"true",preflightContinue:!0,optionsSuccessStatus:200,allowedHeaders:"*",methods:"GET,POST,OPTIONS,PUT,DELETE,PATCH"}),app.register(require("fastify-formbody")),app.register(require("./plugins/mysqldb"),{options:{client:"mysql2",connection:{host:env.DB_HOST,port:Number(env.DB_PORT),user:env.DB_USER,password:env.DB_PASSWORD,database:env.DB_NAME},debug:!0},connectionName:"db"}),app.register(require("./plugins/typeorm"),{options:{client:"mysql",entities:"../entities/*{.ts,.js}",migrations:"../migration/*{.ts,.js}",subscribers:"../subscriber/*{.ts,.js}",connection:{host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME},debug:!0},connectionName:"db"}),app.register(require("./plugins/jwt"),{secret:env.JWT_SECRET||"$#200011124441##@"}),app.register(require("fastify-static"),{root:path.join(__dirname,"../public"),prefix:"/assets/"}),app.register(require("point-of-view"),{engine:{ejs:require("ejs"),root:path.join(__dirname,"../views")},includeViewExtension:!0}),app.register(router_1.default,{prefix:"".concat(packageJSON.endPoint)}),exports.default=app;