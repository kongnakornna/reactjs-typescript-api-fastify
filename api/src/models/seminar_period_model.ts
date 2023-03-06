import * as knex from 'knex';
/**************************************************/    
export class SeminarPeriodModel {
    create_data(db: knex, data: any) {
        return db('seminar_period')
        .insert(data)
    }
    last_period_id(db: knex) {
        return db('seminar_period')
        .select('period_id')
        .orderBy('period_id','desc')
        .limit(1)
    }
    update_by_period_id(db: knex, period_id: any, data: any) {
        return db('seminar_period')
        .where('period_id', period_id)
        .update(data)
    }
    check_data_by_period_id(db: knex, period_id: any) {
        return db('seminar_period')
        .select('*')
        .where('period_id', period_id)
    }
    check_email(db: knex, email: any) {
        return db('seminar_period')
        .select('*')
        .where('email', email)
    }
    remove_by_period_id(db: knex, period_id: any) {
            return db('seminar_period')
            .where('period_id', period_id)
            .del()
    }
    filter_data(db: knex, filter: any) {
        try {
            const keyword = filter.keyword;
            const period_id = filter.period_id;
            const narrator_period_id = filter.narrator_period_id;
            const title_id = filter.title_id; 
            const start = filter.start;
            const end = filter.end;
            const start_event_end = filter.start_event_end;
            const end_event_end = filter.end_event_end;
            const page = filter.pages;
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
            let query = db('seminar_period as s');  
            if (isCount == 1) {
                query = query.select('s.period_id as period_idx');
            } else {
                query = query.select('s.*'); 
                    
            }
                query = query.where('s.status', status);
            if (period_id==null){}else{  
                query = query.andWhere('s.period_id', period_id);
            } 
            if (title_id==null){}else{  
                query = query.andWhere('s.title_id', title_id);
            } 
            if (keyword!=null) { 
                query = query.andWhere('s.seminar_name', 'like', `%${keyword}%`); 
            } 
            if (start == null || end == null) {}else{ 
                query = query.andWhereBetween("s.start ", [start, end]); 
            }
            if (start_event_end == null || end_event_end == null) {}else{ 
                query = query.andWhereBetween("s.end", [start_event_end, end_event_end]); 
            }  
            if (period_id == null) {
                if (orderBy == null) {
                    query = query.orderBy('s.period_id', 'desc');
                } else {
                    if (orderBy == 'desc') {
                        query = query.orderBy('s.period_id', 'desc');
                    } else {
                        query = query.orderBy('s.period_id', 'asc');
                    }
                }
            } else {
                query = query.orderBy('s.period_id', 'asc');
            }
            if (perpage == null && page == null) { } else {
                query = query.limit(perpage);
                query = query.offset(perpage * (page - 1));
            }
            return query;
        } catch (err: any) {
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
    update_by_id_event_log(db: knex, id: any, data: any) {
        return db('seminar_period_event_log')
        .where('id', id)
        .update(data)
    } 
    update_by_4id_event_log(db: knex, period_id: number,seminar_id: number,narrator_id: number,seminar_title_id: number, data: any) {
        return db('seminar_period_event_log')
        .where('period_id', period_id)
        .andWhere('seminar_id', seminar_id)
        .andWhere('narrator_id', narrator_id)
        .andWhere('seminar_title_id', seminar_title_id) 
        .update(data)
    }
    remove_by_id_event_log(db: knex, id: any) {
            return db('seminar_period_event_log')
            .where('id', id)
            .del()
    }
    remove_by_id_period_event_log(db: knex, period_id: any) {
            return db('seminar_period_event_log')
            .where('period_id', period_id)
            .del()
    }
    check_data_by_seminar_period_event_log_id(db: knex, seminar_title_id: any, seminar_id: any, datetime: any) {
        return db('seminar_period_event_log')
            .select('*')
            .where('seminar_title_id', seminar_title_id)
            .andWhere('seminar_id', seminar_id) 
            .andWhere("datetime", { datetime: datetime ? `%${datetime}%` : "%" }); 
    }
    filter_data_log(db: knex, filter: any) {
            try {
                const keyword = filter.keyword; 
                const id= filter.id; 
                const title_id = filter.title_id; 
                const seminar_id= filter.seminar_id; 
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
                        query = query.select('t.datetime_start as startdate'); 
                        query = query.select('t.datetime_end as enddate');  
                        //query = query.select("CONCAT(u.firstname,' ',u.lastname) as narrator_name");
                        query = query.select('u.fullname as narrator_fullname');   
                        query = query.select('u.nickname as narrator_nickname'); 
                        query = query.select('u.firstname as narrator_firstname'); 
                        query = query.select('u.lastname as narrator_lastname');     
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
    filter_seminar_period_event_log(db: knex,filter: any) {
        try {
                const keyword = filter.keyword; 
                const id= filter.id; 
                const title_id = filter.title_id; 
                const seminar_id= filter.seminar_id; 
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
                        query = query.select('t.datetime_start as startdate'); 
                        query = query.select('t.datetime_end as enddate');  
                        //query = query.select("CONCAT(u.firstname,' ',u.lastname) as narrator_name");
                        query = query.select('u.fullname as narrator_fullname');   
                        query = query.select('u.nickname as narrator_nickname'); 
                        query = query.select('u.firstname as narrator_firstname'); 
                        query = query.select('u.lastname as narrator_lastname'); 
                        query = query.select('us.seminar_id as seminar_id'); 
                        query = query.select('us.firstname as firstname_seminar'); 
                        query = query.select('us.lastname as lastname_seminar'); 
                        query = query.select('us.phonenumber as phonenumber_seminar'); 
                        query = query.select('us.email as email_seminar'); 
                        //query = query.select("CONCAT(us.firstname,' ',us.lastname) as fullname_semina");    
                    } 
                    query = query.where('us.status', status);   
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