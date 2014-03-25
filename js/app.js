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


function getID(v){
	return document.getElementById(v);
}

function getClass(v){
	return document.getElementsByClassName(v);
}


var style = {};
var UI = {};
UI.nav = {};

function setTitle(title){
	console.log(UI);
	if (document.readyState != 'complete'){
		init( function(){
			setTitle(title)
		});
		return;
	}
	
	//	var navTitle = 	document.getElementsByClassName('nav-title')[0]
	//navTitle.innerHTML = title;
	UI.nav.caption.innerHTML = title;
	document.title = UI.nav.caption.childNodes[0].nodeValue;
}

function makeNav(){
	var header = document.getElementsByTagName('header')[0];
	console.log(header);
	if (false){
		if ( style == "android"){
			var title = document.createElement('button');
			var back = document.createElement('button');
			var icon = document.createElement('button');
			icon.classList.add('nav-icon','inline-block');
			back.classList.add('nav-back');
			icon.appendChild(back);
			title.classList.add('nav-title','inline-block');
			header.appendChild(icon);
			header.appendChild(title);
			UI.nav = header;
			UI.nav.back = back;
			UI.nav.title = title;
			UI.nav.icon = icon;
			
		} else	if ( style == "ios7"){
		}
	} else {
		
		var back = document.createElement('button');
		back.classList.add('left','arrow');//,'inline-block');
		back.label = document.createElement('div');
		back.label.classList.add('label');
		var title = document.createElement('h1');
		title.classList.add('nav-title');//,'inline-block');
		console.log('nav-title');
		console.log(title);
		var next = document.createElement('button');
		next.classList.add('right');//,'inline-block');
		console.log(title);	
		header.caption = header.appendChild(title);
		UI.nav = header;
		UI.nav.back = back;
		console.log(UI.nav.caption);
		UI.nav.next = next;
	}
	return header;
}

// for now this just fixes width of the title.
UI.nav_redraw = function(){
	if (UI.nav.back && !UI.nav.back.classList.contains('hidden')){
		console.log(UI.nav.back.clientWidth);
		UI.nav.caption.style.margin = "0 " + UI.nav.back.clientWidth;
	} else {
		UI.nav.caption.style.margin = "0px";
	}
}


function navBack(v){
	var back =  UI.nav.back;
	var header = UI.nav;
	if (v){
		back.classList.remove('hidden');
		back.label.innerHTML = "Home";
		var label = back.appendChild(back.label);
		back.addEventListener('click',goBack);
		UI.nav.back = header.insertBefore(back,header.caption)
		UI.nav.back.label = label;
	} else {         
		back.classList.add('hidden');
		header.removeChild(back);
		back.removeEventListener('click',goBack);
	}
	UI.nav_redraw();
}


(function(UI){

	UI.events = UI.events || {};
	UI.events.touchstart = function(event){
		if(event.targetTouches.length==1){
			event.target.touchStartX = event.targetTouches[0].pageX;
			event.target.touchStartY = event.targetTouches[0].pageY;
		}
	};
	UI.events.touchmove = function(event){
		tg = event.target;
		if(event.targetTouches.length == 1){
			event.preventDefault();
			tg.touchLengthX = event.targetTouches[0].pageX-tg.touchStartX;
			tg.touchLengthY = event.targetTouches[0].oageY-tg.touchStartY;
		}
	};
	UI.events.touchend = function(event){
		tg = event.target;
		event.preventDefault();
			if (tg.touchLengthX > 30){
				var evt = new CustomEvent("swiperight", 
				{detail: {
					swipeLength: Math.abs(tg.touchLengthX)}
				});
				tg.dispatchEvent(evt);
			}
			if(tg.touchLengthX < -30){
				var evt = new CustomEvent("swipeleft", 
				{detail: {
					swipeLength: Math.abs(tg.touchLengthX)}
				});
				tg.dispatchEvent(evt);
			}
	};
	UI.events.touchcancel = function(event){
		event.preventDefault;
	};
	UI.touch = function(element, options){
		var self = this;
		element.addEventListener('touchstart',UI.events.touchstart);
		element.addEventListener('touchmove', UI.events.touchmove);
		element.addEventListener('touchend', UI.events.touchend);
	}

}(window.UI = window.UI || function(){}));

URL = "http://www.worldh.org/calvin-student-news/rss/esn-latest-issue.rss";
Data = false;
onReadyfuns = [];

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

function entryView( id ){
	var entry = Data.entries[id];
	var content = clear();
	var div = contentDiv({},entry.title,entry.content);
	div.classList.add('entry-view');
	div.classList.add('slide-in-right');
	id = parseInt(id);
	UI.touch(div);
	div.addEventListener('swiperight',function(){ //Hammer(div).on('swiperight', function(){
		if (id > 0){
			id--;
			location.hash = '';			// force the back button to go the day view.
			location.hash = 'entryID=' + id;
			routing();
		}
	});
	div.addEventListener('swipeleft', function(){ //Hammer(div).on('swipeleft', function(){
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
	var t = document.createElement('h3');
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
	//parseRSS("http://www.worldh.org/calvin-student-news/rss/esn-latest-issue.rss"
//	parseRSS("http://rss.nytimes.com/services/xml/rss/nyt/World.xml"
	parseRSS(URL
		,function(data){
			Data = data;
			setTitle(data.title);
			if (callback != undefined){
				callback();
			}
		});
}

function init(fun){
	console.log(typeof(fun));
	if (fun != undefined && typeof(fun) == "function"){
		onReadyfuns.push(fun);
	}
	console.log(document.readyState);
	if (document.readyState == 'complete'){
		window.addEventListener("hashchange", routing, false);
		makeNav();
		for (fun in onReadyfuns){
			console.log(fun);
			onReadyfuns[fun]();
		}
	}
}

function routing(){
	console.log(location.hash);
	if (! Data){
		updateData(routing);
		return;
	}
	if (document.readyState != 'complete'){
		init(routing);
		return;
	}		
//		document.addEventListener("DOMContentLoaded",routing);

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
document.onload = updateData(routing);
document.onreadystatechange = init;
