const Main				= imports.ui.main;
const Shell				= imports.gi.Shell;
const Me				= imports.misc.extensionUtils.getCurrentExtension();
const TrayIndicator		= Me.imports.TrayIndicator;
const getSettings		= imports.misc.extensionUtils.getSettings;
const System			= imports.system;

var TrayIconsClass = new imports.lang.Class({
	Name: 'Tray Icons: Reloaded',

	_init() {
		this.tray       = new Shell.TrayManager();
		this.indicators = new TrayIndicator.TrayIndicator();

		this.tray.connect('tray-icon-added', this._onIconAdded.bind(this));
		this.tray.connect('tray-icon-removed', this._onIconRemoved.bind(this));

		this.tray.manage_screen(Main.panel);
	},

	_onIconAdded(trayManager, icon)		 {		this.indicators.addIcon(icon); 		},
	_onIconRemoved(trayManager, icon)	 {		this.indicators.removeIcon(icon);	},

	_destroy() {
		this.tray = null;

		this.indicators.destroy();
		System.gc();
	}
});

let TrayIcons;

class Extension {
	_setIconSize() {
		TrayIcons.indicators.setSize(this._settings.get_int('icon-size'));
	}

	_setTrayArea() {
		Main.panel.addToStatusArea('TrayIconsReloaded' + Math.random(), TrayIcons.indicators, 0, this._settings.get_string('tray-position'));
	}

	_onChange() {
		this._settings.connect('changed::icon-size', this._setIconSize.bind(this));
        this._settings.connect('changed::tray-position', this._setTrayArea.bind(this));
	}

    enable() {
		TrayIcons = new TrayIconsClass();
		this._settings = getSettings('org.gnome.shell.extensions.trayIconsReloaded');
		this._setIconSize();
		this._setTrayArea();
		this._onChange();
    }

    disable() { 
		TrayIcons._destroy();
		this._settings.run_dispose();
	}
}

function init() {
    return new Extension();
}