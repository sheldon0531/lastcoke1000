var http = require('http');
var jade= require('jade');
var fs = require('fs');
var file1 = "./candle1.json";
const TradingView = require('@mathieuc/tradingview/main');
 
var server = http.createServer(function (req, res) {   
 
    if (req.url == '/data') { //check the URL of the current request
	    var ftime;
	    fs.stat(file1, function(err, stat1) {
		ftime=stat1.mtime;
	    if ((Date.now()-ftime)/(1000*60)>15) {
		console.log((Date.now()-ftime)/1000+'seconds from Last update, time to update candle data');
	    	const client = new TradingView.Client();
	    	const chart = new client.Session.Chart();
	    	chart.setMarket('PEPPERSTONE:US500', {
  		  timeframe: '15',
  		  range: 500,
	    	});
	    	var str;
	    	chart.onUpdate(() => {
  		  console.log('OK', chart.periods.length);
		  str=JSON.stringify(chart.periods);
  		  client.end();
		fs.writeFile(file1, str, function(err) {
    		  if (err) throw err;
    		  console.log('candle update complete...'+ftime);
    		});
	    });
	    };
	    });
	    
	    fs.readFile(file1, function (err, data) {
    		if (err) throw err;
		var jsonobj=JSON.parse(data);
	 	//console.log(jsonobj);
	   	var data=jade.renderFile('./candle1.jade',{obj: jsonobj});
		console.log(data);
            	res.write(data);
            	res.end();
	    });
    }
});

server.listen(3128);
 
console.log('Node.js web server at port 3128 is running..')
