UUID = trayIconsReloaded@selfmade.pl
FILES = metadata.json extension.js TrayIndicator.js AppManager.js prefs.js stylesheet.css

_build: 
	-rm -fR ./_build
	mkdir -p _build
	cp $(FILES) _build
	mkdir -p _build/schemas
	cp schemas/*.xml _build/schemas/
	cp schemas/gschemas.compiled _build/schemas/


zip: _build
	cd _build ; \
	zip -qr "$(UUID).zip" .
	mv _build/$(UUID).zip ./
	-rm -fR _build