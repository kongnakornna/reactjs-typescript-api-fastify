import * as knex from 'knex';
/**************************************************/    
export class SeminarTitleModel {
    create_data(db: knex, data: any) {
        return db('seminar_title')
        .insert(data)
    }
    last_id(db: knex) {
        return db('seminar_title')
        .select('id')
        .orderBy('id','desc')
        .limit(1)
    }
    update_by_id(db: knex, id: any, data: any) {
        return db('seminar_title')
        .where('id', id)
        .update(data)
    }
    check_data_by_id(db: knex, id: any) {
        return db('seminar_title')
        .select('*')
        .where('id', id)
    }
    check_email(db: knex, email: any) {
        return db('seminar_title')
        .select('*')
        .where('email', email)
    }
    remove_by_id(db: knex, id: any) {
            return db('seminar_title')
            .where('id', id)
            .del()
    }
    filter_data(db: knex, filter: any) {
        try {
            const keyword = filter.keyword;
            const id = filter.id;
            const narrator_id = filter.narrator_id;
            const location = filter.location;
            const province = filter.province;
            const telephone = filter.telephone;
            const email = filter.email;
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
            let query = db('seminar_title as s');
                query = query.innerJoin('sd_users_narrator as u', 'u.narrator_id', 's.narrator_id');
            
            if (isCount == 1) {
                query = query.select('s.id as idx');
            } else {
                query = query.select('s.*');
                query = query.select('u.firstname');
                query = query.select('u.lastname');
                //query = query.select("CONCAT(u.firstname,' ',u.lastname) AS narrator_name");
                query = query.select('u.fullname');
                query = query.select('u.nickname');
                query = query.select('u.date');
                query = query.select('u.email');
                    
            }
                query = query.where('s.status', status);
            if (id==null){}else{  
                query = query.andWhere('s.id ', id);
            }
            if (narrator_id==null){}else{  
                query = query.andWhere('u.narrator_id', narrator_id);
            }
            if (email==null){}else{   
                query = query.andWhere('u.email', 'like', `%${email}%`); 
            } 
            if (keyword!=null) { 
                query = query.andWhere('s.title', 'like', `%${keyword}%`); 
            } 
            if (start == null || end == null) {}else{ 
                query = query.andWhereBetween("u.datetime_start", [start, end]); 
            }
            if (start_event_end == null || end_event_end == null) {}else{ 
                query = query.andWhereBetween("u.datetime_end", [start_event_end, end_event_end]); 
            }  
            if (id == null) {
                if (orderBy == null) {
                    query = query.orderBy('u.id', 'desc');
                } else {
                    if (orderBy == 'desc') {
                        query = query.orderBy('s.id', 'desc');
                    } else {
                        query = query.orderBy('s.id', 'asc');
                    }
                }
            } else {
                query = query.orderBy('s.id', 'asc');
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
}