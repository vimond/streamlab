<img src="/src/graphics/streamlab-logo.svg" alt="Streamlab" width="40%"/>

[Streamlab](https://vimond.github.io/streamlab/) is a cross-technology stream test tool for the browser, created by, and used by [Vimond](https://vimond.com) developers.

Experiment with, verify, or troubleshoot MPEG-DASH, HLS, CMAF, and smooth streams, or progressive video files. 

Streamlab provides a consistent and convenient user interface for playing adaptive streams through [Shaka Player](https://github.com/google/shaka-player) and [HLS.js](https://github.com/video-dev/hls.js), or directly through the browser's internal stream support in the HTML `<video>` element.

It is built upon [Replay](https://github.com/vimond/replay), a full-featured React video player component facilitating adaptive stream playback, wrapping the mentioned adaptive streaming players.

## Features

Streamlab is intended to bring convenience to trying out streams in the browser.

Fill in stream URLs and configure playback, and the setup will be persisted between browser sessions (and closed/reopened tabs). All playback attempts are added to a history, and earlier stream URLs and other details can be restored and retried. 

It displays context-aware messages providing information and guidance on technical stream details, and attempts to bring error details up to the surface when the stream doesn't play.

Streamlab supports live/DVR streams, DRM, subtitles, multiple audio tracks, according to the features of the adaptive player libraries' mentioned above. All modern browsers are supported.

[Try it out here](https://vimond.github.io/streamlab/)

## Roadmap

Version 3.0 is the first public release of Streamlab, rebuilt based on two earlier incarnations used internally by Vimond. The roadmap is a suggestion, and comes with no commitment to completeness or time schedule.

#### 3.0

* [x] Forms for specifying stream, DRM, and subtitles URLs
* [x] Stream playback history
* [x] Context-aware information and tips
* [x] Share stream details and configuration with others or across browsers

#### 3.1

* [ ] Override the selection of player library to be used for a stream type. E.g. use Shaka Player also for HLS streams
* [ ] Responsive layout for narrow screens

#### 3.2

* [ ] Parsers for TTML, SRT subtitles
* [ ] More complete smooth streaming support
* [ ] Stream history transfer to different browser

#### Planned side projects

* [ ] Stream proxy with manifest modification tool
* [ ] Vimond API lookup of stream details

## Technologies

Streamlab is built with React, TypeScript, and the magnificent UI library [Chakra UI](https://chakra-ui.com/).

