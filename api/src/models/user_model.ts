import * as knex from 'knex';
/**************************************************/    
export class UserModel {
  create(db: knex, data: any) {
      return db('sd_users')
        .insert(data)
    }
  lastidread(db: knex) {
      return db('sd_users')
        .select('user_id')
        .orderBy('user_id','desc')
        .limit(1)
    }
  updateuid(db: knex, userId: any, data: any) {
      return db('sd_users')
        .where('user_id', userId)
        .update(data)
    }
  validation_email(db: knex, email: any) {
      return db('sd_users')
        .select('email')
        .where('email', email)
      }
  validation_username(db: knex, username: any) {
      return db('sd_users')
        .select('username')
        .where('username', username)
      }
  validation_network_id(db: knex, network_id: any) {
      return db('sd_users')
        .select('network_id')
        .where('network_id', network_id)
      }
  where_sd_users_profile_id(db: knex, profile_id: any) {
          return db('sd_users')
              .select('user_id', 'firstname', 'lastname', 'email')
              .select('username', 'level', 'status', 'network_id')
              .select('date')
          .where('profile_id', profile_id)
      }
  where_user_update_password(db: knex, username: any, data: any) {
          return db('sd_users')
          .where('username', username)
          .update(data)
    }
  where_user_update_password_or(db: knex, datareset: any, data: any) {
          return db('sd_users')
          .where('username', datareset)
          .orWhere('email', datareset)
          .update(data)
    }
  where_user_email_update_password(db: knex, email: any, data: any) {
          return db('sd_users')
          .where('email', email)
          .update(data)
      }
  where_user_update_mail(db: knex, emailold: any, data: any) {
        return db('sd_users')
        .where('email', emailold)
        .update(data)
      }
  where_sd_users_profile_id_update(db: knex, user_id: any, data: any) {
          return db('sd_users')
          .where('user_id', user_id)
          .update(data)
      }
  where_sd_users_profile_id_remove(db: knex, profile_id: any) {
          return db('sd_users')
          .where('profile_id', profile_id)
          .del()
    }
  reset_password(db: knex, email: any) {
      return db('sd_users')
        .select('user_id','profile_id', 'firstname', 'lastname', 'email', 'username', 'level')
        .where('email', email)
      }
  sd_users_profile(db: knex, user_id: any) {
      return db('sd_users')
        .select('user_id', 'firstname', 'lastname', 'email', 'username', 'level', 'status', 'network_id')
        .where('user_id', user_id)
    }
  login(db: knex, username: any, password: any) {
      return db('sd_users')
        .select('user_id','profile_id', 'firstname', 'lastname', 'email', 'username', 'level')
        .where('username', username)
        .where('password', password)
        .where('status', 1)
    }
  resetPassword(db: knex, datareset: any) {
      return db('sd_users')
        .select('user_id', 'firstname', 'lastname')
        .select('email', 'username', 'level')
        .where('username', datareset)
        .orWhere('email', datareset)
    }
  chkemailorusername(db: knex, datareset: any) {
      return db('sd_users')
        .select('user_id', 'firstname', 'lastname')
        .select('email', 'username', 'level')
        .where('username', datareset)
        .orWhere('email', datareset)
      }

  resetpwd(db: knex, datareset: any) {
      return db('sd_users')
        .select('user_id', 'firstname', 'lastname', 'email', 'username', 'level')
        .where('username', datareset)
        .orWhere('email', datareset)
    }

  read(db: knex) {
      return db('sd_users')
        .select('user_id', 'firstname', 'lastname', 'email')
        .orderBy('user_id','desc')
        //.limit(3)
        // .offset(5)
        
    }

  search(db: knex, query: any) {
      const _query = '%' + query + '%'
      return db('sd_users')
        .select('user_id', 'firstname', 'lastname', 'email')
        .where('firstname', 'like', _query)
        .orderBy('user_id')
    }

  update(db: knex, userId: any, data: any) {
      return db('sd_users')
        .where('user_id', userId)
        .update(data)
    }

  remove(db: knex, userId: any) {
      return db('sd_users')
        .where('user_id', userId)
        .del()
    }

  // Raw query
  rawQuery(db: knex, userId: any, firstName: any) {
      const sql = `
      SELECT user_id, firstname, lastname,email
      FROM users
      WHERE user_id=? AND firstname=?
      ORDER BY firstname DESC
      `
      return db.raw(sql, [userId, firstName])
    }

  test(db: knex) {
          return db('sd_users as u')
              .join('sd_users_profile as p', 'u.user_id', 'p.user_id')
              // .select('u.*')
              .select('u.user_id', 'u.firstname', 'u.lastname', 'u.email', 'u.date')
              .select('p.email as mail')
              // .where('users.user_id!=','')
              .orderBy('u.user_id', 'desc')
              .limit(3)
              .offset(5)
      }
  whereRawQuery(db: knex) {
      return db('sd_users')
        .select('*')
        .whereRaw('group')
    }

  filter_user(db: knex, filter: any) {
    try {
      const keyword = filter.keyword;
      const user_id = filter.user_id;
      const type_id = filter.level;
      const level = filter.level;
      const start = filter.start;
      const end = filter.end;
      const page = filter.pages;
      const isCount = filter.isCount;
      const orderBy = filter.orderBy;
      const limit = filter.limit;
      const email = filter.email;
      const perpage = filter.perpage || filter.sizepsge;
      if (isCount == 0) {
        console.log(`rows filter `, filter);
        console.log(`data keyword `, keyword);
        console.log(`rows isCount `, isCount);
      } else {
        console.log(`data filter `, filter);
        console.log(`data keyword `, keyword);
        console.log(`data isCount `, isCount);
      }
      let query = db('sd_users as u');
          query = query.innerJoin('user_permission_type as t', 't.permission_type_id', 'u.permission_type_id');
        //query = query.leftJoin('sd_user_roles as r', 'r.permission_type_id', 't.permission_type_id'); 
      if (isCount == 1) {
        query = query.select('u.user_id AS idx');
      } else {
        query = query.select('u.user_id as idx');
        query = query.select('u.firstname');
        query = query.select('u.lastname');
        //query = query.select("CONCAT(u.firstname,' ',u.lastname) AS name");
        query = query.select('u.fullname');
        query = query.select('u.nickname');
        query = query.select('u.idcard');
        query = query.select('u.date');
        // query = query.select('u.username');   
        // query = query.select('u.password');   
        query = query.select('u.email');
        query = query.select('u.level');
        // query = query.select('u.status');   
        // query = query.select('u.network_id');   
        query = query.select('u.avatar');
        query = query.select('u.remark');
        query = query.select('u.infomation_agree_status');
        query = query.select('u.gender');
        query = query.select('u.birthday');
        // query = query.select('u.last_sign_in');   
        // query = query.select('u.online_status');   
        // query = query.select('u.mesage');   
        // query = query.select('u.password_temp');   
        // query = query.select('u.profile_id');   
        // query = query.select('u.network_type_id');   
        // query = query.select('u.public');   
        // query = query.select('u.isActive');   
        // query = query.select('u.permission_type_id');   
        query = query.select('t.type_name as usertype');
                    
      }
      query = query.where('s.status', 1);
      if (user_id== null) { }else{
                    
      }
      if (type_id== null) { }else{
        query = query.andWhere('t.permission_type_id', type_id);
      }
      if (level== null) { }else{
        query = query.andWhere('u.level', level);
      } 
      if (email == null) {}else{ 
          query = query.andWhere('u.email', 'like', `%${email}%`); 
      } 
      if (keyword!=null) { 
          query = query.andWhere('u.firstname', 'like', `%${keyword}%`); 
      } 
      if (start == null || end == null) {}else{ 
          query = query.andWhereBetween("u.date ", [start, end]); 
      } 
      if (user_id == null) {
        if (orderBy == null) {
          query = query.orderBy('u.user_id', 'desc');
        } else {
          if (orderBy == 'desc') {
            query = query.orderBy('u.user_id', 'desc');
          } else {
            query = query.orderBy('u.user_id', 'asc');
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