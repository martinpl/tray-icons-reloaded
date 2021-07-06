const AppSystem = imports.gi.Shell.AppSystem;
const WindowTracker = imports.gi.Shell.WindowTracker;
const getSettings = imports.misc.extensionUtils.getSettings;
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();

var leftClick = function (icon, event) {
	let trayApp = getTrayApp(icon);
	if (trayApp) {
		let focusedApp = WindowTracker.get_default().focusApp;
		let windows = trayApp.get_windows();

		if (windows == "") {
			return openApplication(trayApp, icon, event);
		}

		if (focusedApp != null && focusedApp.id == trayApp.id) {
			return minimizeWindows(focusedApp.get_windows(), icon, event);
		}

		return activateWindows(windows, trayApp, event);
	}

	icon.click(event);

	// On Windows double-click restore app
	if (isWine(icon)) {
		icon.click(event);
	}
};

var middleClick = function (icon, event) {
	// When holding SHIFT
	if (event.get_state_full()[1] === 1) {
		let trayApp = getTrayApp(icon);
		if (trayApp) {
			const pid = getPid(icon);
			// Kill app
			if (isUsingQt(pid)) {
				return GLib.spawn_command_line_sync(`/bin/kill ${pid}`);
			}
			let windows = trayApp.get_windows();
			windows.forEach((window) => {
				window.kill();
			});
			trayApp.request_quit();
		}
	}
};

function getTrayApp(icon) {
	if (isWine(icon)) {
		const wineApps = AppSystem.get_default()
			.get_running()
			.filter((app) => {
				return app.get_windows()[0].wm_class.includes(".exe");
			});
		return wineApps[0];
	}

	const searchedApps = AppSystem.search(getWmClass(icon.wm_class));
	if (searchedApps[0] && searchedApps[0][0]) {
		var i = 1;
		for (let lookup of searchedApps[0]) {
			let app = AppSystem.get_default().lookup_app(lookup);
			if (app.get_windows() != "" || i == searchedApps[0].length) {
				return app;
			}
			i++;
		}
	}

	return false;
}

function openApplication(trayApp, icon, event) {
	const isFlatpak = trayApp.app_info.has_key("X-Flatpak");
	const onBlacklist = Me.metadata["open-blacklist"].includes(icon.wm_class); // Caprine
	if (isUsingQt(getPid(icon)) || isFlatpak || onBlacklist) {
		return icon.click(event);
	}

	return trayApp.open_new_window(0);
}

function minimizeWindows(windows, icon, event) {
	if (isUsingQt(getPid(icon))) {
		return icon.click(event);
	}

	windows.forEach((window) => {
		window.minimize();
	});
}

function activateWindows(windows, trayApp, event) {
	windows.forEach((window) => {
		if (getSettings().get_boolean("invoke-to-workspace")) {
			window.change_workspace(global.workspace_manager.get_active_workspace());
		}
		trayApp.activate_window(window, event.get_time());
		window.unminimize();
	});
}

function isWine(icon) {
	if (
		(icon.wm_class == "Wine" || icon.wm_class == "explorer.exe") &&
		getSettings().get_boolean("wine-behavior")
	) {
		return true;
	}
}

function isUsingQt(pid) {
	let [ok, out, err, exit] = GLib.spawn_command_line_sync(
		`/bin/bash -c 'pmap -p ${pid} | grep Qt'`
	);
	if (out.length) {
		return true;
	}
}

function getWmClass(wmclass) {
	wmclass = wmclass.replace(/[0-9]/g, ""); // skype discord
	wmclass = wmclass.replace("Desktop", ""); // telegram
	return wmclass;
}

function getPid(icon) {
	const wmclass = getWmClass(icon.wm_class);
	if (icon.title != "snixembed") {
		return icon.pid;
	}

	let [ok, out, err, exit] = GLib.spawn_command_line_sync(
		`/bin/bash -c "pidof -s ${wmclass}"`
	);
	if (out.length) {
		return Number(out);
	}
}
