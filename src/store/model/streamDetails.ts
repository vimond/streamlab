
import {
  streamTypes,
  isMicrosoft,
  isSafari
// @ts-ignore
} from 'vimond-replay/components/player/VideoStreamer/CompoundVideoStreamer/helpers.js';
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
  headers: { name: string; value: string; id: number }[];
  useProxy: boolean;
  technology: AutoTechnology<T>;
}

type StreamDetails = {
  streamResource: Resource<StreamTechnology>;
  drmLicenseResource?: Resource<DrmTechnology>;
  drmCertificateResource?: Resource<DrmTechnology>;
  subtitlesResource?: Resource<SubtitlesFormat>;
};

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

const getContentType = (streamType?: { contentTypes: string[] }) => {
  if (streamType) {
    return streamType.contentTypes[0];
  }
};

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

export const createPlayerSource = (
  { streamResource, drmLicenseResource, drmCertificateResource, subtitlesResource }: StreamDetails,
  userAgent: string
): PlaybackSource | undefined => {
  const streamUrl = streamResource.url;
  if (streamUrl) {
    const contentType =
      streamResource.technology === BaseTech.AUTO
        ? getContentType(detectStreamType(streamUrl))
        : contentTypes[streamResource.technology];
    if (contentType) {
      const source: PlaybackSource = {
        streamUrl,
        contentType
      };

      const licenseUrl = drmLicenseResource && drmLicenseResource.url;
      if (licenseUrl) {
        source.licenseUrl = licenseUrl;
        source.licenseAcquisitionDetails = {};

        if (drmLicenseResource && drmLicenseResource.headers.length) {
          const headers: { [k: string]: string } = {};
          drmLicenseResource.headers.forEach(h => (headers[h.name] = h.value));
          source.licenseAcquisitionDetails.licenseRequestHeaders = headers;
        }

        const certificateUrl = drmCertificateResource && drmCertificateResource.url;
        if (certificateUrl) {
          const drmType = detectDrmType(userAgent);
          if (drmType === DrmTechnology.WIDEVINE) {
            source.licenseAcquisitionDetails.widevineServiceCertificateUrl = certificateUrl;
          } else if (drmType === DrmTechnology.FAIRPLAY) {
            source.licenseAcquisitionDetails.fairPlayCertificateUrl = certificateUrl;
          }
        }
      }

      const subtitlesUrl = subtitlesResource && subtitlesResource.url;
      if (subtitlesUrl) {
        const subtitlesFormat = detectSubtitlesType(subtitlesUrl);
        if (subtitlesFormat) {
          source.textTracks = [{ contentType, src: subtitlesUrl }];
        }
      }
      return source;
    }
  }
};
