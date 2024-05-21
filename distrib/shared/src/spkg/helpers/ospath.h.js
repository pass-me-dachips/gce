 const osPathLists = {
  mac: {
     home: "~/",
     trash: "~/.Trash",
     data: "~/Library/Application Support/",
     config: "~/Library/Preferences/",
     temp: "/tmp/",
     usrbin: "/Applications/",
     net: "/Network/",
     syslogs: "/var/log",
     sbin: "/bin/",
     libfiles: "/usr/lib/",
     cache: "~/Libary/Caches/",
     cookies: "~/Libary/Cookies/",
     fonts: "~/Libary/Fonts/",
     keychains: "~/Libary/Keychains/",
     agents: "~/Libary/LaunchAgents/",
     daemons: "~/Libary/LaunchDaemons/",
     preferences: "~/Libary/Preferences/",
     savedProgramState: "~/Libary/Saved Application State/"
  },
  linux: {
     home: "~/",
     trash: "~/.local/share/Trash/files",
     data: "~/.local/share/",
     config: "~/.config/",
     temp: "/tmp/",
     usrbin: "/usr/bin/",
     net: "/sbin/",
     syslogs: "/var/log/",
     sbin: "/sbin/",
     libfiles: "/usr/lib/",
     cache: "~/.cache/",
     cookies: "~/.cookies/",
     fonts: "~/.fonts/",
     configs: "~/.config/"
  },
  windows: {
     home: "%USERPROFILE%",
     trash: "%USERPROFILE%\\AppData\\Local\\Microsoft\\Windows\\Temporary Files",
     data: "%APPDATA%",
     config: "%APPDATA%\\Microsoft\\Windows\\Recent",
     temp: "%TEMP%",
     usrbin: "C:\\Program Files\\",
     syslogs: "C:\\Windows\\System32\\winevt\\Logs\\",
     sbin: "C:\\Windows\\System32\\",
     cookies: "%USERPROFILE%\\AppData\\Local\\Microsoft\\Windows\\Cookies",
     fonts: "C:\\Windows\\Fonts",
     configs: "C:\\Windows\\System32\\config"
  },
 }
 export default osPathLists;
 