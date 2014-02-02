var style = {};
var UI = {};

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
//		header.classList.add('inline-block');
		console.log(title);	
//		header.appendChild(back);
		header.appendChild(title);
		console.log(title);	
//		header.appendChild(next);
		header.next = next;
		UI.nav = header;
		UI.nav.back = back;
		UI.nav.caption = title;
		console.log(UI.nav.caption);
		UI.nav.next = next;
	}
	return header;
}

//UI.nav.redraw = function(){
	
//}


function navBack(v){
	var back =  UI.nav.back;
	var header = UI.nav;
	if (v){
		console.log('v = true');
		back.classList.remove('hidden');
		back.label.innerHTML = "Home";
		back.appendChild(back.label);
		back.addEventListener('click',goBack);
		header.insertBefore(back,header.caption)
	} else {         
		console.log('v = false');
		back.classList.add('hidden');
		header.removeChild(back);
		back.removeEventListener('click',goBack);
	}
}

