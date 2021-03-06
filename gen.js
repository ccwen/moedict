var fs=require("fs");
var charonly=false; //only output single char entries
var buildeudc=function() {
	console.log(moesym.length)
	var i=0;
	while(i<moesym.length) {
		var q=moesym.length-i-1;
		var e=moesym[q];
		var idx=e.indexOf(" ");
		var code=e.substr(0,idx);
		if (code[0]=='x') { //might have IVD
			code=code.substr(1);
		}
		var replaceto=e.substr(idx+1);
		if (!eudc[code]) eudc[code]=replaceto;
		i++;
	}
}
var replaced=0;
var replaceMissingCharacter=function(){
  return moedictraw.replace(/\{\[[0-9a-f]+\]\}/g,function(m){
  	var code=m.substring(2,m.length-2);
  	replaced++;
	return eudc[code];
  });
}
var encodetag=function(text) {
	return text.replace(/<([^<])>/g,function(m,m1){return "~"+m1+"~"});
}
var prefix=function(tag) {
	var r="unknown"+tag;
	if (tag=="example") r="[例]";
	else if (tag=="link") r="[連]";
	else if (tag=="quote") r="[引]";
	else if (tag=="antonyms") r="[反]";
	else if (tag=="synonyms") r="[同]";
	return r;
}
var dumphete=function(hete) {
	var out=[];
	var defs=hete.definitions;
	
	if (hete.pinyin) out.push("[拼]"+hete.pinyin);
	
	for (var i=0;i<defs.length;i++) {
		//out.push('<d type="'+defs[i].type+'">');
		//else out.push("<d>");
		var type=defs[i].type,typeprefix="";
		for (var j in defs[i]) {
			if (j=="type") continue;
			if (defs[i][j]) {
				if (j!=="def") {
					out.push(prefix(j)+defs[i][j]);
				} else {
					if (type) typeprefix="{"+type+"}";
					else typeprefix="";
					out.push(typeprefix+encodetag(defs[i][j]));
				}
			}
		}
		//out.push("</d>");
	}
	
	return out;
}
var convert2xml=function(json) {
	var out=[];
	var lastpercent=0;
	for(var i=0;i<json.length;i++) {
		var percent=Math.floor(i*100/json.length);
		if (percent!=lastpercent) {
			//console.log(percent);
		}
		lastpercent=percent;
		if (json[i].title=="undefined") continue;
		var defs=[];
		for (var j=0;j<json[i].heteronyms.length;j++) {
			var hete=json[i].heteronyms[j];
			defs.push(dumphete(hete).join("\n"));
		}
		if (charonly&&json[i].title.length>1) continue;
		out.push([json[i].title,"<e>"+json[i].title+"</e>\n"+defs.join("\n")]);			
	}
	//entry is used for pageNames, sort it to enable binary search
	out=out.sort(function(a,b){return a[0]>b[0]?1:b[0]>a[0]?-1:0;});
	return out.map(function(e){return e[1]});
}

var parseHugeJSON=function(rawlines) {
	var content="", out=[];
	for (var i=1;i<rawlines.length-2;i++) {//skip staring [ and ending ] ,last line is empty
		var line=rawlines[i];
		if (line==="	},") {
			content+="}";
			out.push(JSON.parse(content));
			content="";
		} else {
			content+=line;
		}
	}
	return out;
}
//===================================================================
var dumpxml=function(entries) {
	var xmlfilenames=[];
	var batch=1,content="";
	var writexml=function() {
		var fn="xml/moedict"+batch+".xml";
		if (charonly) fn="xml1/moedict"+batch+".xml";
		xmlfilenames.push(fn);
		fs.writeFileSync(fn,content,"utf8");
		batch++;
		content="";
	}
	for (var i=0;i<entries.length;i++) {
		if (i&& (i%256==0)) writexml();
		content+=entries[i]+"\n";
	}
	if (content) writexml();
	return xmlfilenames;
}
var moesym=fs.readFileSync("raw/sym.txt","utf8").replace(/\r\n/g,"\n")
.replace(/\r/g,"\n").split("\n");//https://github.com/g0v/moedict-epub/blob/master/sym.txt
var eudc={};
console.log("buildeduc");
buildeudc();
console.log("reading moe");
var moedictraw=fs.readFileSync("raw/dict-revised.json","utf8");
console.log("replacing missing character");
moedictraw=replaceMissingCharacter(moedictraw);
console.log("missing character replaced",replaced)
console.log("split into lines");
var rawlines=moedictraw.split(/\r?\n/);
console.log("parsing moe, raw line count",rawlines.length);
var entries=parseHugeJSON(rawlines);
console.log("converting entries",entries.length);
var xml=convert2xml(entries);

console.log("save to file");
var filenames=dumpxml(xml);
console.log("finished,file count",filenames.length);
fs.writeFileSync("moedict.lst",filenames.join("\n"));

/*
var moedict=JSON.parse(moedictraw);
console.log("convert to xml");
var out=convert2xml(moedict);
console.log("savefile");
fs.writeFileSync("moedict.xml",out.join("\n"),"utf8");
*/