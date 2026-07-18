Set WshShell = CreateObject("WScript.Shell")
Set shortcut = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & "\BaziHelper.lnk")
shortcut.TargetPath = Replace(WScript.ScriptFullName, "create_shortcut.vbs", "start_bazi.bat")
shortcut.WorkingDirectory = Replace(WScript.ScriptFullName, "create_shortcut.vbs", "")
shortcut.Description = "Bazi Numerology Assistant"
shortcut.IconLocation = "shell32.dll,13"
shortcut.Save
MsgBox "Shortcut created successfully!"