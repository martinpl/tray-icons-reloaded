# Tray Icons Reloaded
[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" height="100" align="right">](https://extensions.gnome.org/extension/2890/tray-icons-reloaded/)
Tray Icons Reloaded is a GNOME Shell 3.36 extension which bring back Tray Icons to top panel, with additional favore.

### Features
* left click works on apps with don't support this (Steam, Discord etc)
* SHIFT + middle click kill app
* window are invoked to current workspace
* settings (position, icon size, Wine behavior)
* work with Wine in limited way (left and middle click affect all wine apps)

### Installation
Grab it from [extensions.gnome.org](https://extensions.gnome.org/extension/2890/tray-icons-reloaded/) or unzip release to: ~/.local/share/gnome-shell/extensions.

### To-do
* Windows like behavior with toggling windows ;)
* maybe unmap windows when hidden (not sure if is univeral way to x11 & wayland)
* (unlikely) less hacky way to get [shell-app](https://developer.gnome.org/shell/stable/shell-shell-app.html) from [shell-tray-icon](https://developer.gnome.org/shell/stable/shell-shell-tray-icon.html)
* (unlikely) proper Wine support

### Multi icons tray app problem (Wine / Chrome)
This extensions don't work well with app with have more than one tray icon. The issue is that we cannot match [tray icon](https://developer.gnome.org/shell/stable/shell-shell-tray-icon.html) with [appliaction](https://developer.gnome.org/shell/stable/shell-shell-app.html).
Wine: (pid is goint to explorer.exe, title is null, wm_class is Wine)

### Credits
The core functionality was taken from: [unite-shell (hardpixel)](https://github.com/hardpixel/unite-shell) <- [TopIcons Plus (phocean)](https://github.com/phocean/TopIcons-plus) <- [TopTray (mjnaderi)
](https://github.com/mjnaderi/TopTray)