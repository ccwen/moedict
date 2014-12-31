var kde=require("ksana-document").kde;
var kse=require("ksana-document").kse;
var plist=require("ksana-document").plist;
var test=function(engine) {
	var pageNames=engine.get("pageNames");
	var i=plist.indexOfSorted(pageNames,"冰");
	engine.get(["fileContents",0,i],function(data){
		console.log(data)
	})
}
var test2=function(engine){
	kse.search(engine,"下棋",{range:{start:0},nohighlight:true},function(data){
		console.log(data.excerpt)
	});

}
kde.open("moedict",test2);