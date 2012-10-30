
$CurrentDir = (Get-Location).Path;
$OutPutFile = $CurrentDir + "\KoGrid.debug.js";
$TempFile = $OutPutFile + ".temp";
$FinalFile = "..\KoGrid-1.2.3.debug.js";
$BuildOrder = $CurrentDir + "\build-order.txt";

Write-Host "JSBuild Starting...";
$files = Get-Content $BuildOrder;
$compileTime = Get-Date;

Set-Content $TempFile "/***********************************************";
Add-Content $TempFile "* koGrid JavaScript Library";
Add-Content $TempFile "* Authors: https://github.com/ericmbarnard/KoGrid/blob/master/README.md";
Add-Content $TempFile "* License: MIT (http://www.opensource.org/licenses/mit-license.php)";
Add-Content $TempFile "* Compiled At: $compileTime";
Add-Content $TempFile "***********************************************/`n"
Foreach ($file in $files){
	# Wrap each file output in a new line
	Write-Host "Building... $file";
	Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
	Get-Content $file | where {!$_.StartsWith("///")} | Add-Content $TempFile;
}
Get-Content $TempFile | Set-Content $OutputFile;
Remove-Item $TempFile -Force;
Copy-Item $OutputFile $FinalFile;
Write-Host "Build Succeeded!"