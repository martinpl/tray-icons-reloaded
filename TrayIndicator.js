const Clutter		= imports.gi.Clutter;
const GObject		= imports.gi.GObject;
const St			= imports.gi.St;
const PanelMenu		= imports.ui.panelMenu;
const PopupMenu		= imports.ui.popupMenu
const Me			= imports.misc.extensionUtils.getCurrentExtension();
const AppManager	= Me.imports.AppManager;
const GLib			= imports.gi.GLib;
const getSettings	= imports.misc.extensionUtils.getSettings;

var TrayIndicator = new imports.lang.Class({
	Name: 'TrayIndicator',
	Extends: PanelMenu.Button,

	_init() {
		this._icons = [];

		this.parent(0.0, null, false);
		this.style_class = 'panel-button TrayIndicator'; 
		this._overflow = false;

		this._indicators = new St.BoxLayout();
		this.add_child(this._indicators);

		this._icon = new St.Icon({
			icon_name: 'view-more-horizontal',
			style_class: 'system-status-icon',
			reactive: true,
			track_hover: true,
			visible: false
		});
		this._indicators.add_child(this._icon);

		this._menuItem = new PopupMenu.PopupBaseMenuItem({ reactive: false, can_focus: true });
		this.menu.addMenuItem(this._menuItem);
		this.menu.actor.add_style_class_name('TrayIndicatorPopup');
	},

	get size() {
		const context = St.ThemeContext.get_for_stage(global.stage);
		return this._size * context.scale_factor;
	},

	setSize(size, margin, padding) {
		this._size = size;
		this._margin = margin;
		this._padding = padding;

		this._icons.forEach(icon => {
			icon.get_parent().style = this._getButtonStyle();
			icon.set_size(this._size, this._size);
		});
	},

	addIcon(icon) {
		const button = new St.Button({ child: icon, button_mask: St.ButtonMask.ONE | St.ButtonMask.TWO | St.ButtonMask.THREE, style: this._getButtonStyle() });

		icon.opacity = 0;
		icon.set_x_align(Clutter.ActorAlign.CENTER);
		icon.set_y_align(Clutter.ActorAlign.CENTER);
		icon.inOverflow = this._overflow;
		GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
			icon.set_size(this.size, this.size);
			icon.ease({
				opacity: 255,
				duration: 400,
				mode: Clutter.AnimationMode.EASE_OUT_QUAD
			})
			this._addEffectIcon(icon);
			return GLib.SOURCE_REMOVE;
		});
		icon.connect('destroy', () => { button.destroy(); });

		button.connect('button-release-event', (actor, event) => {
			switch(event.get_button()) {
				case 1: AppManager.toggleWindows(icon, event);		break;
				case 2: AppManager.killWindows(icon, event);		break;
				case 3: icon.click(event);							break;
			}
			if(AppManager.isWine(icon)) {
				GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1, () => {
					this.menu.close();
					return GLib.SOURCE_REMOVE;
				});
			} else {
				this.menu.close();
			}
		});

		this._icons.push(icon);

		if(this._overflow) {
			this._menuItem.actor.add(button);
		} else {
			this._indicators.insert_child_at_index(button, 0);
		}

		this.checkOverflow();
	},


	removeIcon(icon, ignoreCheckOverflow) {
		const index = this._icons.indexOf(icon);
		this._icons.splice(index, 1);		

		const actor = icon.get_parent();
		actor.remove_actor(icon);
		actor.destroy();

		if(!ignoreCheckOverflow) {
			this.checkOverflow();
		}
	},

	checkOverflow() {
		if(this._icons.length >= getSettings().get_int('icons-limit')) {
			this._overflow = true;
			this._icon.visible = true;
			this.style_class = 'panel-button';
			this.reactive = true;
		} else {
			this._overflow = false;
			this._icon.visible = false;
			this.style_class = 'panel-button TrayIndicator'; 
			this.reactive = false;
		}

		if(this._icons.length) {
			this.visible = true;
		} else {
			this.visible = false;
		}
		
		this._refreshIcons(this._overflow);
	},

	_refreshIcons(overflow) {
		this._icons.forEach(icon => {
			if(icon.inOverflow != overflow) {
				this.removeIcon(icon, true);
				this.addIcon(icon);
			}
		});
	},

	_getButtonStyle() {
		let style;
		if(!this._overflow) {
			style = `margin: ${this._margin.vertical}px ${this._margin.horizontal}px; padding: ${this._padding.vertical}px ${this._padding.horizontal}px`;
		}
		return `width: ${this.size}px; height: ${this.size}px;${style}`;
	},

	_addEffectIcon(icon) {
		let brightnessContrast = new Clutter.BrightnessContrastEffect({});
		brightnessContrast.set_contrast(getSettings().get_int('icon-contrast') / 100);
		brightnessContrast.set_brightness(getSettings().get_int('icon-brightness') / 100);
		icon.add_effect_with_name('brightnessContrast', brightnessContrast);
		icon.add_effect_with_name('desaturate', new Clutter.DesaturateEffect({factor: getSettings().get_int('icon-saturation') / 100}));
	},

	setEffect(contrast, saturation, brightness) {
		this._icons.forEach(icon => {
			let brightnessContrast = icon.get_effect('brightnessContrast');
			brightnessContrast.set_contrast(contrast / 100);
			brightnessContrast.set_brightness(brightness / 100);

			let desaturate = icon.get_effect('desaturate');
			desaturate.set_factor(saturation / 100);

		});
	}

});