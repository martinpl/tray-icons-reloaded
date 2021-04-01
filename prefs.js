const GObject		= imports.gi.GObject;
const Gtk			= imports.gi.Gtk;
const Gio			= imports.gi.Gio;
const getSettings	= imports.misc.extensionUtils.getSettings;

const settingsWidgets = new GObject.Class({
	Name: 'TrayIcons.Settings',
	Extends: Gtk.Grid,

	_init() {
		this.parent();
		this.margin_top = 32;
		this.margin_bottom = 32;
		this.margin_start = 32;
		this.margin_end = 32;
		this.row_spacing = 16;
		this.halign = Gtk.Align.CENTER;
		this.width_request = 620;
		this._settings = getSettings();

		let label;
		let widget;

		label = new Gtk.Label({ label: 'Tray position', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.ComboBoxText();
		widget.append('left', 'Left');
		widget.append('center', 'Center');
		widget.append('right', 'Right');
		this._settings.bind('tray-position', widget, 'active-id', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 0, 1, 1);
		this.attach(widget, 1, 0, 1, 1);

		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(-99, 99);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Position weight');
		this._settings.bind('position-weight', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(widget, 2, 0, 1, 1);

		label = new Gtk.Label({ label: 'Tray margin', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.SpinButton({halign:Gtk.Align.CENTER});
		widget.set_range(0, 24);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Left margin');
		this._settings.bind('tray-margin-left', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 1, 1, 1);
		this.attach(widget, 1, 1, 1, 1);
		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(0, 24);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Right margin');
		this._settings.bind('tray-margin-right', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(widget, 2, 1, 1, 1);

		label = new Gtk.Label({ label: 'Tray icons limit', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(1, 16);
		widget.set_increments(1, 1);
		this._settings.bind('icons-limit', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 2, 1, 1);
		this.attach(widget, 2, 2, 1, 1);

		label = new Gtk.Label({ label: 'Icon size', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(16, 32);
		widget.set_increments(1, 1);
		this._settings.bind('icon-size', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 3, 1, 1);
		this.attach(widget, 2, 3, 1, 1);

		label = new Gtk.Label({ label: 'Icon margin', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.SpinButton({halign:Gtk.Align.CENTER});
		widget.set_range(0, 24);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Vertical icon margin. NOTE: May not update in real time');
		this._settings.bind('icon-margin-vertical', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 4, 1, 1);
		this.attach(widget, 1, 4, 1, 1);
		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(0, 24);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Horizontal icon margin');
		this._settings.bind('icon-margin-horizontal', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(widget, 2, 4, 1, 1);

		label = new Gtk.Label({ label: 'Icon padding', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.SpinButton({halign:Gtk.Align.CENTER});
		widget.set_range(0, 24);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Vertical icon padding');
		this._settings.bind('icon-padding-vertical', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 5, 1, 1);
		this.attach(widget, 1, 5, 1, 1);
		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(0, 24);
		widget.set_increments(1, 1);
		widget.set_tooltip_text('Horizontal icon padding');
		this._settings.bind('icon-padding-horizontal', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(widget, 2, 5, 1, 1);

		label = new Gtk.Label({ label: 'Icon saturation', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.SpinButton({halign:Gtk.Align.START});
		widget.set_range(0, 100);
		widget.set_increments(10, 20);
		this._settings.bind('icon-saturation', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 6, 1, 1);
		this.attach(widget, 0, 7, 1, 1);

		label = new Gtk.Label({ label: 'Icon contrast', hexpand: true, halign: Gtk.Align.CENTER });
		widget = new Gtk.SpinButton({halign:Gtk.Align.CENTER});
		widget.set_range(-100, 100);
		widget.set_increments(10, 20);
		this._settings.bind('icon-contrast', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 1, 6, 1, 1);
		this.attach(widget, 1, 7, 1, 1);

		label = new Gtk.Label({ label: 'Icon brightness', hexpand: true, halign: Gtk.Align.END });
		widget = new Gtk.SpinButton({halign:Gtk.Align.END});
		widget.set_range(-100, 100);
		widget.set_increments(10, 20);
		this._settings.bind('icon-brightness', widget, 'value', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 2, 6, 1, 1);
		this.attach(widget, 2, 7, 1, 1);

		label = new Gtk.Label({ label: 'Invoke windows to current workspace', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.Switch({ halign: Gtk.Align.END })
		this._settings.bind('invoke-to-workspace', widget, 'active', Gio.SettingsBindFlags.DEFAULT)
		this.attach(label, 0, 8, 2, 1);
		this.attach(widget, 2, 8, 1, 1)

		label = new Gtk.Label({ label: 'Modify Wine apps behavior', hexpand: true, halign: Gtk.Align.START });
		widget = new Gtk.Switch({halign:Gtk.Align.END});
		this._settings.bind('wine-behavior', widget, 'active', Gio.SettingsBindFlags.DEFAULT);
		this.attach(label, 0, 9, 2, 1);
		this.attach(widget, 2, 9, 1, 1);

		this._footer();
	},

	_footer() {
		label = new Gtk.LinkButton({ label: 'GitHub', uri: 'https://github.com/MartinPL/Tray-Icons-Reloaded', hexpand: true, halign: Gtk.Align.CENTER });
		this.attach(label, 0, 10, 3, 1);
	}

});

function buildPrefsWidget() {
	const widgets = new settingsWidgets();

	return widgets;
}

function init() {}
