const AppSystem     	= imports.gi.Shell.AppSystem;
const WindowTracker 	= imports.gi.Shell.WindowTracker;
const getSettings		= imports.misc.extensionUtils.getSettings;
const GLib				= imports.gi.GLib;

const getTrayApp = function(icon) {
	if(isWine(icon)) {
		const wineApps = AppSystem.get_default().get_running().filter(app => {
			return app.get_windows()[0].wm_class.includes('.exe');
		});
		return wineApps[0];
	}

	const searchedApps = AppSystem.search(getWmClass(icon.wm_class));
	if(searchedApps[0] && searchedApps[0][0]) {
		var i = 1;
		for(let lookup of searchedApps[0]) {
			let app = AppSystem.get_default().lookup_app(lookup);
			if(app.get_windows() != '' || i == searchedApps[0].length) {
				return app;
			}
			i++;
		}
	} else {
		return false;
	}
}

const toggleWindows = function (icon, event) {
	let trayApp = getTrayApp(icon);
	if(trayApp) {
		let focusedApp = WindowTracker.get_default().focusApp;
		let windows = trayApp.get_windows();

		if(windows == '') {
			if(isUsingQt(getPid(icon))) { return icon.click(event); }
			return trayApp.open_new_window(0);
		}

		if(focusedApp != null && focusedApp.id == trayApp.id) {
			if(isUsingQt(getPid(icon))) { return icon.click(event); }
			focusedApp.get_windows().forEach(window => {
				window.minimize();
			});
		} else {
			windows.forEach(window => {
				if (getSettings().get_boolean('invoke-to-workspace')) {
					window.change_workspace(global.workspace_manager.get_active_workspace());
				}
				trayApp.activate_window(window, event.get_time());
				window.unminimize(event);
			});
		}
	} else {
		icon.click(event);
		if(isWine(icon)) {
			icon.click(event);
		}
	}
}

const killWindows = function (icon, event) {
	if(event.get_state_full()[1] === 1) {	// If holding SHIFT
		let trayApp = getTrayApp(icon);
		if(trayApp) {
			const pid = getPid(icon);
			if(isUsingQt(pid)) { return GLib.spawn_command_line_sync(`/bin/kill ${pid}`); }
			let windows = trayApp.get_windows();
			windows.forEach(window => {
				window.kill();
			});
			trayApp.request_quit();
		}
	}
}

function isWine(icon) {
	if((icon.wm_class == 'Wine' || icon.wm_class == 'explorer.exe') && getSettings().get_boolean('wine-behavior')) {
		return true
	}
}

function isUsingQt(pid) {
	let [ok, out, err, exit] = GLib.spawn_command_line_sync(`/bin/bash -c 'pmap -p ${pid} | grep Qt'`);
	if (out.length) {
		return true;
	}
}

function getWmClass(wmclass) {
	wmclass = wmclass.replace(/[0-9]/g, ''); // skype discord
	wmclass = wmclass.replace('Desktop', ''); // telegram
	return wmclass;
}

function getPid(icon) {
	const wmclass = getWmClass(icon.wm_class);
	if(icon.title != 'snixembed') {
		return icon.pid;
	}

	let [ok, out, err, exit] = GLib.spawn_command_line_sync(`/bin/bash -c "pidof -s ${wmclass}"`);
	if (out.length) {
		return Number(out);
	}
}