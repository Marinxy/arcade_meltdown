; Arcade Meltdown - Windows Installer Script
; Requires NSIS (Nullsoft Scriptable Install System) to compile

; Include necessary headers
!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "WinVer.nsh"

; Define application information
!define APP_NAME "Arcade Meltdown"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Arcade Meltdown Team"
!define APP_URL "https://github.com/arcade-meltdown/arcade-meltdown"
!define APP_ICON "..\..\assets\icons\icon.ico"

; Define installation directory
InstallDir "$PROGRAMFILES\${APP_NAME}"

; Define registry key for uninstaller
!define REGKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"

; Request application privileges
RequestExecutionLevel admin

; Set compression
SetCompressor lzma

; Interface settings
!define MUI_ABORTWARNING
!define MUI_ICON "${APP_ICON}"
!define MUI_UNICON "${APP_ICON}"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; Section "Main Application"
Section "Main Application" SEC01

    ; Set output path
    SetOutPath "$INSTDIR"
    
    ; Create uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"
    
    ; Write registry keys
    WriteRegExpandStr HKLM "${REGKEY}" "InstallLocation" "$INSTDIR"
    WriteRegExpandStr HKLM "${REGKEY}" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegExpandStr HKLM "${REGKEY}" "QuietUninstallString" '"$INSTDIR\uninstall.exe" /S'
    WriteRegDWORD HKLM "${REGKEY}" "NoModify" 1
    WriteRegDWORD HKLM "${REGKEY}" "NoRepair" 1
    WriteRegStr HKLM "${REGKEY}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "${REGKEY}" "DisplayVersion" "${APP_VERSION}"
    WriteRegStr HKLM "${REGKEY}" "Publisher" "${APP_PUBLISHER}"
    WriteRegStr HKLM "${REGKEY}" "URLInfoAbout" "${APP_URL}"
    WriteRegStr HKLM "${REGKEY}" "DisplayIcon" "$INSTDIR\${APP_NAME}.exe"
    
    ; Create directories
    CreateDirectory "$INSTDIR\assets"
    CreateDirectory "$INSTDIR\assets\audio"
    CreateDirectory "$INSTDIR\assets\audio\music"
    CreateDirectory "$INSTDIR\assets\audio\sfx"
    CreateDirectory "$INSTDIR\assets\audio\ambient"
    CreateDirectory "$INSTDIR\assets\images"
    CreateDirectory "$INSTDIR\assets\icons"
    CreateDirectory "$INSTDIR\assets\tilesets"
    CreateDirectory "$INSTDIR\src"
    CreateDirectory "$INSTDIR\src\core"
    CreateDirectory "$INSTDIR\src\entities"
    CreateDirectory "$INSTDIR\src\systems"
    CreateDirectory "$INSTDIR\src\audio"
    CreateDirectory "$INSTDIR\src\tilesets"
    CreateDirectory "$INSTDIR\src\networking"
    CreateDirectory "$INSTDIR\src\config"
    CreateDirectory "$INSTDIR\src\utils"
    CreateDirectory "$INSTDIR\src\ui"
    
    ; Copy application files
    File "..\..\dist\index.html"
    File "..\..\dist\manifest.json"
    File "..\..\dist\sw.js"
    File "..\..\dist\package.json"
    File "..\..\dist\README.md"
    File "..\..\dist\LICENSE"
    
    ; Copy assets
    File /r "..\..\dist\assets\*.*"
    
    ; Copy source code
    File /r "..\..\dist\src\*.*"
    
    ; Create desktop shortcut
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\index.html" "" "$INSTDIR\${APP_NAME}.exe" 0
    
    ; Create start menu shortcut
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\index.html" "" "$INSTDIR\${APP_NAME}.exe" 0
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\Uninstall.lnk" "$INSTDIR\uninstall.exe"
    
    ; Write installation log
    FileOpen $0 "$INSTDIR\install.log" w
    FileWrite $0 "Installation Date: $%DATE% at %TIME%$\r$\n"
    FileWrite $0 "Version: ${APP_VERSION}$\r$\n"
    FileWrite $0 "Install Path: $INSTDIR$\r$\n"
    FileClose $0

SectionEnd

; Section "Desktop Shortcut"
Section "Desktop Shortcut" SEC02

    ; Create desktop shortcut
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\index.html" "" "$INSTDIR\${APP_NAME}.exe" 0

SectionEnd

; Section "Start Menu Shortcut"
Section "Start Menu Shortcut" SEC03

    ; Create start menu shortcut
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\index.html" "" "$INSTDIR\${APP_NAME}.exe" 0

SectionEnd

; Section /o "Run Application" SEC04
Section /o "Run Application" SEC04

    ; Run the application after installation
    ExecShell "open" "$INSTDIR\index.html"

SectionEnd

; Section "Uninstall"
Section "Uninstall"

    ; Remove registry keys
    DeleteRegKey HKLM "${REGKEY}"
    
    ; Remove files and directories
    RMDir /r "$INSTDIR"
    
    ; Remove desktop shortcut
    Delete "$DESKTOP\${APP_NAME}.lnk"
    
    ; Remove start menu shortcuts
    RMDir /r "$SMPROGRAMS\${APP_NAME}"
    
    ; Show completion message
    MessageBox MB_OK "${APP_NAME} has been uninstalled successfully."

SectionEnd

; Function .onInit
Function .onInit

    ; Check Windows version
    ${IfNot} ${AtLeastWin7}
        MessageBox MB_OK|MB_ICONSTOP "${APP_NAME} requires Windows 7 or later."
        Abort
    ${EndIf}
    
    ; Check if already installed
    ReadRegStr $0 HKLM "${REGKEY}" "UninstallString"
    StrCmp $0 "" done
    
    MessageBox MB_YESNO|MB_ICONQUESTION "${APP_NAME} is already installed. $\n$\nDo you want to uninstall the previous version first?" IDNO done
    
    ; Run the uninstaller
    ExecWait '$0 _?=$INSTDIR'
    
    done:

FunctionEnd

; Function .onInstSuccess
Function .onInstSuccess

    ; Show success message
    MessageBox MB_OK "${APP_NAME} has been installed successfully."

FunctionEnd