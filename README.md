<img src="/src/graphics/streamlab-logo.svg" alt="Streamlab" width="40%"/>

[Streamlab](https://vimond.github.io/streamlab-2/) is a cross-technology stream test tool for the browser from [Vimond](https://vimond.com) developers.

Experiment with, verify, or troubleshoot MPEG-DASH, HLS, and CMAF streams, or progressive video files. 

Streamlab provides a consistent and convenient user interface for playing adaptive streams through [Shaka Player](https://github.com/google/shaka-player) and [HLS.js](https://github.com/video-dev/hls.js), or directly through the browser's internal stream support in the HTML `<video>` element.

Streamlab is built upon [Replay](https://github.com/vimond/replay), a full-featured React video player component facilitating adaptive stream playback, wrapping the mentioned adaptive streaming players.

## Features

It supports live/DVR streams, DRM, subtitles, multiple audio tracks, according to the mentioned adaptive player libraries' features. All modern browsers are supported.

Streamlab is intended to bring convenience to trying out streams in the browser.

Fill in stream URLs and configure playback, and the setup will be persisted between browser sessions (and closed/reopened tabs). All playback attempts are added to a history, and earlier stream URLs and other details can be restored and retried. 

It displays context-aware messages providing information and guidance on technical stream details, and attempts to bring error details up to the surface when the stream doesn't play.

[Try it out here](https://vimond.github.io/streamlab-2/)

## Roadmap

Version 3.0 is the first public release of Streamlab, rebuilt based on two earlier incarnations used internally by Vimond. The roadmap is a suggestion, and comes with no commitment to completeness or time schedule.

#### 3.0

* [x] Forms for specifying stream, DRM, and subtitles URLs
* [x] Stream playback history
* [x] Context-aware information and tips

#### 3.1

* [ ] Share stream details and configuration with others or across browsers
* [ ] Override the selection of player library to be used for a stream type. E.g. use Shaka Player also for HLS streams
* [ ] Responsive layout for narrow screens

#### 3.2

* [ ] Parsers for TTML, SRT subtitles
* [ ] Smooth streaming support
* [ ] Stream history transfer to different browser

#### Planned side projects

* [ ] Stream proxy with manifest modification tool
* [ ] Vimond API lookup of stream details

## Technologies

Streamlab is built with React, TypeScript, and the magnificent UI library [Chakra UI](https://chakra-ui.com/).

## About

Streamlab is an open source initiative from [Vimond Media Solutions](https://vimond.com).

### License

Streamlab is released under the [Apache 2.0 License](https://github.com/vimond/streamlab-2/blob/master/LICENSE).

### Authors

Replay is developed by Tor Erik Alræk.
