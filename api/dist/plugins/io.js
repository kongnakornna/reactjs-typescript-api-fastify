"use strict";var __awaiter=this&&this.__awaiter||function(e,u,a,l){return new(a=a||Promise)(function(n,t){function r(e){try{i(l.next(e))}catch(e){t(e)}}function o(e){try{i(l.throw(e))}catch(e){t(e)}}function i(e){var t;e.done?n(e.value):((t=e.value)instanceof a?t:new a(function(e){e(t)})).then(r,o)}i((l=l.apply(e,u||[])).next())})},__generator=this&&this.__generator||function(r,o){var i,u,a,l={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},c={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function e(n){return function(e){var t=[n,e];if(i)throw new TypeError("Generator is already executing.");for(;l=c&&t[c=0]?0:l;)try{if(i=1,u&&(a=2&t[0]?u.return:t[0]?u.throw||((a=u.return)&&a.call(u),0):u.next)&&!(a=a.call(u,t[1])).done)return a;switch(u=0,(t=a?[2&t[0],a.value]:t)[0]){case 0:case 1:a=t;break;case 4:return l.label++,{value:t[1],done:!1};case 5:l.label++,u=t[1],t=[0];continue;case 7:t=l.ops.pop(),l.trys.pop();continue;default:if(!(a=0<(a=l.trys).length&&a[a.length-1])&&(6===t[0]||2===t[0])){l=0;continue}if(3===t[0]&&(!a||t[1]>a[0]&&t[1]<a[3]))l.label=t[1];else if(6===t[0]&&l.label<a[1])l.label=a[1],a=t;else{if(!(a&&l.label<a[2])){a[2]&&l.ops.pop(),l.trys.pop();continue}l.label=a[2],l.ops.push(t)}}t=o.call(r,l)}catch(e){t=[6,e],u=0}finally{i=a=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},fastify_plugin_1=(Object.defineProperty(exports,"__esModule",{value:!0}),__importDefault(require("fastify-plugin")));module.exports=(0,fastify_plugin_1.default)(function(n,r,o){return __awaiter(void 0,void 0,void 0,function(){var t;return __generator(this,function(e){return t=require("socket.io"),t=new t(n.server,r),n.decorate("io",t),o(),[2]})})});