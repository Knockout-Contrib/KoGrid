@ECHO OFF

SET CurrentDir=%CD%
SET OutPutFile=%CurrentDir%\KoGrid.debug.js
SET FinalFile=..\KoGrid.debug.js
SET BuildOrder=%CurrentDir%\build-order.txt

ECHO JSBuild Starting...
FOR /F "tokens=*" %%A in (%BuildOrder%) DO (  
@REM Wrap each file output in a new line
@ECHO. >>%OutPutFile%.temp
ECHO Building... %%A
@ECHO. >>%OutPutFile%.temp
@ECHO /*********************************************** >> %OutPutFile%.temp
@ECHO * FILE: %%A >> %OutPutFile%.temp
@ECHO ***********************************************/ >> %OutPutFile%.temp
@TYPE %CurrentDir%\%%A >> %OutPutFile%.temp
@ECHO. >>%OutPutFile%.temp
)

@REM Remove the OutputFile if it exists
DEL %OutPutFile%

@REM Wrap the final output in an IIFE
@ECHO /*********************************************** >> %OutPutFile%
@ECHO * KoGrid JavaScript Library >> %OutPutFile%
@ECHO * Authors:  https://github.com/ericmbarnard/KoGrid/blob/master/README.md >> %OutPutFile%
@ECHO * License: MIT (http://www.opensource.org/licenses/mit-license.php) >> %OutputFile%
@ECHO * Compiled At: %Time% %Date% >> %OutPutFile%
@ECHO ***********************************************/ >> %OutPutFile%
@ECHO (function(window, undefined){ >> %OutPutFile%
@TYPE %OutPutFile%.temp >> %OutPutFile%
@ECHO }(window)); >> %OutPutFile%
DEL %OutPutFile%.temp
COPY %OutputFile% %FinalFile%
ECHO JSBuild Succeeded
ENDLOCAL
GOTO :eof