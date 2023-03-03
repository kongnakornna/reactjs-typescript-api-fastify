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
            .select('seminar_id,firstname,lastname,phonenumber,email,create,status,active,activedate')
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
                const keyword = filter.keyword; 
                const seminar_id= filter.seminar_id; 
                const narrator_seminar_id = filter.narrator_seminar_id;  
                const email= filter.email;
                const start= filter.start;
                const end = filter.end;   
                const page= filter.pages; 
                const isCount = filter.isCount;
                const orderBy = filter.orderBy;
                const limit = filter.limit; 
                const perpage = filter.perpage || filter.sizepsge; 
                const status = filter.status || 1; 
                if (isCount == 0) {
                    console.log(`rows filter `, filter); 
                    console.log(`data keyword `, keyword);
                    console.log(`rows isCount `, isCount); 
                } else {
                    console.log(`data filter `, filter); 
                    console.log(`data keyword `, keyword);
                    console.log(`data isCount `, isCount); 
                }
                let query = db('sd_users_seminar as s'); 
                    if(isCount==1){
                        query = query.select('s.seminar_id');
                    }else{ 
                        query = query.select('s.seminar_id'); 
                        query = query.select('u.firstname');   
                        query = query.select('u.lastname');  
                        query = query.select("CONCAT(u.firstname,' ',u.lastname) AS narrator_name");
                        query = query.select('u.phonenumber');   
                        query = query.select('u.status');    
                        query = query.select('u.create');     
                        query = query.select('u.email');     
                    
                    } 
                    query = query.where('1=1');
                    query = query.andWhere('s.status', status);   
                    if (seminar_id!="" || seminar_id!==0) {  
                    query = query.andWhere('s.seminar_id ', seminar_id );   
                    }  
                    if (narrator_seminar_id!="" || narrator_seminar_id!==0) {  
                    query = query.andWhere('u.narrator_seminar_id', narrator_seminar_id);   
                    }  
                    if (email!="" || email!==null) {  
                    query.andWhere("u.email", { keyword: email ? `%${email}%` : "%" });   
                    } 
                    if (keyword!=null) { 
                        query.andWhere("s.title", { keyword: keyword ? `%${keyword}%` : "%" }); 
                    } 
                    if (start!=null && end!=null) { 
                        query.andWhere("u.create  BETWEEN '" + start + "' AND '" + end + "'"); 
                    }   
                    if (seminar_id!="" || seminar_id!==0) {  
                            query = query.orderBy('s.seminar_id', 'asc');
                    }else{
                            if (orderBy!="" || orderBy!==null) {  
                                    if (orderBy== 'desc') {  
                                    query = query.orderBy('s.seminar_id', 'desc');
                                    }else{
                                    query = query.orderBy('s.seminar_id', 'asc');
                                    }
                            }else{
                                    query = query.orderBy('s.seminar_id', 'desc');
                            } 
    
                    }
                    if (perpage!="" && page!="") {   
                        query = query.limit(perpage);
                        query = query.offset(page);
                    }else{
                        if (limit!="" || limit!==0) {  
                            query = query.limit(limit);  
                        } 
                    } 
                    if(isCount==1){ 
                        console.log(`query `, query);
                        return query;
                    }else{ 
                        console.log(`query `, query);
                        return  query;   
                    }  
    }  
}