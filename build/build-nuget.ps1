# NuGet Build and Publish Script
#==============================================================================
#	Prerequisites: 
#	- Must be an owner of the NuGet Package
#	- Must have "NuGet.exe" in your path
#	- Must have latest "NuGet.exe" or self-updating enabled (which it should be)
#	- Must have set your NuGet APIKey globally using:
#		 "nuget setApiKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
#	- Windows (hopefully that's obvious)
#==============================================================================

# Variables

$path		= [System.IO.Path]
$cd			= $(Get-Location).Path;
$output		= $cd; # The "/Build" Folder
$nuspec		= $path::Combine($cd, "KoGrid.nuspec");
$pkg		= ""; # set after the build

# First, smoke any old Nuget Packages
Write-Host "Cleaning out old Nuget Packages..."
Get-ChildItem $output -include *.nupkg -recurse | foreach ($_) { Write-Host $_.Name; Remove-Item $_.FullName }

# Then, Build the NuGet Pkg
& nuget pack $nuspec -p Configuration=Release -o $output -verbosity "detailed"

# Now Publish the Pkg
$pkg = $(Get-ChildItem *.nupkg | Select-Object -First 1).FullName;
& nuget push $pkg -verbosity "detailed"