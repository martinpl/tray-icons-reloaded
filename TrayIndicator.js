const Clutter		= imports.gi.Clutter;
const GObject		= imports.gi.GObject;
const St			= imports.gi.St;
const PanelMenu		= imports.ui.panelMenu;
const Me			= imports.misc.extensionUtils.getCurrentExtension();
const AppManager	= Me.imports.AppManager;
const GLib			= imports.gi.GLib;

var TrayIndicator = new imports.lang.Class({
	Name: 'TrayIndicator',
	Extends: PanelMenu.Button,

	_init() {
		this._icons = [];

		this.parent(0.0, null, true);

		this._indicators = new St.BoxLayout();
		this._indicators.set_style('margin-left: 6px');
		this.add_child(this._indicators);

		this.style_class = '';
	},

	get size() {
		const context = St.ThemeContext.get_for_stage(global.stage);
		return this._size * context.scale_factor;
	},

	setSize(size) {
		this._size = size;

		this._icons.forEach(icon => {
			icon.get_parent().style = this.getButtonStyle();
			icon.set_size(this._size, this._size);
		});
	},

	getButtonStyle() {
		return `padding: 0 8px; margin: 0 2px;width: ${this.size}px; height: ${this.size}px`;
	},

	addIcon(icon) {
		const button = new St.Button({ child: icon, button_mask: St.ButtonMask.ONE | St.ButtonMask.TWO | St.ButtonMask.THREE, style: this.getButtonStyle() });
		
		icon.opacity = 0;
		icon.connect('queue-relayout', () => {
			GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
				icon.set_size(this.size, this.size);
				icon.set_y_align(Clutter.ActorAlign.CENTER);
				icon.ease({
					opacity: 255,
					duration: 400,
					mode: Clutter.AnimationMode.EASE_OUT_QUAD
				})
				return GLib.SOURCE_REMOVE;
			});
		});
		icon.connect('destroy', () => { button.destroy(); });

		this._indicators.add_child(button);

		button.connect('button-release-event', (actor, event) => { 
			switch(event.get_button()) {
				case 1: AppManager.toggleWindows(icon, event);		break;
				case 2: AppManager.killWindows(icon, event);		break;
				case 3: icon.click(event);							break;
			}
		});

		this._icons.push(icon);
	},

	removeIcon(icon) {
		const actor = icon.get_parent() || icon;
		actor.destroy();

		const index = this._icons.indexOf(icon);
		this._icons.splice(index, 1);
	},
});