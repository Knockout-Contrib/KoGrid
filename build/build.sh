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
    echo >>$OutPutFile.temp
    echo "Building... $A"
    echo >>$OutPutFile.temp
    echo "/***********************************************" >> $OutPutFile.temp
    echo "* FILE: $A" >> $OutPutFile.temp
    echo "***********************************************/" >> $OutPutFile.temp
    # eliminate unicode Byte Order Mark
    sed '1 s/^\xef\xbb\xbf//' "$CurrentDir/$A" >> $OutPutFile.temp
    echo >>$OutPutFile.temp
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
echo "(function(window, undefined){" >> $OutPutFile
cat $OutPutFile.temp >> $OutPutFile
echo "}(window));" >> $OutPutFile
rm $OutPutFile.temp
cp -v $OutPutFile $FinalFile
echo "JSBuild Succeeded"
