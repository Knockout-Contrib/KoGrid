#!/bin/bash

CurrentDir=$PWD
OutPutFile=$CurrentDir/KoGrid.debug.js
FinalFile=../KoGrid-1.3.0.debug.js
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
    cat "$CurrentDir/$A" >> $OutPutFile.temp
    echo >>$OutPutFile.temp
done

# Remove the OutputFile if it exists
rm $OutPutFile

# Wrap the final output in an IIFE
echo "/***********************************************" >> $OutPutFile
echo "* koGrid JavaScript Library" >> $OutPutFile
echo "* Authors: https://github.com/ericmbarnard/KoGrid/blob/master/README.md" >> $OutPutFile
echo "* License: MIT (http://www.opensource.org/licenses/mit-license.php)" >> $OutPutFile
echo "* Compiled At: $(date)" >> $OutPutFile
echo "***********************************************/" >> $OutPutFile
# Below line is in build.bat but not build.ps1.
# echo "(function(window, undefined){" >> $OutPutFile
cat $OutPutFile.temp >> $OutPutFile
# Below line is in build.bat but not build.ps1.
#echo "}(window));" >> $OutPutFile
rm $OutPutFile.temp
cp -v $OutPutFile $FinalFile
echo "JSBuild Succeeded"
