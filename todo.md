
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

#### Overall

* [x] Rename layout to panels
* [x] Remember accordion expand states
* [x] Accordion folds with "active" settings should be marked. `3.0.0`
* [x] Move "use proxy" and all mentions to branch. `3.0.0`
* [x] Better pane component.
* [x] Create "static"/"client side only" build and deployment. `3.0.0`
* [x] Better linting.
* [ ] Collapse right pane.
* [ ] Feature toggle system where proxy or processor things are not visible in "static build/deploy". `3.2.0`
* [ ] Responsive/mobile mode. `3.3.0`
* [ ] Nudge and seek controls, configurable interval. Extra panels/controls for different use, toggleable.
* [ ] Cypress tests?
* [ ] Component tests?
* [ ] Link to Shaka Player error/HLS.js codes (and PlayReady etc.)

Better TS + thunks?
https://levelup.gitconnected.com/set-up-a-typescript-react-redux-project-35d65f14b869

#### Stream details

* [x] All form fields. `3.0.0`
* [x] Headers - disable for stream & subtitles `3.0.0`
* [x] Start from position `3.0.0`
* [x] Message about unsupported subtitle formats (remove SRT temporarily) `3.0.
* [x] Message about Chromium Edge and PlayReady `3.0.0`
* [x] Disable cert url for PlayReady `3.1.0`0`

Next:

* [ ] Support for both Widevine and PlayReady in Chromium Edge, Windows `3.1.0`
* [ ] Parsers for TTML, VTT, SRT? `3.3.0`
* [ ] Override HLS.js/Shaka selection. With DRM support. `3.3.0`
* [ ] Smooth stream support with RxPlayer? Goes along with override. `3.3.0`

#### History

Reconsider what to save/load. Easy export/import. Autosave history after each stream start? And then later give names?

* [x] Linear history `3.0.0`
* [x] Clear history `3.0.0`
* [ ] Undo clear button after clear `3.1.0`
* [ ] Save only specific forms `3.3.0`

#### Share

* [ ] Categories `3.1.0`
* [ ] Proxy URLs `3.3.0`
* [ ] History transfer `3.1.0`

#### API lookup

Only available on localhost?

Create separate page with lookup, and then load Streamlab with details? Practicalities with such a flow can be unclear.

* [ ] Pluggable architecture? `3.4.0`
* [ ] Content delivery API `3.4.0`
* [ ] Rest API `3.4.0`
* [ ] Auth0

#### Player options

https://github.com/satya164/react-simple-code-editor

* [x] JSON editor for modern React. `3.0.0`
* [ ] Log level. `3.1.0`
* [ ] Expose video element...

#### Proxy

* [ ] Feature toggle activation in frontend. `3.2.0`
* [ ] Start localhost with both backend (proxy) and frontend. `3.2.0`
* [ ] Implement with tests. `3.2.0`
* [ ] Toggles for different URLs. `3.2.0`

#### Processor

* [ ] Regex. `3.4.0`
* [ ] HLS tools. `3.6.0`
* [ ] MPD tools. `3.6.0`

#### Replay

* [x] Logo with link when not playing.
* [x] Make dependencies great again.
* [x] Edge/Chromium support.
* [ ] Complete and bring in RxVideoStreamer for smooth streams.



