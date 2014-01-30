var jsonpCB = {};
var JSONP_DATA = [];
	
function JSONP_makeCb(id){
	var cbName = "jsonpCB.cb"+id;
	jsonpCB['cb' + id] = function(res){
		if (res.responseStatus == 200){ // TODO: make better success method;
			JSONP_DATA[id].success(res);
			JSONP_cleanCb(id);
		}
		console.log(res);
	};
	return cbName;
}

function JSONP_cleanCb(id){
	jsonpCB['cb'+id] = null;
	document.getElementsByTagName('head')[0].removeChild(JSONP_DATA[id].script);
}

function JSONP(data){
    var id = JSONP_DATA.push(data);
    var rjsonp = /(=)\?(?=&|$)|\?\?/;
    var script = document.createElement('script');
    var cbName = JSONP_makeCb(id);
    data.url = data.url.replace(rjsonp, "$1" + cbName );
	console.log(data.url);
    script.src = data.url;
    data.script = script;
    JSONP_DATA[id] = data;
	document.getElementsByTagName('head')[0].appendChild(script);
    
}
