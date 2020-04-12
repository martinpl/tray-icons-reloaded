# Tray Icons Reloaded
Tray Icons Reloaded is a GNOME Shell 3.36 extension which bring back Tray Icons to top panel, with additional favore.

# Features
* mouse buttons emulation (left toggle window, middle + SHIFT kill app, right is redirect to app - in most case menu)
* workspace support (windows are invoked to current workspace)
* settings (position, icon size, Wine behavior)
* work with Wine in limited way (left and middle click affect all wine apps)

# Installation
Grab it from extensions.gnome.org (when available) or unzip release to: ~/.local/share/gnome-shell/extensions.

# To-do
* Windows like behavior with toggling windows ;)
* maybe unmap windows when hidden (not sure if is univeral way to x11 & wayland)
* (unlikely) less hacky way to get [shell-app](https://developer.gnome.org/shell/stable/shell-shell-app.html) from [shell-tray-icon](https://developer.gnome.org/shell/stable/shell-shell-tray-icon.html)
* (unlikely) proper Wine support

# Multi icons tray app problem (Wine / Chrome)
This extensions don't work well with app with have more than one tray icon. The issue is that we cannot match [tray icon](https://developer.gnome.org/shell/stable/shell-shell-tray-icon.html) with [appliaction](https://developer.gnome.org/shell/stable/shell-shell-app.html).
Wine: (pid is goint to explorer.exe, title is null, wm_class is Wine)

# Credits
The core functionality was taken from: [unite-shell (hardpixel)](https://github.com/hardpixel/unite-shell) <- [TopIcons Plus (phocean)](https://github.com/phocean/TopIcons-plus) <- [TopTray (mjnaderi)
](https://github.com/mjnaderi/TopTray)