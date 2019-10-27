// @ts-ignore
import { streamTypes } from 'vimond-replay/components/player/VideoStreamer/CompoundVideoStreamer/helpers.js';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';

export enum BaseTech {
  AUTO
}

export enum StreamTechnology {
  DASH = 1,
  HLS,
  PROGRESSIVE,
  MSS
}

export enum DrmTechnology {
  WIDEVINE = 1,
  PLAYREADY,
  FAIRPLAY
}

export enum SubtitlesFormat {
  WEBVTT = 1,
  TTML,
  SRT
}

export type AutoTechnology<T> = BaseTech | T;

export interface Resource<T> {
  url: string;
  headers: { [key: string]: string };
  useProxy: boolean;
  technology: AutoTechnology<T>;
}

const contentTypes = {
  [StreamTechnology.DASH]: 'application/dash+xml',
  [StreamTechnology.HLS]: 'application/x-mpegurl',
  [StreamTechnology.PROGRESSIVE]: 'video/mp4',
  [StreamTechnology.MSS]: 'application/vnd.ms-sstr+xml'
};

export const detectStreamType = (streamUrl: string) =>
  // @ts-ignore
  streamTypes.find(type => {
    const { urlMatch, urlNotMatch } = type;
    if (urlNotMatch) {
      return urlMatch.test(streamUrl) && !urlNotMatch.test(streamUrl);
    } else {
      return urlMatch.test(streamUrl);
    }
  });

export const createPlayerSource = (
  streamUrl: string,
  technology: StreamTechnology | BaseTech
): PlaybackSource | undefined => {
  if (technology === BaseTech.AUTO) {
    const streamType = detectStreamType(streamUrl);
    if (streamType) {
      return {
        streamUrl,
        contentType: streamType.contentTypes[0]
      };
    }
  } else {
    return {
      streamUrl,
      contentType: contentTypes[technology]
    };
  }
};
