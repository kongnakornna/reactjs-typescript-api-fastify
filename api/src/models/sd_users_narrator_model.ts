import * as knex from 'knex';
/**************************************************/    
export class SdusersNarratorModel {
    create_data(db: knex, data: any) {
        return db('sd_users_narrator')
        .insert(data)
    }
    last_narrator_id(db: knex) {
        return db('sd_users_narrator')
        .select('narrator_id')
        .orderBy('narrator_id','desc')
        .limit(1)
    }
    update_by_narrator_id(db: knex, narrator_id: any, data: any) {
        return db('sd_users_narrator')
        .where('narrator_id', narrator_id)
        .update(data)
    }
    validation_email(db: knex, email: any) {
        return db('sd_users_narrator')
        .select('email')
        .where('email', email)
    } 
    check_data_by_narrator_id(db: knex, narrator_id: any) {
        return db('sd_users_narrator')
        .select('*')
        .where('narrator_id', narrator_id)
    }
    remove_by_narrator_id(db: knex, narrator_id: any) {
            return db('sd_users_narrator')
            .where('narrator_id', narrator_id)
            .del()
    }
    last_id(db: knex) {
        return db('sd_users_narrator')
        .select('narrator_id')
        .orderBy('narrator_id','desc')
        .limit(1)
    }
    activate(db: knex, narrator_id: any, data: any) {
        return db('sd_users_narrator')
        .where('narrator_id', narrator_id)
        .update(data)
    }
    login(db: knex, username: any, password: any) {
       return db('sd_users_narrator')
            .select('firstname,lastname,fullname,nickname,idcard,date,username,email,avatar,remark,gender,birthday,last_sign_in,status')
            .where('username', username)
            .andWhere('password', password)
    }
    filter_data(db: knex,filter: any) {
			try {
					const keyword = filter.keyword; 
                    const seminar_id= filter.seminar_id; 
					const narrator_id= filter.narrator_id; 
					const narrator_narrator_id = filter.narrator_narrator_id;  
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
					let query = db('sd_users_narrator as u'); 
                    if (isCount == 1) {
                        query = query.select('u.narrator_id');
                    } else {
                        query = query.select('u.narrator_id');
                        query = query.select('u.firstname');
                        query = query.select('u.lastname');
                        //query = query.select("CONCAT(u.firstname,' ',u.lastname) AS narrator_name");
                        query = query.select('u.fullname');
                        query = query.select('u.nickname');
                        query = query.select('u.fullname');
                        query = query.select('u.idcard');
                        query = query.select('u.status');
                        query = query.select('u.date');
                        query = query.select('u.avatar');
                        query = query.select('u.gender');
                        query = query.select('u.birthday');
                        query = query.select('u.last_sign_in');
                        query = query.select('u.email');
                    
                    }
                    query = query.where('us.status', status);   
                    if (seminar_id=="" || seminar_id==null){}else{  
                        query = query.andWhere('us.seminar_id', seminar_id);
                    }   
                    if (keyword!=null) { 
                            query = query.andWhere('u.firstname', 'like', `%${keyword}%`); 
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