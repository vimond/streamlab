
## Roadmap

* `3.0.0` Client-side only
  * Deployment to static site
  * Simple history
  * Missing features like subtitles parsing
* `3.1.0` Share & presets
* `3.2.0` Proxy, enabled for localhost
  * Also processor with Regex rules only
* `3.3.0` Filling in missing features
  * Subtitles parsers
  * Header support for more resources?
  * Smooth support?
  * Widevine + Edge
  * Responsive mode
* `3.4.0` API integrations for stream lookup
  * Vimond-only?

## Some implementation notes

API plugin:

* API host
* API url
* API headers
* API payload
* Define form fields and map to url, headers, and payload.
* Result extraction: [JMES path](http://jmespath.org/)?

[TS to JSON](https://github.com/YousefED/typescript-json-schema)

### Architectural adventures

* Plugin system for stream processor
* Plugin system for API integrations

### Remember

* Play, Clear, Save, History, Share buttons at bottom of right pane.
* Widevine support for Edge! Should enable dropdown.
* Tests!

## Tasks

### v3.0.0

* [x] Rename layout to panels
* [x] Remember accordion expand states
* [x] Accordion folds with "active" settings should be marked. `3.0.0`
* [x] Move "use proxy" and all mentions to branch. `3.0.0`
* [x] Better pane component.
* [x] Create "static"/"client side only" build and deployment. `3.0.0`
* [x] Better linting.
* [x] Collapse right pane.  `3.1.0`
* [x] Version label. `3.2.0`
* [x] All form fields. `3.0.0`
* [x] Headers - disable for stream & subtitles `3.0.0`
* [x] Start from position `3.0.0`
* [x] Message about unsupported subtitle formats (remove SRT temporarily) `3.1.0`
* [x] Message about Chromium Edge and PlayReady `3.0.0`
* [x] Disable cert url for PlayReady `3.1.0`
* [x] Linear history `3.0.0`
* [x] Clear history `3.0.0`
* [x] Sharing `3.1.0`
* [x] JSON editor for modern React. `3.0.0`
* [x] Messages with links explaining which player lib being used.
* [x] Better naming of unlabeled history entries - detected type, e.g. "DASH on example.com"
* [x] Expose Replay and playback methods `3.1.0`
* [x] Special Shaka video streamer with debug/verbose logging. `'shaka-player/dist/shaka-player.compiled.debug'`
* [x] Smooth stream support with RxPlayer? Goes along with override. `3.3.0`
* [x] Log level.
* [x] Rename repos etc.
* [x] Update all text mentioning HLS & DASH to include to smooth.
* [ ] Complete support for both Widevine and PlayReady in Chromium Edge, Windows `3.0.0`
* [ ] Prevent history from being deleted when Redux state shape changes.
* [ ] Demo stream if no real history entries.

### v3.1.0

* [ ] Override HLS.js/Shaka selection. With DRM support. `3.3.0`
* [ ] Try to make Shaka Player (and HLS.js) debuggable as source maps.
* [ ] Nudge and seek controls, configurable intervals. Extra panels/controls for different use, toggleable? `3.2.0`
* [ ] Responsive/mobile mode. Replace with drawer? Might get full rerender when e.g. rotating. Perhaps keep both, and move the sidebar insertion accordingly.
* [ ] Clear unlabeled entries from history.
* [ ] Make updated timestamps in license URLs not generate "duplicate" history entries.
* [ ] Link to Shaka Player error/HLS.js codes (and PlayReady etc.)

### v3.2.0

* [ ] Proxy running only in localhost. Rewrite in TS with tests? Separate repo? Don't break create-react-app...
* [ ] Toggles for proxying different URLs. `3.2.0`
* [ ] Sharing: Fine-grained category inclusion/exclusion `3.2.0`
* [ ] Feature toggle system where proxy or processor things are not visible in static build/deploy. `3.2.0`

### v3.3.0

* [ ] postMessage solution for filling forms with Vimond API lookups. Reverse message for license details renewal? Need to open Streamlab tab from lookup.
* [ ] Practical example with either (VCC API, content discovery, REST API)
* [ ] Resizable player `3.3.0`
* [ ] Parsers for TTML, VTT, SRT? `3.3.0`
* [ ] Guidance for custom configs for Shaka Player.

### v3.4.0

* [ ] History transfer `3.3.0`. import/export commands in console. Maps to `IMPORT_HISTORY` action.
* [ ] Stream processor with regex, HLS, MPD tools.
* [ ] Stream performance analytics/monitoring.

#### Whenever

* [ ] Component tests?
* [ ] Cypress tests? Need example streams.
* [ ] Undo clear button after clear `3.1.0`
* [ ] Save only specific forms `3.3.0`
* [ ] Vimond theme?

Better TS + thunks?
https://levelup.gitconnected.com/set-up-a-typescript-react-redux-project-35d65f14b869
