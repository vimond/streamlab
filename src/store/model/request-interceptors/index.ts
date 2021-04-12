import { PlayerConfiguration } from 'vimond-replay/default-player/PlayerConfiguration';
import { AdditionalRequestData } from '../streamDetails';
import { getHlsJsRequestInterceptorConfig } from './hlsjsRequestInterceptor';
import { getShakaRequestInterceptorConfig } from './shakaRequestInterceptor';

export const applyRequestInterceptors = (
  options: PlayerConfiguration,
  additionalRequestData?: AdditionalRequestData
): PlayerConfiguration => {
  const videoStreamerConfig = (options && options.videoStreamer) || {};
  const withCredentialsConfig = !!(
    videoStreamerConfig.manifestRequests && videoStreamerConfig.manifestRequests.withCredentials
  );

  if (additionalRequestData || withCredentialsConfig) {
    const videoStreamer = {
      ...videoStreamerConfig,
      ...getHlsJsRequestInterceptorConfig(withCredentialsConfig, additionalRequestData),
      ...getShakaRequestInterceptorConfig(withCredentialsConfig, additionalRequestData),
    };

    return {
      ...options,
      videoStreamer,
    };
  }

  return options;
};
