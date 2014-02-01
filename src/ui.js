var style = {};
var UI = {};

function setTitle(title){
	if (document.readyState != 'complete'){
		init( function(){
			setTitle(title)
		});
		return;
	}
	
	var navTitle = 	document.getElementsByClassName('nav-title')[0]
	navTitle.innerHTML = title;
	document.title = navTitle.childNodes[0].nodeValue;
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
		var next = document.createElement('button');
		next.classList.add('right');//,'inline-block');
//		header.classList.add('inline-block');
		
//		header.appendChild(back);
		header.back = back;
		header.appendChild(title);
		header.title = title;
//		header.appendChild(next);
		header.next = next;
		UI.nav = header;
		UI.nav.back = back;
		UI.nav.title = title;
		UI.nav.next = next;
	}
	return header;
}

//UI.nav.redraw = function(){
	
//}
