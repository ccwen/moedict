var fs=require("fs");
var files=fs.readFileSync("./moedict.lst","utf8").split(/\r?\n/);
var source=[];
var dofile=function(fn){
	var content=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	content.map(function(line){
		line.replace(/([^\],。」]+?)「/g,function(m,m1){
			if (line.indexOf('[引]')>-1) {
				source.push(m1);
			}		
		});
	})
}
files.map(dofile);
fs.writeFileSync("source.txt",source.join("\n"),"utf8")