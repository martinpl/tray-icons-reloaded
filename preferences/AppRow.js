const { GObject, Gtk, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const getSettings = ExtensionUtils.getSettings;
const Me = ExtensionUtils.getCurrentExtension();

var AppRow = GObject.registerClass(
	{
		GTypeName: "AppRow",
		Template: Me.dir.get_child("preferences/AppRow.xml").get_uri(),
		InternalChildren: ["icon", "label", "revealButton", "revealer", "hidden"],
	},
	class AppRow extends Gtk.ListBoxRow {
		_init(app) {
			super._init();
			this._appInfo = Gio.DesktopAppInfo.new(app.id);
			this._settings = getSettings();
			this._icon.gicon = this._appInfo.get_icon();
			this._label.label = this._appInfo.get_display_name();
			this._hidden.set_active(app.hidden);
			this._hidden.connect("state-set", () => {
				this._updateApp();
			});
			this.appId = this._appInfo.get_id();
		}

		toggleSettingsVisibility() {
			this._revealer.reveal_child = !this._revealer.reveal_child;

			if (this._revealer.reveal_child) {
				this._revealButton.get_style_context().add_class("expanded");
			} else {
				this._revealButton.get_style_context().remove_class("expanded");
			}
		}

		removeRow() {
			const current = JSON.parse(this._settings.get_string("applications"));
			const updated = current.filter((app) => app.id !== this.appId);

			this._settings.set_string("applications", JSON.stringify(updated));
		}

		_updateApp() {
			let apps = JSON.parse(this._settings.get_string("applications"));
			const index = apps.findIndex((app) => app.id == this.appId);
			apps[index] = {
				id: this.appId,
				hidden: this._hidden.get_active(),
			};

			this._settings.set_string("applications", JSON.stringify(apps));
		}
	}
);
