import * as knex from 'knex';
/**************************************************/    
export class SeminarDetailModel {
    create_data(db: knex, data: any) {
        return db('seminar_detail')
        .insert(data)
    }
    last_id(db: knex) {
        return db('seminar_detail')
        .select('id')
        .orderBy('id','desc')
        .limit(1)
    }
    update_by_id(db: knex, id: any, data: any) {
        return db('seminar_detail')
        .where('id', id)
        .update(data)
    }
    check_data_by_id(db: knex, id: any) {
        return db('seminar_detail')
        .select('*')
        .where('id', id)
    }
    remove_by_id(db: knex, id: any) {
            return db('seminar_detail')
            .where('id', id)
            .del()
    }
    filter_data(db: knex, filter: any) {
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
                        query = query.select('t.title as title_name');   
                        query = query.select('t.detail as title_detail');  
                        query = query.select('t.url as title_url');  
                        query = query.select('s.startdate as startdate'); 
                        query = query.select('s.enddate as enddate'); 
                        query = query.select('u.firstname');   
                        query = query.select('u.lastname');   
                        query = query.select('u.fullname as narrator_fullname');   
                        query = query.select('u.nickname as narrator_nickname');     
                        query = query.select('u.email');    
                    } 
                    query = query.where('s.status', status);   
                    if (id!="" || id!==0) {  
                        query = query.andWhere('s.id ', id );   
                    }  
                    if (title_id!="" || title_id!==0) {  
                        query = query.andWhere('t.id', title_id);   
                    }  
                    if (email!="" || email!==null) {    
                        query = query.andWhere('u.email', 'like', `%${email}%`); 
                    } 
                    if (keyword!=null) { 
                        query = query.andWhere('s.title', 'like', `%${keyword}%`); 
                    } 
                    
                    if (start == null || end == null) {}else{ 
                        query = query.andWhereBetween("s.startdate", [start, end]); 
                    } 
                    if (start_event_end!=null && end_event_end!=null) {  
                        query = query.andWhereBetween("s.enddate", [start, end]); 
                    }  
                    query = query.groupBy('s.id');
                    if (id!="" || id!==0) {  
                            query = query.orderBy('s.id', 'asc');
                    }else{
                            if (orderBy!="" || orderBy!==null) {  
                                    if (orderBy== 'desc') {  
                                    query = query.orderBy('s.id', 'desc');
                                    }else{
                                    query = query.orderBy('s.id', 'asc');
                                    }
                            }else{
                                    query = query.orderBy('u.id', 'desc');
                            } 
    
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