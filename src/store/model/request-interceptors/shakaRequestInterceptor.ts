import { AdditionalRequestData } from '../streamDetails';

export const getShakaRequestInterceptorConfig = (
  withCredentials: boolean,
  additionalRequestData?: AdditionalRequestData
): any => {
  const shakaRequestFilter = (type: shaka.net.NetworkingEngine.RequestType, request: shaka.extern.Request) => {
    if (type === 1 || type === 0) {
      // shaka.net.NetworkingEngine.RequestType.MANIFEST || .SEGMENT
      if (withCredentials || (additionalRequestData && additionalRequestData.withCredentials)) {
        request.allowCrossSiteCredentials = true;
      }
      if (additionalRequestData) {
        additionalRequestData.headers.forEach(({ name, value }) => (request.headers[name] = value));
      }
    }
  };

  return {
    shakaPlayer: {
      shakaRequestFilter,
    },
  };
};
