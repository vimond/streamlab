import React from 'react';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import BasicVideoStreamer from 'vimond-replay/video-streamer/basic';
import { contentTypes, StreamTechnology } from '../store/model/streamDetails';
import ShakaDebugVideoStreamer from 'vimond-replay/video-streamer/shaka-player-debug';
import HtmlVideoStreamer from 'vimond-replay/video-streamer/html';
import HlsjsVideoStreamer from 'vimond-replay/video-streamer/hlsjs';
import RxVideoStreamer from 'vimond-replay/video-streamer/rx-player';

export const isSafari = (userAgent: string) =>
  userAgent.indexOf('Safari') > 0 && userAgent.indexOf('Chrome') < 0 && userAgent.indexOf('Firefox') < 0;

const getMatchingVideoStreamer = (source: PlaybackSource | undefined, userAgent: string, props: any) => {
  const contentType = source && typeof source !== 'string' && 'contentType' in source ? source.contentType : '';
  switch (contentType) {
    case contentTypes[StreamTechnology.DASH]:
      return <ShakaDebugVideoStreamer {...props} />;
    case contentTypes[StreamTechnology.MSS]:
      return <RxVideoStreamer {...props} />;
    case contentTypes[StreamTechnology.HLS]:
      if (isSafari(userAgent)) {
        return <HtmlVideoStreamer {...props} />;
      } else {
        return <HlsjsVideoStreamer {...props} />;
      }
    default:
      return <BasicVideoStreamer {...props} />;
  }
};

type Props = {
  source?: PlaybackSource;
};

const VideoStreamerResolver: React.FC<Props> = (props) =>
  getMatchingVideoStreamer(props.source, navigator.userAgent, props);

export default VideoStreamerResolver;
