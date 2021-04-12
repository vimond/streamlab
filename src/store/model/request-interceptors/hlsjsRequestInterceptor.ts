import { AdditionalRequestData } from '../streamDetails';

export const getHlsJsRequestInterceptorConfig = (
  withCredentials: boolean,
  additionalRequestData?: AdditionalRequestData
): any => {
  const xhrSetup = (xhr: XMLHttpRequest) => {
    if (withCredentials || (additionalRequestData && additionalRequestData.withCredentials)) {
      xhr.withCredentials = true;
    }
    if (additionalRequestData) {
      additionalRequestData.headers.forEach(({ name, value }) => xhr.setRequestHeader(name, value));
    }
  };

  return {
    hlsjs: {
      customConfiguration: {
        xhrSetup,
      },
    },
  };
};
