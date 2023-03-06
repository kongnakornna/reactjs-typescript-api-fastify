"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.SeminarPeriodModel=void 0;var SeminarPeriodModel=function(){function e(){}return e.prototype.create_data=function(e,r){return e("seminar_period").insert(r)},e.prototype.last_period_id=function(e){return e("seminar_period").select("period_id").orderBy("period_id","desc").limit(1)},e.prototype.update_by_period_id=function(e,r,t){return e("seminar_period").where("period_id",r).update(t)},e.prototype.check_data_by_period_id=function(e,r){return e("seminar_period").select("*").where("period_id",r)},e.prototype.check_email=function(e,r){return e("seminar_period").select("*").where("email",r)},e.prototype.remove_by_period_id=function(e,r){return e("seminar_period").where("period_id",r).del()},e.prototype.filter_data=function(e,r){try{var t=r.keyword,n=r.period_id,i=(r.narrator_period_id,r.title_id),s=r.start,a=r.end,o=r.start_event_end,l=r.end_event_end,d=r.pages,_=r.isCount,u=r.orderBy,c=(r.limit,r.perpage||r.sizepsge),m=r.status||1,p=(0==_?(console.log("rows filter ",r),console.log("data keyword ",t),console.log("rows isCount ",_)):(console.log("data filter ",r),console.log("data keyword ",t),console.log("data isCount ",_)),e("seminar_period as s"));return p=(p=1==_?p.select("s.period_id as period_idx"):p.select("s.*")).where("s.status",m),null!=n&&(p=p.andWhere("s.period_id",n)),null!=i&&(p=p.andWhere("s.title_id",i)),null!=t&&(p=p.andWhere("s.seminar_name","like","%".concat(t,"%"))),null!=s&&null!=a&&(p=p.andWhereBetween("s.start ",[s,a])),null!=o&&null!=l&&(p=p.andWhereBetween("s.end",[o,l])),p=null==n&&(null==u||"desc"==u)?p.orderBy("s.period_id","desc"):p.orderBy("s.period_id","asc"),p=null==c&&null==d?p:(p=p.limit(c)).offset(c*(d-1))}catch(e){console.log("err=>",e),e&&process.exit(1)}},e.prototype.addd_period_event_log=function(e,r){return e("seminar_period_event_log").insert(r)},e.prototype.update_by_id_event_log=function(e,r,t){return e("seminar_period_event_log").where("id",r).update(t)},e.prototype.update_by_4id_event_log=function(e,r,t,n,i,s){return e("seminar_period_event_log").where("period_id",r).andWhere("seminar_id",t).andWhere("narrator_id",n).andWhere("seminar_title_id",i).update(s)},e.prototype.remove_by_id_event_log=function(e,r){return e("seminar_period_event_log").where("id",r).del()},e.prototype.remove_by_id_period_event_log=function(e,r){return e("seminar_period_event_log").where("period_id",r).del()},e.prototype.check_data_by_seminar_period_event_log_id=function(e,r,t,n){return e("seminar_period_event_log").select("*").where("seminar_title_id",r).andWhere("seminar_id",t).andWhere("datetime",{datetime:n?"%".concat(n,"%"):"%"})},e.prototype.filter_data_log=function(e,r){try{var t=r.keyword,n=r.id,i=r.title_id,s=r.seminar_id,a=r.email,o=r.start||1,l=r.end,d=r.pages,_=r.isCount,u=r.orderBy,c=(r.limit,r.perpage||r.sizepsge),m=r.status||1,p=(0==_?(console.log("rows filter ",r),console.log("data keyword ",t),console.log("rows isCount ",_)):(console.log("data filter ",r),console.log("data keyword ",t),console.log("data isCount ",_)),e("seminar_period_event_log as l"));return p=(p=(p=p.innerJoin("seminar_title as t","t.id","l.seminar_title_id")).innerJoin("sd_users_seminar as us","us.seminar_id","l.seminar_id")).innerJoin("sd_users_narrator as u","u.narrator_id","t.narrator_id"),p=(p=1==_?p.select("l.id as idx"):(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=p.select("l.id as idx")).select("t.title as title_name")).select("t.url as title_url")).select("s.startdate as startdate")).select("s.enddate as enddate")).select("u.fullname as narrator_fullname")).select("u.nickname as narrator_nickname")).select("us.seminar_id as seminar_id")).select("us.firstname as firstname_seminar")).select("us.lastname as lastname_seminar")).select("us.phonenumber as phonenumber_seminar")).select("us.email as email_seminar")).where("u.status",m),""!=s&&null!=s&&(p=p.andWhere("us.seminar_id",s)),null!=i&&(p=p.andWhere("t.id",i)),null!=a&&(p=p.andWhere("us.email","like","%".concat(a,"%"))),null!=s&&(p=p.andWhere("us.seminar_id",s)),null!=t&&(p=p.andWhere("t.title","like","%".concat(t,"%"))),p=(p=null==o&&null==l?p:p.andWhereBetween("l.datetime",[o,l])).groupBy("l.id"),p=null==n&&(null!=u||"desc"==u)?p.orderBy("l.id","desc"):p.orderBy("l.id","asc"),p=null==c&&null==d?p:(p=p.limit(c)).offset(c*(d-1))}catch(e){console.log("err=>",e),e&&process.exit(1)}},e.prototype.filter_seminar_period_event_log=function(e,r){try{var t=r.keyword,n=r.id,i=r.title_id,s=r.seminar_id,a=r.email,o=r.start||1,l=r.end,d=r.pages,_=r.isCount,u=r.orderBy,c=(r.limit,r.perpage||r.sizepsge),m=r.status||1,p=(0==_?(console.log("rows filter ",r),console.log("data keyword ",t),console.log("rows isCount ",_)):(console.log("data filter ",r),console.log("data keyword ",t),console.log("data isCount ",_)),e("seminar_period_event_log as l"));return p=(p=(p=p.innerJoin("seminar_title as t","t.id","l.seminar_title_id")).innerJoin("sd_users_seminar as us","us.seminar_id","l.seminar_id")).innerJoin("sd_users_narrator as u","u.narrator_id","t.narrator_id"),p=(p=1==_?p.select("l.id as idx"):(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=(p=p.select("l.id as idx")).select("t.title as title_name")).select("t.url as title_url")).select("s.startdate as startdate")).select("s.enddate as enddate")).select("u.fullname as narrator_fullname")).select("u.nickname as narrator_nickname")).select("us.seminar_id as seminar_id")).select("us.firstname as firstname_seminar")).select("us.lastname as lastname_seminar")).select("us.phonenumber as phonenumber_seminar")).select("us.email as email_seminar")).where("u.status",m),""!=s&&null!=s&&(p=p.andWhere("us.seminar_id",s)),null!=i&&(p=p.andWhere("t.id",i)),null!=a&&(p=p.andWhere("us.email","like","%".concat(a,"%"))),null!=s&&(p=p.andWhere("us.seminar_id",s)),null!=t&&(p=p.andWhere("t.title","like","%".concat(t,"%"))),p=(p=null==o&&null==l?p:p.andWhereBetween("l.datetime",[o,l])).groupBy("l.id"),p=null==n&&(null!=u||"desc"==u)?p.orderBy("l.id","desc"):p.orderBy("l.id","asc"),p=null==c&&null==d?p:(p=p.limit(c)).offset(c*(d-1))}catch(e){console.log("err=>",e),e&&process.exit(1)}},e}();exports.SeminarPeriodModel=SeminarPeriodModel;