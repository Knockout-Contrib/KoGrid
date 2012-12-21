#!/bin/bash
CurrentDir=$PWD
OutPutFile=$CurrentDir/koGrid.debug.js
FinalFile=../koGrid-2.1.1.debug.js
BuildOrder=$CurrentDir/build-order.txt

echo JSBuild Starting...

cat $BuildOrder | sed 's/\\/\//g' |
while read A
do         
# Wrap each file output in a new line
    echo "Building... $A"
    echo >>$OutPutFile.temp
    echo "/***********************************************" >> $OutPutFile.temp
    echo "* FILE: $A" | sed 's/\//\\/g' >> $OutPutFile.temp
    echo "***********************************************/" >> $OutPutFile.temp
    if sed -n -e '/^<!--/q 0' -e 'q 1' "$CurrentDir/$A"
    then # html files
	sed -e '1  s/^\xef\xbb\xbf//' \
            -e "1  s/<\!--\(.*\)-->/\1 = function(){ return '/" \
	    -e "1! s/'/\\\\'/g" \
	    -e "1! s/^\s*\(.*\)\s*$/\1/" \
	    "$CurrentDir/$A" | tr -d '\n' >> $OutPutFile.temp
	echo "';};" >> $OutPutFile.temp
    else # js files.
	sed -e '1 s/^\xef\xbb\xbf//' -e '/^\/\/\//d' "$CurrentDir/$A" >> $OutPutFile.temp
	echo >>$OutPutFile.temp
    fi
done

# Remove the OutputFile if it exists
rm $OutPutFile

# Wrap the final output in an IIFE
echo "/***********************************************" >> $OutPutFile
echo "* koGrid JavaScript Library" >> $OutPutFile
echo "* Authors: https://github.com/ericmbarnard/koGrid/blob/master/README.md" >> $OutPutFile
echo "* License: MIT (http://www.opensource.org/licenses/mit-license.php)" >> $OutPutFile
echo "* Compiled At: $(date)" >> $OutPutFile
echo "***********************************************/" >> $OutPutFile
echo >> $OutPutFile
echo "(function (window) {" >> $OutPutFile
echo "'use strict';" >> $OutPutFile

cat $OutPutFile.temp >> $OutPutFile
echo "}(window));" >> $OutPutFile
rm $OutPutFile.temp
cp -v $OutPutFile $FinalFile
echo "JSBuild Succeeded"
