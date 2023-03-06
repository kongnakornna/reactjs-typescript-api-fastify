import * as knex from 'knex';
/**************************************************/    
export class SeminarModels {
    seminar_register(db: knex, data: any) {
        return db('seminarregister')
        .insert(data)
    }
    last_id(db: knex) {
        return db('seminarregister')
        .select('id')
        .orderBy('id','desc')
        .limit(1)
    }
    update_by_seminar_id(db: knex,seminar_title_id: any, seminar_id: any, data: any) {
        return db('seminarregister')
        .where('seminar_title_id', seminar_title_id)
        .andWhere('seminar_id', seminar_id) 
        .update(data)
    }
    check_data_by_id(db: knex, seminar_title_id: any, seminar_id: any) {
        return db('seminarregister')
            .select('*')
            .where('seminar_title_id', seminar_title_id)
            .andWhere('seminar_id', seminar_id) 
    }
    check_validate(db: knex, seminar_title_id: any, seminar_id: any, period_id: any) {
        console.warn(`db=>`, db);
        console.warn(`seminar_title_id=>`, seminar_title_id);
        console.warn(`seminar_id=>`, seminar_id);
        console.warn(`period_id=>`, period_id);
        return db('seminarregister as r')
            .select('r.*')
            .where('r.seminar_title_id', seminar_title_id)
            .andWhere('r.seminar_id', seminar_id) 
            .andWhere('r.period_id', period_id)
    }
    remove_by_seminar_id(db: knex, seminar_title_id: any, seminar_id: any) {
            return db('seminar_title as r')
            .where('r.eminar_title_id', seminar_title_id)
            .andWhere('r.seminar_id', seminar_id) 
            .del()
    }
    remove_by_id(db: knex, id: any) {
            return db('seminar_title')
            .where('id', id)
            .del()
    }
    filter_title(db: knex, filter: any) {
        try {
                const keyword = filter.keyword; 
                const title_id= filter.title_id; 
                const narrator_id = filter.narrator_id; 
                const location= filter.location; 
                const province= filter.province; 
                const telephone= filter.telephone;
                const email= filter.email;
                const start= filter.start;
                const end = filter.end;  
                const start_event_end = filter.start_event_end;  
                const end_event_end = filter.end_event_end; 
                const isCount = filter.isCount;
                const orderBy = filter.orderBy;
                const limit = filter.limit; 
                const page= filter.page || 1;
                const perpage = filter.perpage || 20; 
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
                let query = db('seminar_title as s');
                    query = query.leftJoin('sd_users_narrator as u', 'u.narrator_id', 's.narrator_id');   
                    if(isCount==1){
                        query = query.select('s.id as idx');
                    }else{ 
                        query = query.select('s.id as idx'); 
                        query = query.select('s.title');   
                        query = query.select('u.firstname');   
                        query = query.select('u.lastname');   
                        query = query.select('u.fullname');   
                        query = query.select('u.nickname');    
                        query = query.select('u.date');       
                        query = query.select('u.email');     
                        query = query.select('s.datetime_start as start');  
                        query = query.select('s.datetime_end as end');  
                    } 
                    query = query.where('u.status', status);   
                    if (title_id== null) { }else{
                        query = query.andWhere('s.id ', title_id );   
                    }  
                    if (narrator_id== null) { }else{
                        query = query.andWhere('u.narrator_id', narrator_id);   
                    }  
                    if (email== null) { }else{  
                        query = query.andWhere('u.emai', 'like', `%${email}%`); 
                    }  
                    if (keyword==null) { }else{ 
                         query = query.andWhere('s.title', 'like', `%${keyword}%`); 
                    } 
                    if (start==null && end==null) { }else{ 
                         query = query.whereBetween("s.datetime_start", [start, end]);  
                    }
                    if (start_event_end == null && end_event_end == null) { } else { 
                         query = query.whereBetween("s.datetime_end", [start_event_end, end_event_end]);  
                    }    
                    query = query.groupBy('s.id');   
                    if (title_id== null) {
                        if (orderBy== null) { 
                                query = query.orderBy('s.id', 'desc');   
                        }else{
                            if (orderBy== 'desc') {  
                                query = query.orderBy('s.id', 'desc');
                            }else{
                                query = query.orderBy('s.id', 'asc');
                            }   
                        } 
                    }else{   
                            query = query.orderBy('s.id', 'asc');
                    } 
                    query = query.limit(perpage);
                    query = query.offset(perpage * (page - 1));
            return query;
        } catch (err:any) {
            console.log(`err=>`, err); 
            if (err) { 
                process.exit(1)
            } 
        }
    }
    seminar_detail(db: knex, filter: any) {
        try {
            const title_id = filter.title_id;  
            let query = db('seminar_detail as s');  
                query = query.select('s.id as idx');    
                query = query.select('s.title as detail_name');     
                query = query.select('s.startdate as startdate'); 
                query = query.select('s.enddate as enddate');    
                query = query.where('s.seminar_title_id', title_id);   
                query = query.orderBy('s.id', 'asc');
            return query;
        } catch (err:any) {
            console.log(`err=>`, err); 
            if (err) { 
                process.exit(1)
            } 
        }
    }  
    filter_detail(db: knex, filter: any) {
        try {
                const keyword = filter.keyword; 
                const id= filter.id; 
                const title_id = filter.title_id; 
                const location= filter.location; 
                const province= filter.province; 
                const telephone= filter.telephone;
                const email= filter.email;
                const start= filter.start;
                const end = filter.end;  
                const start_event_end = filter.start_event_end;  
                const end_event_end = filter.end_event_end;  
                const page= filter.pages; 
                const isCount = filter.isCount;
                const orderBy = filter.orderBy;
                const limit = filter.limit; 
                const perpage = filter.perpage ||500; 
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
                let query = db('seminar_detail as s'); 
                    if(isCount==1){
                        query = query.select('s.id as idx');
                    }else{ 
                        query = query.select('s.id as idx');    
                        query = query.select('s.title as detail_name');     
                       // query = query.select('s.startdate as startdate'); 
                       // query = query.select('s.enddate as enddate');   
                    } 
                    query = query.where('s.status', status);   
                    if (id==null) { }else{
                    query = query.andWhere('s.id ', id );   
                    }  
                    if (title_id==null) { }else{
                    query = query.andWhere('t.id', title_id);   
                    }  
                    if (keyword==null) { }else{ 
                         query = query.andWhere('s.title', 'like', `%${keyword}%`); 
                    } 
                    if (start==null && end==null) { }else{ 
                         query = query.whereBetween("s.startdate", [start, end]);  
                    }
                    if (start_event_end == null && end_event_end == null) { } else { 
                         query = query.whereBetween("s.enddate", [start_event_end, end_event_end]);  
                    }  
                    query = query.groupBy('s.id'); 
                    if (id== null) {
                        if (orderBy== null) { 
                                query = query.orderBy('s.id', 'desc');
                        }else{
                            if (orderBy== 'desc') {  
                                query = query.orderBy('s.id', 'desc');
                            }else{
                                query = query.orderBy('s.id', 'asc');
                            }   
                        } 
                     }else{   
                            query = query.orderBy('s.id', 'asc');
                    } 
                if (perpage == null && page == null) { }else{   
                            query = query.limit(perpage);
                            query = query.offset(perpage * (page - 1));
                } 
            return query;
        } catch (err:any) {
            console.log(`err=>`, err); 
            if (err) { 
                process.exit(1)
            } 
        }
    }  
    filter_details(db: knex, filter: any) {
        try {
                const keyword = filter.keyword; 
                const id= filter.id; 
                const title_id = filter.title_id; 
                const location= filter.location; 
                const province= filter.province; 
                const telephone= filter.telephone;
                const email= filter.email;
                const start= filter.start;
                const end = filter.end;  
                const start_event_end = filter.start_event_end;  
                const end_event_end = filter.end_event_end;  
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
                let query = db('seminar_detail as s');
                    query = query.innerJoin('seminar_title as t', 't.id', 's.seminar_title_id'); 
                    query = query.innerJoin('sd_users_narrator as u', 'u.narrator_id', 't.narrator_id');  
                    if(isCount==1){
                        query = query.select('s.id as idx');
                    }else{ 
                        query = query.select('s.id as idx');   
                        query = query.select('t.title as title_name');  
                        query = query.select('s.title as detail_name');    
                        query = query.select('t.detail as title_detail');  
                        query = query.select('t.url as title_url');  
                        query = query.select('s.startdate as startdate'); 
                        query = query.select('s.enddate as enddate'); 
                        query = query.select('u.firstname');   
                        query = query.select('u.lastname');  
                        //query = query.select("CONCAT(u.firstname,' ',u.lastname) as narrator_name");
                        query = query.select('u.fullname as narrator_fullname');   
                        query = query.select('u.nickname as narrator_nickname');     
                        query = query.select('u.email');    
                    } 
                    query = query.where('s.status', status);   
                    if (id==null) { }else{
                    query = query.andWhere('s.id ', id );   
                    }  
                    if (title_id==null) { }else{
                    query = query.andWhere('t.id', title_id);   
                    }  
                    if (email==null) { }else{  
                        query = query.andWhere('u.email', 'like', `%${email}%`); 
                    } 
                    if (keyword==null) { }else{ 
                         query = query.andWhere('s.title', 'like', `%${keyword}%`); 
                    } 
                    if (start==null && end==null) { }else{ 
                         query = query.whereBetween("s.startdate", [start, end]);  
                    }  
                    if (start_event_end==null && end_event_end==null) { }else{
                        query = query.whereBetween("s.enddate", [start_event_end, end_event_end]);  
                    } 
                    query = query.groupBy('s.id');  
                    if (id== null) {
                        if (orderBy== null) { 
                               query = query.orderBy('s.id', 'desc');   
                        }else{
                            if (orderBy== 'desc') {  
                                query = query.orderBy('s.id', 'desc');
                            }else{
                                query = query.orderBy('s.id', 'asc');
                            }   
                        } 
                     }else{   
                            query = query.orderBy('s.id', 'asc');
                    } 
                if (perpage == null && page == null) { }else{   
                            query = query.limit(perpage);
                            query = query.offset(perpage * (page - 1));
                } 
            return query;
        } catch (err:any) {
            console.log(`err=>`, err); 
            if (err) { 
                process.exit(1)
            } 
        }
    }    
    filter_title_users_seminar(db: knex,filter: any) {
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
                    let query = db('sd_users_seminar as us');
                        query = query.innerJoin('seminarregister as rt', 'rt.seminar_id', 'us.seminar_id'); 
                        query = query.leftJoin('seminar_title as t', 't.id', 'rt.seminar_title_id'); 
                        query = query.leftJoin('sd_users_narrator as u', 'u.narrator_id', 't.narrator_id');  
                        /*******************/
                    if(isCount==1){
                        query = query.select('us.seminar_id');
                    }else{ 
                        query = query.select('us.seminar_id');   
                        query = query.select('t.id as title_id');   
                        query = query.select('t.title as title');  
                        query = query.select('t.location as location'); 
                        query = query.select('t.province as province');  
                        query = query.select('t.detail as title_detail');  
                        query = query.select('t.spake_time as spake_time');  
                        query = query.select('t.url as title_url');  
                        query = query.select('t.datetime_start as startdate'); 
                        query = query.select('t.datetime_end as enddate');                         
                        query = query.select('u.firstname as narrator_firstname');    
                        query = query.select('u.lastname as narrator_lastname');    
                        query = query.select('u.email as narrator_email');    
                        query = query.select('us.seminar_id as seminar_id'); 
                        query = query.select('us.firstname as firstname_seminar'); 
                        query = query.select('us.lastname as lastname_seminar'); 
                        query = query.select('us.phonenumber as phonenumber_seminar'); 
                        query = query.select('us.email as email_seminar'); 
                        //query = query.select("concat(us.firstname,' ',us.lastname) AS fullname_semina");   
                        //query = query.select("CONCAT(u.firstname,' ',u.lastname) as fullname_narrator");   
                    } 
                    /*******************/
                    query = query.where('us.status', status);   
                    if (seminar_id=="" || seminar_id==null){}else{  
                        query = query.andWhere('us.seminar_id', seminar_id);
                    }  
                    if (title_id==null || title_id==0){}else{  
                        query = query.andWhere('t.id', title_id);   
                    } 
                    if (keyword == null) { } else { 
                        query = query.andWhere('us.firstname', 'like', `%${keyword}%`);
                        query = query.orWhere('us.lastname', 'like', `%${keyword}%`);
                    }  
                    if (start == null || end == null) {}else{ 
                        query = query.whereBetween("t.datetime_start", [start, end]); 
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
        } catch (err: any) {
            console.error(err);
            console.log(`err=>`, err); 
            if (err) { 
                process.exit(1)
            } 
        }
    }
    addd_period_event_log(db: knex, data: any) {
        return db('seminar_period_event_log')
        .insert(data)
    }
    check_data_by_seminar_period_event_log_id(db: knex, seminar_title_id: any, seminar_id: any, datetime: any) {
        return db('seminar_period_event_log')
            .select('*')
            .where('seminar_title_id', seminar_title_id)
            .andWhere('seminar_id', seminar_id) 
            .andWhere("datetime", { datetime: datetime ? `%${datetime}%` : "%" }); 
    }
    filter_seminar_period_event_log(db: knex,filter: any) {
        try {
                const keyword = filter.keyword; 
                const id= filter.id; 
                const title_id = filter.title_id; 
                const seminar_id= filter.seminar_id; 
                const email= filter.email;
                const start= filter.start || 1;
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
                let query = db('seminar_period_event_log as l');
                    query = query.innerJoin('seminar_title as t', 't.id', 'l.seminar_title_id'); 
                    query = query.innerJoin('sd_users_seminar as us', 'us.seminar_id', 'l.seminar_id'); 
                    query = query.innerJoin('sd_users_narrator as u', 'u.narrator_id', 't.narrator_id');  
                    
                    if(isCount==1){
                        query = query.select('l.id as idx');
                    }else{ 
                        query = query.select('l.id as idx');   
                        query = query.select('t.title as title_name');  
                        //query = query.select('s.title as detail_name');  
                        //query = query.select('t.detail as title_detail');  
                        query = query.select('t.url as title_url');  
                        query = query.select('s.startdate as startdate'); 
                        query = query.select('s.enddate as enddate');  
                        //query = query.select("CONCAT(u.firstname,' ',u.lastname) as narrator_name");
                        query = query.select('u.fullname as narrator_fullname');   
                        query = query.select('u.nickname as narrator_nickname');     
                        query = query.select('us.seminar_id as seminar_id'); 
                        query = query.select('us.firstname as firstname_seminar'); 
                        query = query.select('us.lastname as lastname_seminar'); 
                        query = query.select('us.phonenumber as phonenumber_seminar'); 
                        query = query.select('us.email as email_seminar'); 
                        //query = query.select("CONCAT(us.firstname,' ',us.lastname) as fullname_semina");    
                    } 
                    query = query.where('u.status', status);   
                    if (seminar_id=="" || seminar_id==null){}else{  
                            query = query.andWhere('us.seminar_id', seminar_id);
                    } 
                    if (title_id==null){}else{  
                        query = query.andWhere('t.id', title_id);   
                    }   
                    if (email == null) { } else { 
                        query = query.andWhere('us.email', 'like', `%${email}%`); 
                    }  
                    if (seminar_id==null){}else{  
                        query = query.andWhere('us.seminar_id', seminar_id);   
                    }  
                    if (keyword==null){}else{   
                        query = query.andWhere('t.title', 'like', `%${keyword}%`); 
                    } 
                    if (start==null && end==null){}else{  
                        query = query.andWhereBetween("l.datetime", [start, end]); 
                    } 
                    query = query.groupBy('l.id');   
                    if (id == null) {
                            if (orderBy==null) {  
                                if (orderBy== 'desc') {  
                                    query = query.orderBy('l.id', 'desc');
                                }else{
                                    query = query.orderBy('l.id', 'asc');
                                }
                            }else{
                                    query = query.orderBy('l.id', 'desc');
                            } 
                    }else{   
                            query = query.orderBy('l.id', 'asc');
                    } 
                    if (perpage == null && page == null) { }else{   
                            query = query.limit(perpage);
                            query = query.offset(perpage * (page - 1));
                    }    
            return query;
        } catch (err:any) {
            console.log(`err=>`, err); 
            if (err) { 
                process.exit(1)
            } 
        }
    }
}