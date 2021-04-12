import {
  streamTypes,
  isLegacyMicrosoft,
  isChromiumEdgeOnWindows,
  isSafari,
  // @ts-ignore
} from 'vimond-replay/components/player/VideoStreamer/CompoundVideoStreamer/helpers.js';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';

export enum BaseTech {
  AUTO,
}

// The following enum member orders should be considered as "sealed"/"final",
// and never be changed, for backward compatibility in history and link sharing.

export enum StreamTechnology {
  DASH = 1,
  HLS,
  PROGRESSIVE,
  MSS,
}

export enum DrmTechnology {
  WIDEVINE = 1,
  PLAYREADY,
  FAIRPLAY,
}

export enum SubtitlesFormat {
  WEBVTT = 1,
  TTML,
  SRT,
}

export type AutoTechnology<T> = BaseTech | T;

export type Header = { id: number; name: string; value: string };

export interface Resource<T> {
  url: string;
  headers: Header[];
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

export type AdditionalRequestData = {
  withCredentials?: boolean;
  headers: Header[];
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
  DEBUG,
  VERBOSE,
}

export const playerLibraries = {
  AUTO: 'Automatic selection',
  SHAKA_PLAYER: 'Shaka Player',
  HLS_JS: 'HLS.js',
  RX_PLAYER: 'RxPlayer',
  HTML: 'Native browser playback through HTML <video> element',
};

// Union instead of enum. Perhaps refactor similar types above for consistency.
export type PlayerLibrary = keyof typeof playerLibraries;

export const DEFAULT_PLAYER_LOG_LEVEL = PlayerLogLevel.WARNING;

type PlayerOptions = {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
};

export const contentTypes = {
  [StreamTechnology.DASH]: 'application/dash+xml',
  [StreamTechnology.HLS]: 'application/x-mpegurl',
  [StreamTechnology.PROGRESSIVE]: 'video/mp4',
  [StreamTechnology.MSS]: 'application/vnd.ms-sstr+xml',
};

const reverseContentTypes: { [key: string]: StreamTechnology } = Object.entries(contentTypes)
  .map((kv) => kv.reverse())
  .reduce((obj, [key, val]) => {
    obj[key] = Number(val) as StreamTechnology;
    return obj;
  }, {} as { [key: string]: StreamTechnology });

const drmSchemes = {
  [DrmTechnology.WIDEVINE]: 'com.widevine.alpha',
  [DrmTechnology.PLAYREADY]: 'com.microsoft.playready',
  [DrmTechnology.FAIRPLAY]: 'com.apple.fps.1_0',
};

const subtitlesContentTypes = {
  [SubtitlesFormat.WEBVTT]: 'text/vtt',
  [SubtitlesFormat.TTML]: 'application/ttml+xml',
  [SubtitlesFormat.SRT]: 'text/srt',
};

export const streamTechLabels = [
  {
    key: BaseTech.AUTO,
    label: 'Auto',
  },
  {
    key: StreamTechnology.DASH,
    label: 'MPEG-DASH',
  },
  {
    key: StreamTechnology.HLS,
    label: 'HLS',
  },
  {
    key: StreamTechnology.MSS,
    label: 'Smooth stream',
  },
  {
    key: StreamTechnology.PROGRESSIVE,
    label: 'Progressive video',
  },
];

export const drmTechLabels = [
  {
    key: DrmTechnology.WIDEVINE,
    label: 'Widevine',
  },
  {
    key: DrmTechnology.PLAYREADY,
    label: 'PlayReady',
  },
  {
    key: DrmTechnology.FAIRPLAY,
    label: 'FairPlay',
  },
];

export const subtitlesFormatLabels = [
  {
    key: BaseTech.AUTO,
    label: 'Auto',
  },
  {
    key: SubtitlesFormat.WEBVTT,
    label: 'WebVTT',
  },
  {
    key: SubtitlesFormat.TTML,
    label: 'TTML (DXFP)',
  } /*, // Not supported yet:
  {
    key: SubtitlesFormat.SRT,
    label: 'SRT (SubRip)'
  }*/,
];

const getContentType = (streamType?: { contentTypes: string[] }) => {
  if (streamType) {
    return streamType.contentTypes[0];
  }
};

interface DetectedStreamType {
  name: string;
  label: string;
  contentTypes: string[];
}

export const detectStreamType = (streamUrl: string): DetectedStreamType | undefined =>
  // @ts-ignore
  streamTypes.find((type) => {
    const { urlMatch, urlNotMatch } = type;
    if (urlNotMatch) {
      return urlMatch.test(streamUrl) && !urlNotMatch.test(streamUrl);
    } else {
      return urlMatch.test(streamUrl);
    }
  });

export const detectStreamTechnology = (streamUrl: string): StreamTechnology | undefined => {
  const streamType = detectStreamType(streamUrl);
  if (streamType) {
    return reverseContentTypes[streamType.contentTypes[0]];
  }
};

export const detectSupportedDrmTechnologies = (userAgent: string) => {
  if (isLegacyMicrosoft(userAgent)) {
    return [DrmTechnology.PLAYREADY];
  } else if (isChromiumEdgeOnWindows(userAgent)) {
    return [DrmTechnology.PLAYREADY, DrmTechnology.WIDEVINE];
  } else if (isSafari(userAgent)) {
    return [DrmTechnology.FAIRPLAY];
  } else {
    // Firefox, Chrome, Chromium Edge on Mac etc.
    return [DrmTechnology.WIDEVINE];
  }
};

export const detectSubtitlesFormat = (subtitlesUrl: string) => {
  if (/\.vtt/.test(subtitlesUrl)) {
    return SubtitlesFormat.WEBVTT;
  } else if (/(\.ttml|\.dxfp|\.xml)/.test(subtitlesUrl)) {
    return SubtitlesFormat.TTML;
  } else if (/\.srt/.test(subtitlesUrl)) {
    return SubtitlesFormat.SRT;
  }
};

export const getLabel = <T extends unknown>(tech: AutoTechnology<T>, options: LabeledTechOption[]) =>
  (options.find(({ key }) => key === tech) || options[0] || { label: '' }).label;

export const createPlayerSource = ({
  streamResource,
  drmLicenseResource,
  drmCertificateResource,
  subtitlesResource,
  startOffset,
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
        startPosition,
      };

      if (drmLicenseResource) {
        const licenseUrl = drmLicenseResource.url;
        if (licenseUrl) {
          source.licenseUrl = licenseUrl;
          source.drmType =
            drmLicenseResource.technology !== BaseTech.AUTO ? drmSchemes[drmLicenseResource.technology] : undefined;
          source.licenseAcquisitionDetails = {};

          if (drmLicenseResource && drmLicenseResource.headers.length) {
            const headers: { [k: string]: string } = {};
            drmLicenseResource.headers.forEach((h) => (headers[h.name] = h.value));
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
            subtitlesResource.technology === BaseTech.AUTO ? detectSubtitlesFormat(src) : subtitlesResource.technology;
          if (subtitlesFormat) {
            const contentType = subtitlesContentTypes[subtitlesFormat];
            const match = src.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
            const hostname = match && match[2];
            const label = `Subtitles file from ${hostname}`;
            source.textTracks = [{ contentType, src, label }];
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

export const extractAdditionalRequestData = ({ streamResource }: StreamDetails): AdditionalRequestData | undefined => {
  if (streamResource.headers && streamResource.headers.length) {
    const additionalRequestData: AdditionalRequestData = {
      headers: streamResource.headers,
    };

    if (streamResource.headers.some((h) => h.name && h.name.toLowerCase() === 'authorization')) {
      additionalRequestData.withCredentials = true;
    }
    return additionalRequestData;
  }
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
