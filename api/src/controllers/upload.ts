
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import multer from 'fastify-multer'
const mime = require('mime-types')
import * as fse from 'fs-extra'
import * as path from 'path'
import * as fs from 'fs'
import * as knex from 'knex'
import { v4 as uuidv4 } from 'uuid';
import { FileModel } from '../models/file'
// csv top array https://www.npmjs.com/package/convert-csv-to-array
const { convertCSVToArray } = require('convert-csv-to-array');
const converter = require('convert-csv-to-array');
// https://www.npmjs.com/package/csv-array
 var csv = require('csv-array');
const fileModel = new FileModel()
export default async function upload(fastify: FastifyInstance) {
  const db: knex = fastify.db
  const uploadPath = process.env.UPLOAD_DIR || './upload'
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, uploadPath)
    },
    filename: (req: any, file: any, cb: any) => {
      const _ext = path.extname(file.originalname) // .jpg
      const filename = uuidv4() + _ext
      cb(null, filename)
    }
  })

  const upload = multer({
    storage,
    limits: {
      fileSize: 15 * 1024 * 1024
    },
    fileFilter: (req: any, file: any, cb: any) => {
      console.log('mimetype_file=>', file); 
      if (file.mimetype !== 'image/jpeg') {
        return cb(new Error('Invalid mimetype!'), false)
      }
      cb(null, true)
    }
  })

  fastify.post('/', {
    preHandler: upload.single('file')
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const file = request.file
    console.log('request=>',request); 
    console.log('file=>',file); 
    const fileInfo: any = {}
    fileInfo.originalname = file.originalname
    fileInfo.mimetype = file.mimetype
    fileInfo.filesize = file.size
    fileInfo.filename = file.filename
    console.log('fileInfo=>',fileInfo); 
    const rs: any = await fileModel.save(db, fileInfo)
    const fileId = rs[0]
    reply.header('x-cache-status', 0); // 1=yes ,0=no
    reply.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    reply.header('Expires', '-1');
    reply.header('Pragma', 'no-cache');  
    reply.header("Access-Control-Allow-Origin", "*"); 
    reply.header("Access-Control-Allow-Headers",  "*");
    reply.header('Access-Control-Allow-Credentials', false);
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    reply.send({ fileId })
  })

  fastify.post('/array', {
    preHandler: upload.array('file', 3)
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const files = request.files
    for (const file of files) {
      const fileInfo: any = {}
      fileInfo.originalname = file.originalname
      fileInfo.mimetype = file.mimetype
      fileInfo.filesize = file.size
      fileInfo.filename = file.filename
      await fileModel.save(db, fileInfo)
    }
    reply.header('x-cache-status', 0); // 1=yes ,0=no
    reply.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    reply.header('Expires', '-1');
    reply.header('Pragma', 'no-cache');  
    reply.header("Access-Control-Allow-Origin", "*"); 
    reply.header("Access-Control-Allow-Headers",  "*");
    reply.header('Access-Control-Allow-Credentials', false);
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    reply.send({ ok: true })
  })

  fastify.get('/file/:fileId', async (request: FastifyRequest, reply: FastifyReply) => {
    const params: any = request.params
    const fileId = params.fileId
    try {
      const rs: any = await fileModel.getInfo(db, fileId)
      if (rs.length > 0) {
        const file = rs[0]
        const filename = file.filename
        const mimetype = file.mimetype
        const filePath = path.join(uploadPath, filename)
        if (fs.existsSync(filePath)) {
          const _mimetype = mimetype
          const fileData = fs.readFileSync(filePath)
          reply.type(_mimetype)
          reply.send(fileData)
        } else {
          reply.header('x-cache-status', 0); // 1=yes ,0=no
          reply.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          reply.header('Expires', '-1');
          reply.header('Pragma', 'no-cache');  
          reply.header("Access-Control-Allow-Origin", "*"); 
          reply.header("Access-Control-Allow-Headers",  "*");
          reply.header('Access-Control-Allow-Credentials', false);
          reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          reply.code(500).send({ ok: false, error: filename + ' not found!' })
        }
      } else {
        reply.header('x-cache-status', 0); // 1=yes ,0=no
        reply.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        reply.header('Expires', '-1');
        reply.header('Pragma', 'no-cache');  
        reply.header("Access-Control-Allow-Origin", "*"); 
        reply.header("Access-Control-Allow-Headers",  "*");
        reply.header('Access-Control-Allow-Credentials', false);
        reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        reply.code(500).send({ ok: false, error: 'File not found (database)' })
      }
    } catch (error) {
      reply.header('x-cache-status', 0); // 1=yes ,0=no
      reply.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      reply.header('Expires', '-1');
      reply.header('Pragma', 'no-cache');  
      reply.header("Access-Control-Allow-Origin", "*"); 
      reply.header("Access-Control-Allow-Headers",  "*");
      reply.header('Access-Control-Allow-Credentials', false);
      reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      reply.code(500).send({ ok: false, error: 'error 500'})
    }
  })
  
  // uploads Csv
  fastify.post('/csvimport', {}, async (request: FastifyRequest, reply: FastifyReply) => {
        // https://codingbeautydev.com/blog/javascript-convert-csv-to-array
        reply.header("Access-Control-Allow-Origin", "*"); 
        reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        const file = request.file
        console.log('request=>',request); 
        console.log('file=>',file); 
        const fileInfo: any = {}
        fileInfo.originalname = file.originalname
        fileInfo.mimetype = file.mimetype
        fileInfo.filesize = file.size
        fileInfo.filename = file.filename
        console.log('fileInfo=>',fileInfo); 
        const rs: any = await fileModel.save(db, fileInfo)
        const fileId = rs[0];
        var csv = require('csv-array');
        const filedata: any = 'test.csv';
        const data: any = [];
        csv.parseCSV(filedata, function(data: any ){
          console.log(JSON.stringify(data));
        }, true);
        reply.send({ fileId })
  })
}