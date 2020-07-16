import {
  streamTypes,
  isMicrosoft,
  isSafari
  // @ts-ignore
} from 'vimond-replay/components/player/VideoStreamer/CompoundVideoStreamer/helpers.js';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';

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
  headers: { id: number; name: string; value: string }[];
  useProxy: boolean;
  technology: AutoTechnology<T>;
}

type StreamDetails = {
  streamResource: Resource<StreamTechnology>;
  drmLicenseResource?: Resource<DrmTechnology>;
  drmCertificateResource?: Resource<DrmTechnology>;
  subtitlesResource?: Resource<SubtitlesFormat>;
  startOffset?: number | '';
};

export type LabeledTechOption = {
  key: BaseTech | StreamTechnology | DrmTechnology | SubtitlesFormat;
  label: string;
};

export enum PlayerLogLevel {
  NONE,
  ERROR,
  WARNING,
  INFO,
  DEBUG
}

type PlayerOptions = {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
};

const contentTypes = {
  [StreamTechnology.DASH]: 'application/dash+xml',
  [StreamTechnology.HLS]: 'application/x-mpegurl',
  [StreamTechnology.PROGRESSIVE]: 'video/mp4',
  [StreamTechnology.MSS]: 'application/vnd.ms-sstr+xml'
};

const drmTypes = {
  [DrmTechnology.WIDEVINE]: 'com.widevine.alpha',
  [DrmTechnology.PLAYREADY]: 'com.microsoft.playready',
  [DrmTechnology.FAIRPLAY]: 'com.apple.fps.1_0'
};

const subtitlesContentTypes = {
  [SubtitlesFormat.WEBVTT]: 'text/vtt',
  [SubtitlesFormat.TTML]: 'application/ttml+xml',
  [SubtitlesFormat.SRT]: 'text/srt'
};

export const streamTechLabels = [
  {
    key: BaseTech.AUTO,
    label: 'Auto'
  },
  {
    key: StreamTechnology.DASH,
    label: 'MPEG-DASH'
  },
  {
    key: StreamTechnology.HLS,
    label: 'HLS'
  },
  {
    key: StreamTechnology.PROGRESSIVE,
    label: 'Progressive video'
  }
];

export const drmTechLabels = [
  {
    key: DrmTechnology.WIDEVINE,
    label: 'Widevine'
  },
  {
    key: DrmTechnology.PLAYREADY,
    label: 'PlayReady'
  },
  {
    key: DrmTechnology.FAIRPLAY,
    label: 'FairPlay'
  }
];

export const subtitlesFormatLabels = [
  {
    key: BaseTech.AUTO,
    label: 'Auto'
  },
  {
    key: SubtitlesFormat.WEBVTT,
    label: 'WebVTT'
  },
  {
    key: SubtitlesFormat.TTML,
    label: 'TTML (DXFP)'
  } /*, // Not supported yet:
  {
    key: SubtitlesFormat.SRT,
    label: 'SRT (SubRip)'
  }*/
];

const getContentType = (streamType?: { contentTypes: string[] }) => {
  if (streamType) {
    return streamType.contentTypes[0];
  }
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

export const detectDrmType = (userAgent: string) => {
  if (isMicrosoft(userAgent)) {
    return DrmTechnology.PLAYREADY;
  } else if (isSafari(userAgent)) {
    return DrmTechnology.FAIRPLAY;
  } else {
    return DrmTechnology.WIDEVINE;
  }
};

export const detectSubtitlesType = (subtitlesUrl: string) => {
  if (/\.vtt/.test(subtitlesUrl)) {
    return SubtitlesFormat.WEBVTT;
  } else if (/(\.ttml|\.dxfp|\.xml)/.test(subtitlesUrl)) {
    return SubtitlesFormat.TTML;
  } else if (/\.srt/.test(subtitlesUrl)) {
    return SubtitlesFormat.SRT;
  }
};

export const getLabel = <T extends unknown>(tech: AutoTechnology<T>, options: LabeledTechOption[]) =>
  (options.find(({ key }) => key === tech) || options[0]).label;

export const createPlayerSource = ({
  streamResource,
  drmLicenseResource,
  drmCertificateResource,
  subtitlesResource,
  startOffset
}: StreamDetails): PlaybackSource | undefined => {
  const streamUrl = streamResource.url;
  const startPosition = startOffset === '' ? undefined : startOffset;
  if (streamUrl) {
    const contentType =
      streamResource.technology === BaseTech.AUTO
        ? getContentType(detectStreamType(streamUrl))
        : contentTypes[streamResource.technology];
    if (contentType) {
      const source: PlaybackSource = {
        streamUrl,
        contentType,
        startPosition
      };

      if (drmLicenseResource) {
        const licenseUrl = drmLicenseResource.url;
        if (licenseUrl) {
          source.licenseUrl = licenseUrl;
          source.drmType =
            drmLicenseResource.technology !== BaseTech.AUTO ? drmTypes[drmLicenseResource.technology] : undefined;
          source.licenseAcquisitionDetails = {};

          if (drmLicenseResource && drmLicenseResource.headers.length) {
            const headers: { [k: string]: string } = {};
            drmLicenseResource.headers.forEach(h => (headers[h.name] = h.value));
            source.licenseAcquisitionDetails.licenseRequestHeaders = headers;
          }

          const certificateUrl = drmCertificateResource && drmCertificateResource.url;
          if (certificateUrl) {
            if (drmLicenseResource.technology === DrmTechnology.WIDEVINE) {
              source.licenseAcquisitionDetails.widevineServiceCertificateUrl = certificateUrl;
            } else if (drmLicenseResource.technology === DrmTechnology.FAIRPLAY) {
              source.licenseAcquisitionDetails.fairPlayCertificateUrl = certificateUrl;
            }
          }
        }
      }

      if (subtitlesResource) {
        const src = subtitlesResource.url;
        if (src) {
          const subtitlesFormat =
            subtitlesResource.technology === BaseTech.AUTO ? detectSubtitlesType(src) : subtitlesResource.technology;
          if (subtitlesFormat) {
            const contentType = subtitlesContentTypes[subtitlesFormat];
            source.textTracks = [{ contentType, src }];
          }
        }
      }
      return source;
    }
  }
};

export const getLogLevelLabel = (logLevel: PlayerLogLevel) => {
  const found = Object.entries(PlayerLogLevel).find(([key, value]) => logLevel === value);
  return found && found[0];
};

export const createPlayerOptions = ({ logLevel, showPlaybackMonitor, customConfiguration }: PlayerOptions) => {
  const trimmed = customConfiguration.trim();
  let options: PlayerConfiguration = {};
  if (trimmed) {
    try {
      options = JSON.parse(trimmed);
    } catch (e) {}
  }

  options.videoStreamer = options.videoStreamer || {};
  // @ts-ignore
  options.videoStreamer.logLevel = getLogLevelLabel(logLevel);
  // @ts-ignore
  options.playbackMonitor = options.playbackMonitor || {};
  // @ts-ignore
  options.playbackMonitor.visibleAtStart = showPlaybackMonitor;

  return options;
};
