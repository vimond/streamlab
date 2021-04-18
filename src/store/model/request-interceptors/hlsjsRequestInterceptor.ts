import { AdditionalRequestData } from '../streamDetails';

export const getHlsJsRequestInterceptorConfig = (
  withCredentials: boolean,
  headers?: { [key: string]: string },
  additionalRequestData?: AdditionalRequestData
): any => {
  const customConfiguration: any = {};

  if (headers) {
    customConfiguration.licenseXhrSetup = (xhr: XMLHttpRequest) => {
      if (Object.keys(headers).filter((k) => k.toLowerCase() === 'authorization')) {
        xhr.withCredentials = true;
      }
      Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    };
  }

  if (additionalRequestData || withCredentials) {
    customConfiguration.xhrSetup = (xhr: XMLHttpRequest) => {
      if (withCredentials || (additionalRequestData && additionalRequestData.withCredentials)) {
        xhr.withCredentials = true;
      }
      if (additionalRequestData) {
        additionalRequestData.headers.forEach(({ name, value }) => xhr.setRequestHeader(name, value));
      }
    };
  }

  return {
    hlsjs: {
      customConfiguration,
    },
  };
};
