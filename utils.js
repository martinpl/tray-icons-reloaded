const ExtensionUtils = imports.misc.extensionUtils;
const Gio = imports.gi.Gio;
const GioSSS = Gio.SettingsSchemaSource;

const getSettings = function () {
	const schemaDir = ExtensionUtils.getCurrentExtension().dir.get_child('schema').get_path();
	const schemaSource = GioSSS.new_from_directory(schemaDir, GioSSS.get_default(), false);
    return new Gio.Settings({ settings_schema: schemaSource.lookup('org.gnome.shell.extensions.trayIconsReloaded', true) });
}