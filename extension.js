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
		const margin = { vertical: this._settings.get_int('icon-margin-vertical'), horizontal: this._settings.get_int('icon-margin-horizontal') }
		const padding = { vertical: this._settings.get_int('icon-padding-vertical'), horizontal: this._settings.get_int('icon-padding-horizontal') }
		TrayIcons.indicators.setSize(this._settings.get_int('icon-size'), margin, padding);
	}

	_setTrayMargin() {
		TrayIcons.indicators.set_style('margin-left: ' + this._settings.get_int('tray-margin-left') + 'px; margin-right: ' + this._settings.get_int('tray-margin-right') + 'px');
	}

	_setTrayArea() {
		Main.panel.addToStatusArea('TrayIconsReloaded' + Math.random(), TrayIcons.indicators, this._settings.get_int('position-weight'), this._settings.get_string('tray-position'));
	}

	_setIconsLimit() {
		TrayIcons.indicators.checkOverflow();
	}

	_setIconEffect() {
		TrayIcons.indicators.setEffect(this._settings.get_int('icon-contrast'), this._settings.get_int('icon-saturation'), this._settings.get_int('icon-brightness'));
	}

	_onChange() {
		this._settings.connect('changed::tray-position', this._setTrayArea.bind(this));
		this._settings.connect('changed::position-weight', this._setTrayArea.bind(this));
		this._settings.connect('changed::tray-margin-left', this._setTrayMargin.bind(this));
		this._settings.connect('changed::tray-margin-right', this._setTrayMargin.bind(this));
		this._settings.connect('changed::icon-size', this._setIconSize.bind(this));
		this._settings.connect('changed::icon-margin-horizontal', this._setIconSize.bind(this));
		this._settings.connect('changed::icon-margin-vertical', this._setIconSize.bind(this));
		this._settings.connect('changed::icon-padding-vertical', this._setIconSize.bind(this));
		this._settings.connect('changed::icon-padding-horizontal', this._setIconSize.bind(this));
		this._settings.connect('changed::icons-limit',  this._setIconsLimit.bind());
		this._settings.connect('changed::icon-saturation', this._setIconEffect.bind(this));
		this._settings.connect('changed::icon-contrast', this._setIconEffect.bind(this));
		this._settings.connect('changed::icon-brightness', this._setIconEffect.bind(this));
	}

	enable() {
		TrayIcons = new TrayIconsClass();
		this._settings = getSettings();
		this._setTrayMargin();
		this._setIconSize();
		this._onChange();

		if (Main.layoutManager._startingUp) {
			this._startupComplete = Main.layoutManager.connect('startup-complete', () => {
				this._setTrayArea();
				Main.layoutManager.disconnect(this._startupComplete);
			});
		} else {
			this._setTrayArea();
		}
	}

	disable() {
		TrayIcons._destroy();
		this._settings.run_dispose();
	}
}

function init() {
	return new Extension();
}