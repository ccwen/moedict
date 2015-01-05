var kde=require("ksana-database");
var kse=require("ksana-search");
var plist=require("ksana-document").plist;
var test=function(err,engine) {
	var pageNames=engine.get("pageNames");
	var i=plist.indexOfSorted(pageNames,"英");
	engine.get(["fileContents",0,i],function(data){
		console.log(data)
	})
}

var test2=function(){
	kse.search("moedict","下棋",{range:{start:0},nohighlight:true},function(err,data){
		console.log(data.excerpt)
	});

}
test2();
//kde.open("moedict",test2);