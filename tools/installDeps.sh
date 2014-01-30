#!/bin/bash

##################      Declarations     ###################

	declare -A nodeModules;
	nodeModules[concat]=grunt-contrib-concat
	nodeModules[uglify]=grunt-contrib-uglify
	nodeModules[cssmin]=grunt-contrib-cssmin
	nodeModules[embed]=grunt-embed
	
	NPM=""
	GRUNT=""
	MODULES=""
	PKG_MGR=""
	SUDO=$(which sudo)


################## Finds Package Manager ###################

GetPackageManager(){
	declare -A osInfo;
	osInfo[/etc/redhat-release]=yum
	osInfo[/etc/arch-release]=pacman
	osInfo[/etc/gentoo-release]=emerge
	osInfo[/etc/SuSE-release]=zypp
	osInfo[/etc/debian_version]=apt-get

	PKGM=""
	for f in ${!osInfo[@]}
	do
	    if [[ -f $f ]];then
		PKGM=${osInfo[$f]}
	    fi
	done

	PKG_MGR=$(which $PKGM)
	if [ $? -ne 0 ] 
	then
		echo "Package manager cannot be identified"
		exit 1
	else 
		return 0
#		echo "$PKG_MGR"
	fi
}

##################      Checks Modules    ###################
checkModules(){

	for m in ${!nodeModules[@]}
	do
		module=${nodeModules[$m]}
		npm list $module 2&>/dev/null
		if [ $? -ne 0 ] ; then
			echo "installing grunt module $m "
			$SUDO $NPM install $module
			if [ $? -ne 0 ];then exit 3;fi
		fi
	done
}

##################      Check for npm    ###################
checkNode(){
	NPM=$(which npm 2> /dev/null )
	if [ $? -ne 0 ]; then 
		GetPackageManager
		echo "installing npm (Node Package Manager)"
		$SUDO $PKG_MGR install npm
		if [ $? -ne 0 ];then exit 1;fi
		NPM=$(which npm 2> /dev/null )
	fi
}

##################    Check for grunt    ###################
checkGrunt(){
	GRUNT=$(which grunt 2> /dev/null )
	if [ $? -ne 0 ]; then 
		GetPackageManager
		echo "installing grunt"
		$SUDO $NPM install grunt-cli
		if [ $? -ne 0 ];then exit 2;fi
		GRUNT=$(which grunt 2> /dev/null )	
	fi
}

##################   main Program        ###################

checkNode
checkGrunt
checkModules
echo "npm grunt and dependencies installed"
