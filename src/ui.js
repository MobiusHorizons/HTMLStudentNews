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

