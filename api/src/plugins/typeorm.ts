import fp from "fastify-plugin"
import { createConnection } from 'typeorm';
import "reflect-metadata";
module.exports = fp(async (fastify: any, opts: any, done: any) => {
        const client: any = opts.options.client; 
        const host: any = opts.options.connection.host; 
        const user: any = opts.options.connection.user; 
        const password: any = opts.options.connection.password; 
        const database: any = opts.options.connection.database;  
        const port: number = opts.options.connection.port; 
        const entities: any = opts.options.entities; 
        const migrations: any = opts.options.migrations; 
        const subscribers: any =opts.options.subscribers; 
        console.log("TypeORM client", client);
        console.log("TypeORM host", host);
        console.log("TypeORM port", port);
        console.log("TypeORM user", user);
        console.log("TypeORM password", password);
        console.log("TypeORM database", database);
        console.log("TypeORM entities", entities);
          createConnection({
                    type: client,
                    host: host,
                    port: Number(port),
                    username: user,
                    password: password,
                    database: database, 
                          entities: [
                                    entities 
                          ],
                          migrations: [migrations],
                          subscribers: [subscribers],
                          logging: true,
                          synchronize: false // crate/after table auto 
                  }).then(connection => {
                          console.log("TypeORM isConnection", connection.isConnected)
                  });
})