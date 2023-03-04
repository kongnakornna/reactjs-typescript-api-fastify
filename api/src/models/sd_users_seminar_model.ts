import * as knex from 'knex';
/**************************************************/    
export class SdusersSeminarModel {
    create_data(db: knex, data: any) {
        return db('sd_users_seminar')
        .insert(data)
    }
    last_seminar_id(db: knex) {
        return db('sd_users_seminar')
        .select('seminar_id')
        .orderBy('seminar_id','desc')
        .limit(1)
    }
    activate(db: knex, seminar_id: any, data: any) {
        return db('sd_users_seminar')
        .where('seminar_id', seminar_id)
        .update(data)
    } 
   login(db: knex, email: any, password: any) {
       return db('sd_users_seminar')
            .select('seminar_id')
            .select('firstname')
            .select('lastname')
            .select('phonenumber')
            .select('email')
            .select('status')
            .where('email', email)
            .andWhere('password', password)
    }
    update_by_seminar_id(db: knex, seminar_id: any, data: any) {
        return db('sd_users_seminar')
        .where('seminar_id', seminar_id)
        .update(data)
    }
    validation_email(db: knex, email: any) {
        return db('sd_users_seminar')
            .select('*')
            .where('email', email)
    }
    check_data_by_seminar_id(db: knex, seminar_id: any) {
        return db('sd_users_seminar')
        .select('*')
        .where('seminar_id', seminar_id)
    }
    remove_by_seminar_id(db: knex, seminar_id: any) {
            return db('sd_users_seminar')
            .where('seminar_id', seminar_id)
            .del()
    }
    filter_data(db: knex,filter: any) { 
            try {
                        const keyword = filter.keyword || null; 
                        const seminar_id= filter.seminar_id|| null; 
                        const title_id = filter.title_id|| null; 
                        const email= filter.email|| null; 
                        const start= filter.start|| null; 
                        const end = filter.end|| null;  
                        const page= filter.pages|| 1; 
                        const isCount = filter.isCount|| null; 
                        const orderBy = filter.orderBy|| null; 
                        const limit = filter.limit|| null; 
                        const perpage = filter.perpage || 50; 
                        const status = filter.status || 1; 
                        console.log(`filter_title_users_seminar filter=>`, filter); 
                        let query = db('seminar_title as s');
                            query = query.innerJoin('sd_users_narrator as u', 'u.narrator_id', 's.narrator_id');  
                            query = query.leftJoin('seminarregister as r', 'r.seminar_id', 's.id'); 
                            query = query.leftJoin('sd_users_seminar as us', 'us.seminar_id', 'r.seminar_id');  
                            
                        if(isCount==1){
                            query = query.select('s.id as idx');
                        }else{ 
                            query = query.select('s.id as idx');   
                            query = query.select('u.firstname');   
                            query = query.select('u.lastname');   
                            query = query.select('u.fullname');   
                            query = query.select('u.nickname');    
                            query = query.select('u.date');   
                            // query = query.select('u.username');   
                            // query = query.select('u.password');   
                            query = query.select('u.email');     
                        
                        } 
                        query = query.where('us.status', status);   
                        if (seminar_id=="" || seminar_id==null){}else{  
                            query = query.andWhere('us.seminar_id', seminar_id);
                        }  
                        if (title_id==null || title_id==0){}else{  
                            query = query.andWhere('t.id', title_id);   
                        } 
                        if (keyword!=null) { 
                            query = query.andWhere('t.title', 'like', `%${keyword}%`); 
                        } 
                        if (start == null || end == null) {}else{ 
                            query = query.andWhereBetween("t.datetime_start", [start, end]); 
                        }  
                        query = query.groupBy('us.seminar_id');
                        if (seminar_id == null || seminar_id == 0) {
                            if (orderBy!="" || orderBy!==null) {  
                                    if (orderBy== 'desc') {  
                                        query = query.orderBy('us.seminar_id', 'desc');
                                    }else{
                                        query = query.orderBy('us.seminar_id', 'asc');
                                    }
                            }else{
                                query = query.orderBy('us.seminar_id', 'desc');
                            } 
                        } else { 
                                query = query.orderBy('us.seminar_id', 'asc');
                        }  
                        query = query.limit(perpage);
                        query = query.offset(perpage * (page - 1));
                    console.log(`query=>`, query); 
                return query;
            } catch (err:any) {
                console.log(`err=>`, err); 
                if (err) { 
                    process.exit(1)
                } 
            }
    }  
}