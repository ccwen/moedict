var indexer=require("ksana-indexer");

setTimeout(function(){
	indexer.build(require("./moedict.js"));	
},100);
