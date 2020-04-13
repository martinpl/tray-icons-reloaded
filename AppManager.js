const AppSystem     	= imports.gi.Shell.AppSystem;
const WindowTracker 	= imports.gi.Shell.WindowTracker;
const getSettings		= imports.misc.extensionUtils.getSettings;

const getTrayApp = function(icon) {
	const blacklist = ['Google-chrome', 'Chromium'];
	if(blacklist.includes(icon.wm_class)) { return false; }

	const trayApp = AppSystem.get_default().get_running().filter(app => { // Returns only applications which at least one window
		return app.get_pids() == icon.pid;  // Some app return pid -1 (Steam)
	});

	if(trayApp.length) {
		return trayApp[0];
	} else if(icon.title) {
		const searchedApps = AppSystem.search(icon.title);
		if(searchedApps[0][0]) {
			var i = 1;
			for(let lookup of searchedApps[0]) {
				let app = AppSystem.get_default().lookup_app(lookup);
				if(app.get_windows() != '' || i == searchedApps[0].length) {
					return app;	
				}
				i++;
			}
		}
	} else if(icon.wm_class == 'Wine' && getSettings.get_boolean('wine-behavior')) {
		const wineApps = AppSystem.get_default().get_running().filter(app => {
			return app.get_windows()[0].wm_class == icon.wm_class;
		});
		return wineApps[0];
	} else {
		return false;
	}
	
}

const toggleWindows = function (icon, event) {
	let trayApp = getTrayApp(icon);
	if(trayApp) {
		let focusedApp = WindowTracker.get_default().focusApp;
		let windows = trayApp.get_windows();
		if(focusedApp != null && focusedApp.id == trayApp.id) {
			focusedApp.get_windows().forEach(window => {
				window.minimize();
			});
		} else if(windows == '') {
			trayApp.open_new_window(0);
		} else {
			windows.forEach(window => {
				window.change_workspace(global.workspace_manager.get_active_workspace());
				trayApp.activate_window(window, event.get_time());
			});
		}
	} else {
		icon.click(event);
	}
}

const killWindows = function (icon, event) {
	if(event.get_state_full()[1] === 1) {	// If holding SHIFT
		let trayApp = getTrayApp(icon);
		if(trayApp) {
			let windows = trayApp.get_windows();
			windows.forEach(window => {
				window.kill();
			});
			trayApp.request_quit();
		}
	}
}