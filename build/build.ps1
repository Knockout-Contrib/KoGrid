
$CurrentDir = (Get-Location).Path;
$OutPutFile = $CurrentDir + "\koGrid.debug.js";
$TempFile = $OutPutFile + ".temp";
$FinalFile = "..\koGrid-2.1.0.debug.js";
$BuildOrder = $CurrentDir + "\build-order.txt";
$commentStart = "<!--";
$commentEnd = "-->";

Write-Host "JSBuild Starting...";
$files = Get-Content $BuildOrder;
$compileTime = Get-Date;

Set-Content $TempFile "/***********************************************";
Add-Content $TempFile "* koGrid JavaScript Library";
Add-Content $TempFile "* Authors: https://github.com/ericmbarnard/koGrid/blob/master/README.md";
Add-Content $TempFile "* License: MIT (http://www.opensource.org/licenses/mit-license.php)";
Add-Content $TempFile "* Compiled At: $compileTime";
Add-Content $TempFile "***********************************************/`n"
Add-Content $TempFile "(function(window, undefined){";
Foreach ($file in $files){
	# Wrap each file output in a new line
	Write-Host "Building... $file";
	Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
	$fileContents = Get-Content $file | where {!$_.StartsWith("///")};
	if ($fileContents[0].StartsWith("<!--")){
	    $compiledContent = $fileContents[0].TrimStart($commentStart).TrimEnd($commentEnd).Trim() + " = function(){ return '";
	    for ($indx = 1; $indx -lt $fileContents.Length; $indx++){
		    $compiledContent += $fileContents[$indx].Trim().Replace("'", "\'");
		}
	    $compiledContent += "';};";
		Add-Content $TempFile $compiledContent; 
	} else {
	    Add-Content $TempFile $fileContents;
	}
}
Add-Content $TempFile "}(window));";
Get-Content $TempFile | Set-Content $OutputFile;
Remove-Item $TempFile -Force;
Copy-Item $OutputFile $FinalFile;
Write-Host "Build Succeeded!"
