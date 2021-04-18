import { PlayerConfiguration } from 'vimond-replay/default-player/PlayerConfiguration';
import { AdditionalRequestData } from '../streamDetails';
import { getHlsJsRequestInterceptorConfig } from './hlsjsRequestInterceptor';
import { getShakaRequestInterceptorConfig } from './shakaRequestInterceptor';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';

const getLicenseRequestHeaders = (source: PlaybackSource | undefined) => {
  if (typeof source === 'object' && 'licenseAcquisitionDetails' in source) {
    const headers =
      source.licenseAcquisitionDetails &&
      'licenseRequestHeaders' in source.licenseAcquisitionDetails &&
      source.licenseAcquisitionDetails.licenseRequestHeaders;
    if (headers && Object.keys(headers).length) {
      return headers;
    }
  }
};

export const applyRequestInterceptors = (
  source: PlaybackSource | undefined,
  options: PlayerConfiguration,
  additionalRequestData?: AdditionalRequestData
): PlayerConfiguration => {
  if (source) {
    const videoStreamerConfig = (options && options.videoStreamer) || {};
    const licenseRequestHeaders = getLicenseRequestHeaders(source);
    const withCredentialsConfig = !!(
      videoStreamerConfig.manifestRequests && videoStreamerConfig.manifestRequests.withCredentials
    );

    if (additionalRequestData || withCredentialsConfig) {
      const videoStreamer = {
        ...videoStreamerConfig,
        ...getHlsJsRequestInterceptorConfig(withCredentialsConfig, licenseRequestHeaders, additionalRequestData),
        ...getShakaRequestInterceptorConfig(withCredentialsConfig, additionalRequestData),
      };

      return {
        ...options,
        videoStreamer,
      };
    } else if (licenseRequestHeaders) {
      const videoStreamer = {
        ...videoStreamerConfig,
        ...getHlsJsRequestInterceptorConfig(false, licenseRequestHeaders, undefined),
      };

      return {
        ...options,
        videoStreamer,
      };
    }
  }

  return options;
};
