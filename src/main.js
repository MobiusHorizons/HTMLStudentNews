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

function navBack(v){
	var back =  UI.nav.back;
	var header = UI.nav;
	if (v){
		console.log('v = true');
		back.classList.remove('hidden');
		back.label.innerHTML = "Home";
		back.appendChild(back.label);
		back.addEventListener('click',goBack);
		header.insertBefore(back,UI.nav.title)
	} else {         
		console.log('v = false');
		back.classList.add('hidden');
		header.removeChild(back);
		back.removeEventListener('click',goBack);
	}
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
	//parseRSS("http://www.worldh.org/calvin-student-news/rss/esn-latest-issue.rss"
//	parseRSS("http://rss.nytimes.com/services/xml/rss/nyt/World.xml"
	parseRSS(URL
		,function(data){
			Data = data;
			setTitle(Data.title);
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
