<img src="/src/graphics/streamlab-logo.svg" alt="Streamlab" width="30%"/>

[Streamlab](https://vimond.github.io/streamlab/) is a cross-technology stream test tool for the browser, created by, and used by [Vimond](https://vimond.com) developers.

Experiment with, verify, or troubleshoot MPEG-DASH, HLS, CMAF, and smooth streams, or progressive video files. 

The Streamlab provides a consistent and convenient user interface for playing adaptive streams through [Shaka Player](https://github.com/google/shaka-player), [RxPlayer](https://github.com/canalplus/rx-player), and [HLS.js](https://github.com/video-dev/hls.js), or directly through the browser's internal stream support in the HTML `<video>` element.

It is built upon [Replay](https://github.com/vimond/replay), a full-featured open source React video player component facilitating adaptive stream playback, wrapping the mentioned adaptive streaming players.

## Features

Streamlab is intended to bring convenience to trying out streams in the browser.

Fill in stream URLs and configure playback, and the setup will be persisted between browser sessions (and closed/reopened tabs). All playback attempts are added to a history, and earlier stream URLs and other details can be restored and retried. 

It displays context-aware messages providing information and guidance on technical stream details, and attempts to bring error details up to the surface when the stream doesn't play.

Streamlab supports live/DVR streams, DRM, subtitles, multiple audio tracks, according to the features of the adaptive player libraries' mentioned above. All modern browsers are supported.

Streamlab provides auto-detection of stream technologies (formats), and selects a preferred player library for playing it back. This can be overridden with manual selection of the player libraries mentioned above.

[Try it out here](https://vimond.github.io/streamlab/).

## Working with the source code

Sometimes it can be convenient running Streamlab locally in order to tweak extra settings, add more debugging, or get the benefit of less browser limitations through `localhost`. In brief, follow these steps to get it up and running, assuming having [Node.js](https://nodejs.org) 10.16 or newer installed on your computer, along with npm.

1. Clone this repo to your local computer.
2. Run `npm install`.
3. Run `npm start`.

Streamlab is a React app, written with [TypeScript](https://www.typescriptlang.org/), and built with the magnificent UI library [Chakra UI](https://chakra-ui.com/).

It is simply an unejected [Create React App](https://create-react-app.dev/docs/getting-started/), and adheres to the templates and routines provided by this scaffold. Along with that comes using [Jest](https://jestjs.io/) for unit tests, while [Prettier](https://prettier.io/) is added on top for consistent code formatting. [Yarn 1.x](https://classic.yarnpkg.com/lang/en/) has been used for dependency management, however npm should also work fine.

## About

Streamlab is an open source initiative from [Vimond Media Solutions](https://vimond.com).

### License

Streamlab is released under the [Apache 2.0 License](https://github.com/vimond/streamlab/blob/master/LICENSE).

### Authors

Streamlab is developed by Tor Erik Alræk.
