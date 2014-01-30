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


Data = false;

function getID(v){
	return document.getElementById(v);
}

function parseRSS(url, callback) {
JSONP({
	url:'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=-1&q=' + encodeURIComponent(url),
	dataType: 'jsonp',
	success: function(data) {
	  callback(data.responseData.feed);
	}
  });
  
}

function goBack(){
	clear();
	data(Data);
	navBack(false);
}

function navBack(v){
	/*var back = 	getID('navBack');
	var icon =  getID('navIcon');
	
	if (v){
		console.log('v = true');
		back.classList.add('nav-back-icon');
		back.addEventListener('click',goBack);
		icon.addEventListener('click',goBack);
	} else {         
		console.log('v = false');
		back.classList.remove('nav-back-icon');
		back.removeEventListener('click',goBack);
		icon.removeEventListener('click',goBack);
	}*/
}

function entryView( id ){
	var entry = Data.entries[id];
	var content = clear();
	var div = contentDiv({},entry.title,entry.content);
	div.classList.add('entry-view');
	id = parseInt(id);
	Hammer(div).on('swiperight', function(){
		if (id > 0){
			id--;
			location.hash = '';			// force the back button to go the day view.
			location.hash = 'entryID=' + id;
			routing();
		}
	});
	Hammer(div).on('swipeleft', function(){
		if (id < Data.entries.length){
			id ++;
			location.hash = ''; 			// force the back button to go to the day view.
			location.hash = 'entryID=' + id;
			routing();
		}
	});
			
	content.appendChild(div);
	navBack(true);
	
}

function load(e){
	console.log(e);
	var div = e.target;
	var entry = Data.entries[div.index];
	location.hash = 'entryID=' + div.index;
	entryView(div.index);
}

function clear(){
	content = getID('content');
	if (content){
		content.innerHTML = "";
		content.scroll=0;
		return content;
	}
}

function collapse(e){
	clear()
	data(Data);
}

function entryListItem(vals, title){
	var li = document.createElement('li');
	for (var k in vals){
		console.log(k + " = " + vals[k]);
		li[k] = vals[k];
	}
	li.innerHTML += title;
	li.classList.add('content');
	//li.classList.add('content-title');
	return li;
}

function contentDiv(vals, title, content){
	var div = document.createElement('div');
	for (var k in vals){
		console.log(k + " = " + vals[k]);
		div[k] = vals[k];
	}
	div.classList.add('content');
	var t = document.createElement('h4');
	t.innerHTML = title;
	t.classList.add('content-title');
	div.appendChild(t);
	if (content) div.innerHTML += content;
	div.div = div;
	t.div = div;
	div.title = t;
	return div;
}

function data(data){
	console.log(data);
	location.hash = "";
	content = document.getElementById('content');
	var ul = document.createElement('ul');
	ul.classList.add('arrowed');
	//ul.classList.add('content');
	Data = data;
	for(i = 0; i < data.entries.length; i ++){
		entry = data.entries[i];
		var div = {};
		div.index = i;
		div = entryListItem(div, entry.title);
		div.classList.add('list-item');
		div.classList.add('innerLI');
		div.onclick = load;
		ul.appendChild(div);
	}
	content.appendChild(ul);
}

function updateData(callback){
	parseRSS("http://www.worldh.org/calvin-student-news/rss/esn-latest-issue.rss",function(data){Data = data;callback()});
}

function init(){
	//drawNav();
	window.addEventListener("hashchange", routing, false);
	routing();
}

function routing(){
	console.log(location.hash);
	var els = document.getElementsByTagName('*');
	console.log(els);
	if (location.hash=="#android"){
		for(var i=0; i < els.length; i++){
			console.log(els[i]);
			els[i].classList.add('android');
			els[i].classList.remove('ios7');
		}
		location.hash = "";
	} else if (location.hash == "#ios7"){
		for(var i=0; i < els.length; i++){
			console.log(els[i]);
			els[i].classList.add('ios7');
			els[i].classList.remove('android');
		}
		location.hash = "";
	}
			
	if (! Data){
		updateData(routing);
	}
	
	if (location.hash == "#" || location.hash == ""){
		clear();	
		data(Data);
	} else {
		var match = /#entryID=(.*)$/.exec(location.hash) 
		if (match.length >=1){
			console.log(match);
			entryView(match[1]);
		}
	}
}
/*parseRSS("http://www.worldh.org/calvin-student-news/rss/esn-latest-issue.rss", data);*/
document.onload = init(); 

