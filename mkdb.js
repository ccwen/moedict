var fs=require("fs");
var tei=require("ksana-document").tei;

var lst=fs.readFileSync(process.argv[2]||"moedict.lst",'utf8')
	      .replace(/\r\n/g,"\n").split("\n");

var finalized=function(session) {
	console.log("VPOS",session.vpos);
	console.log("FINISHED");
}
var warning=function() {
	console.log.apply(console,arguments);
}

var captureTags={
}
var afterbodyend=function(s,status) {
	var apps=tei(status.starttext+s,status.parsed,status.filename,config,status);
}

var onFile=function(fn) {
	console.log("indexing "+fn);
}
var config={
	name:"moedict"
	,meta:{
		config:"simple1"	
	}
	,glob:lst
	,pageSeparator:"e"
	,format:"TEI-P5"
//	,bodystart: "<body>"
//	,bodyend : "</body>"
	,reset:true
//	,setupHandlers:setupHandlers
	,finalized:finalized
//	,finalizeField:finalizeField
	,warning:warning
	,captureTags:captureTags
	,callbacks: {
		onFile:onFile
//		,beforebodystart:beforebodystart
		,afterbodyend:afterbodyend		
//		,beforeParseTag:beforeParseTag
	}
}
setTimeout(function(){ //this might load by gulpfile-app.js
	if (!config.gulp) {
		var kd=require("ksana-document");
		if (kd && kd.build) {
			kd.build();
		}
	}
},100)
module.exports=config;