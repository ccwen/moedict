var fs=require("fs");
var sources=fs.readFileSync("source.txt","utf8").split(/\r?\n/);
var dynasties={ '唐': true,'元': true,'明': true,'宋': true,
	'漢': true,'清': true,'晉': true,
  '金': true, '隋': true,  '梁': true,  '周': true,
  '魏': true,  '遼': true,  '秦': true,  '陳': true,
  '後秦': true, '後蜀': true, '後魏': true, '後周':true,
  '南朝宋':true,'南朝梁':true,

}
var titles={};
var total=0;
sources.map(function(source){
	var fields=source.split("．");
	var title=fields[0];
	if (dynasties[fields[0]] && fields.length>2) {
		title=fields[2];
	}
	title=title.replace("：","");

	if (!titles[title]) titles[title]=0;
	titles[title]++;
	total++;
});

var T=[];
for (var i in titles) T.push([titles[i],i]);
T.sort(function(a,b){return b[0]-a[0]});
//accumulate freq
var accumulate=0;
T.forEach(function(t){
	accumulate+=t[0];
	
	t[2]=((accumulate/total)*100).toFixed(2);
	//t[3]=accumulate;
});

T=T.map(function(t){return t.join("\t")})

fs.writeFileSync("title.txt",T.join("\n"),"utf8");