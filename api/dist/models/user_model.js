"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.UserModel=void 0;var UserModel=function(){function e(){}return e.prototype.create=function(e,r){return e("sd_users").insert(r)},e.prototype.lastidread=function(e){return e("sd_users").select("user_id").orderBy("user_id","desc").limit(1)},e.prototype.updateuid=function(e,r,s){return e("sd_users").where("user_id",r).update(s)},e.prototype.validation_email=function(e,r){return e("sd_users").select("email").where("email",r)},e.prototype.validation_username=function(e,r){return e("sd_users").select("username").where("username",r)},e.prototype.validation_network_id=function(e,r){return e("sd_users").select("network_id").where("network_id",r)},e.prototype.where_sd_users_profile_id=function(e,r){return e("sd_users").select("user_id","firstname","lastname","email").select("username","level","status","network_id").select("date").where("profile_id",r)},e.prototype.where_user_update_password=function(e,r,s){return e("sd_users").where("username",r).update(s)},e.prototype.where_user_update_password_or=function(e,r,s){return e("sd_users").where("username",r).orWhere("email",r).update(s)},e.prototype.where_user_email_update_password=function(e,r,s){return e("sd_users").where("email",r).update(s)},e.prototype.where_user_update_mail=function(e,r,s){return e("sd_users").where("email",r).update(s)},e.prototype.where_sd_users_profile_id_update=function(e,r,s){return e("sd_users").where("user_id",r).update(s)},e.prototype.where_sd_users_profile_id_remove=function(e,r){return e("sd_users").where("profile_id",r).del()},e.prototype.reset_password=function(e,r){return e("sd_users").select("user_id","profile_id","firstname","lastname","email","username","level").where("email",r)},e.prototype.sd_users_profile=function(e,r){return e("sd_users").select("user_id","firstname","lastname","email","username","level","status","network_id").where("user_id",r)},e.prototype.login=function(e,r,s){return e("sd_users").select("user_id","profile_id","firstname","lastname","email","username","level").where("username",r).where("password",s).where("status",1)},e.prototype.resetPassword=function(e,r){return e("sd_users").select("user_id","firstname","lastname").select("email","username","level").where("username",r).orWhere("email",r)},e.prototype.chkemailorusername=function(e,r){return e("sd_users").select("user_id","firstname","lastname").select("email","username","level").where("username",r).orWhere("email",r)},e.prototype.resetpwd=function(e,r){return e("sd_users").select("user_id","firstname","lastname","email","username","level").where("username",r).orWhere("email",r)},e.prototype.read=function(e){return e("sd_users").select("user_id","firstname","lastname","email").orderBy("user_id","desc")},e.prototype.search=function(e,r){r="%"+r+"%";return e("sd_users").select("user_id","firstname","lastname","email").where("firstname","like",r).orderBy("user_id")},e.prototype.update=function(e,r,s){return e("sd_users").where("user_id",r).update(s)},e.prototype.remove=function(e,r){return e("sd_users").where("user_id",r).del()},e.prototype.rawQuery=function(e,r,s){return e.raw("\n      SELECT user_id, firstname, lastname,email\n      FROM users\n      WHERE user_id=? AND firstname=?\n      ORDER BY firstname DESC\n      ",[r,s])},e.prototype.test=function(e){return e("sd_users as u").join("sd_users_profile as p","u.user_id","p.user_id").select("u.user_id","u.firstname","u.lastname","u.email","u.date").select("p.email as mail").orderBy("u.user_id","desc").limit(3).offset(5)},e.prototype.whereRawQuery=function(e){return e("sd_users").select("*").whereRaw("group")},e.prototype.filter_user=function(e,r){try{var s=r.keyword,t=r.user_id,u=r.level,n=r.level,o=r.start,i=r.end,a=r.pages,l=r.isCount,d=r.orderBy,_=(r.limit,r.perpage||r.sizepsge);0==l?(console.log("rows filter ",r),console.log("data keyword ",s),console.log("rows isCount ",l)):(console.log("data filter ",r),console.log("data keyword ",s),console.log("data isCount ",l));var p=(p=e("sd_users as u")).innerJoin("user_permission_type as t","t.permission_type_id","u.permission_type_id");return p=(p=1==l?p.select("u.user_id AS idx"):(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=p.select("u.user_id as idx")).select("u.firstname")).select("u.lastname")).select("u.fullname")).select("u.nickname")).select("u.idcard")).select("u.date")).select("u.email")).select("u.level")).select("u.avatar")).select("u.remark")).select("u.infomation_agree_status")).select("u.gender")).select("u.birthday")).select("t.type_name as usertype")).where("s.status",1),null!=u&&(p=p.andWhere("t.permission_type_id",u)),null!=n&&(p=p.andWhere("u.level",n)),null==o&&null==i||p.andWhere("u.date BETWEEN '"+o+"' AND '"+i+"'"),p=null==t?null==d||"desc"==d?p.orderBy("u.user_id","desc"):p.orderBy("u.user_id","asc"):p.orderBy("s.id","asc"),p=null==_&&null==a?p:(p=p.limit(_)).offset(a)}catch(e){console.log("err=>",e),e&&process.exit(1)}},e}();exports.UserModel=UserModel;