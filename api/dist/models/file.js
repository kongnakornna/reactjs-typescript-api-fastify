"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.FileModel=void 0;var FileModel=function(){function e(){}return e.prototype.save=function(e,t){return e("files").insert(t,"file_id")},e.prototype.getInfo=function(e,t){return e("files").where("file_id",t)},e}();exports.FileModel=FileModel;