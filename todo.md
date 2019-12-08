

Layout with [React spaces](https://www.allaneagle.com/projects/react-spaces)

API plugin:
* API host
* API url
* API headers
* API payload
* Define form fields and map to url, headers, and payload.
* Result extraction: [JMES path](http://jmespath.org/)?


[TS to JSON](https://github.com/YousefED/typescript-json-schema)

### Remember

* Accordion folds with "active" settings should be marked.
* Drawer for save/load? Reconsider what to save/load. Easy export/import. Autosave history after each stream start? And then later give names?
* Undo clear button after clear.
* Play, Clear, Save, History, Share buttons at bottom of right pane.
* Widevine support for Edge! Should enable dropdown.
* Tests!

## Tasks

#### Overall

* [ ] Responsive/mobile mode.

#### Stream details

* [ ] All form fields. `3.0.0`
* [ ] Headers - disable for stream & subtitles `3.0.0`
* [ ] Disable cert url for PlayReady
* [ ] Message about Chromium Edge
* [ ] Message about unsupported subtitle formats
* [ ] Parsers for TTML, VTT, SRT? `3.2.0`
* [ ] Override HLS.js/Shaka selection. With DRM support.

#### History

* [ ] Linear history `3.0.0`
* [ ] Presets with categories `3.1.0`
* [ ] Clear & settings `3.1.0`

#### Share

* [ ] Categories `3.1.0`
* [ ] Proxy URLs `3.2.0`
* [ ] History transfer `3.1.0`

#### API lookup

* [ ] Pluggable architecture `3.1.0`
* [ ] Content delivery API `3.1.0`
* [ ] Rest API `3.1.0`

#### Player options

* [ ] JSON editor for modern React. `3.0.0`
* [ ] Log level. `3.0.0`

#### Proxy

* [ ] Implement. `3.2.0`
* [ ] Toggles. `3.2.0`

#### Processor

* [ ] Regex. `3.3.0`
* [ ] HLS tools. `3.4.0`
* [ ] MPD tools. `3.5.0`
