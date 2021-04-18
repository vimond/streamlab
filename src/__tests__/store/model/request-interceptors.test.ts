import { applyRequestInterceptors } from '../../../store/model/request-interceptors';
import { AdditionalRequestData } from '../../../store/model/streamDetails';

const source = { streamUrl: 'https://example.com' };
const options = {};

describe('Request interceptors', () => {
  describe('Stream request headers', () => {
    test('Applied through xhrSetup in HLS.js', () => {
      const additionalRequestData: AdditionalRequestData = {
        headers: [
          { id: 123, name: 'Authorization', value: 'Bearer Xyz' },
          { id: 456, name: 'X-Custom-Data', value: 'def876' },
        ],
      };

      // @ts-ignore
      const { xhrSetup, licenseXhrSetup } = applyRequestInterceptors(
        source,
        options,
        additionalRequestData
        // @ts-ignore
      ).videoStreamer.hlsjs.customConfiguration;
      const xhr = {
        setRequestHeader: jest.fn(),
        withCredentials: undefined,
      };

      xhrSetup(xhr);
      expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer Xyz');
      expect(xhr.setRequestHeader).toHaveBeenCalledWith('X-Custom-Data', 'def876');
      expect(xhr.withCredentials).toBeUndefined();
      expect(licenseXhrSetup).toBeUndefined();
    });
    test('Applied through request filter in Shaka Player', () => {
      const additionalRequestData: AdditionalRequestData = {
        headers: [
          { id: 123, name: 'Authorization', value: 'Bearer Xyz' },
          { id: 456, name: 'X-Custom-Data', value: 'def876' },
        ],
      };

      // @ts-ignore
      const { shakaRequestFilter } = applyRequestInterceptors(
        source,
        options,
        additionalRequestData
        // @ts-ignore
      ).videoStreamer.shakaPlayer;
      const shakaRequest = {
        allowCrossSiteCredentials: undefined,
        headers: {},
      };

      shakaRequestFilter(1, shakaRequest);
      expect(shakaRequest).toEqual({
        headers: {
          Authorization: 'Bearer Xyz',
          'X-Custom-Data': 'def876',
        },
        allowCrossSiteCredentials: undefined,
      });
    });
  });
  describe('withCredentials', () => {
    test('Applied through xhrSetup in HLS.js', () => {
      const additionalRequestData: AdditionalRequestData = {
        withCredentials: true,
        headers: [],
      };

      // @ts-ignore
      const { xhrSetup, licenseXhrSetup } = applyRequestInterceptors(
        source,
        options,
        additionalRequestData
        // @ts-ignore
      ).videoStreamer.hlsjs.customConfiguration;
      const xhr = {
        setRequestHeader: jest.fn(),
        withCredentials: undefined,
      };

      xhrSetup(xhr);
      expect(xhr.setRequestHeader).not.toHaveBeenCalled();
      expect(xhr.withCredentials).toBe(true);
      expect(licenseXhrSetup).toBeUndefined();
    });
    test('Applied through request filter in Shaka Player', () => {
      const additionalRequestData: AdditionalRequestData = {
        withCredentials: true,
        headers: [],
      };

      // @ts-ignore
      const { shakaRequestFilter } = applyRequestInterceptors(
        source,
        options,
        additionalRequestData
        // @ts-ignore
      ).videoStreamer.shakaPlayer;
      const shakaRequest = {
        allowCrossSiteCredentials: undefined,
        headers: {},
      };

      shakaRequestFilter(1, shakaRequest);
      expect(shakaRequest).toEqual({
        headers: {},
        allowCrossSiteCredentials: true,
      });
    });
  });
  describe('License request headers', () => {
    test('Applied through licenseXhrSetup in HLS.js', () => {
      const drmSource = {
        streamUrl: 'https://example.com/stream',
        licenseUrl: 'https://example.com/license',
        licenseAcquisitionDetails: {
          licenseRequestHeaders: {
            Authorization: 'Bearer Xyz',
            'X-Custom-Data': 'def876',
          },
        },
      };

      // @ts-ignore
      const videoStreamerOptions = applyRequestInterceptors(drmSource, options, undefined).videoStreamer;
      // @ts-ignore
      const { xhrSetup, licenseXhrSetup } = videoStreamerOptions.hlsjs.customConfiguration;
      // @ts-ignore
      const { shakaPlayer } = videoStreamerOptions;

      const xhr = {
        setRequestHeader: jest.fn(),
        withCredentials: undefined,
      };

      licenseXhrSetup(xhr);
      expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer Xyz');
      expect(xhr.setRequestHeader).toHaveBeenCalledWith('X-Custom-Data', 'def876');
      expect(xhr.withCredentials).toBe(true); // This is set implicitly.

      expect(xhrSetup).toBeUndefined();
      expect(shakaPlayer).toBeUndefined();
    });
  });
  test('Everything.', () => {
    const additionalRequestData: AdditionalRequestData = {
      withCredentials: true,
      headers: [
        { id: 123, name: 'Authorization', value: 'Bearer Xyz' },
        { id: 456, name: 'X-Custom-Data', value: 'def876' },
      ],
    };

    const drmSource = {
      streamUrl: 'https://example.com/stream',
      licenseUrl: 'https://example.com/license',
      licenseAcquisitionDetails: {
        licenseRequestHeaders: {
          Authorization: 'Bearer Xyz',
          'X-Custom-Data': 'def876',
        },
      },
    };

    // @ts-ignore
    const videoStreamerOptions = applyRequestInterceptors(drmSource, options, additionalRequestData).videoStreamer;
    // @ts-ignore
    const { xhrSetup, licenseXhrSetup } = videoStreamerOptions.hlsjs.customConfiguration;
    // @ts-ignore
    const { shakaRequestFilter } = videoStreamerOptions.shakaPlayer;

    const licenseXhr = {
      setRequestHeader: jest.fn(),
      withCredentials: undefined,
    };
    const xhr = {
      setRequestHeader: jest.fn(),
      withCredentials: undefined,
    };
    const shakaRequest = {
      allowCrossSiteCredentials: undefined,
      headers: {},
    };

    xhrSetup(xhr);
    licenseXhrSetup(licenseXhr);

    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer Xyz');
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('X-Custom-Data', 'def876');
    expect(xhr.withCredentials).toBe(true);
    expect(licenseXhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer Xyz');
    expect(licenseXhr.setRequestHeader).toHaveBeenCalledWith('X-Custom-Data', 'def876');
    expect(licenseXhr.withCredentials).toBe(true); // This is set implicitly.

    shakaRequestFilter(2, shakaRequest);
    shakaRequestFilter(3, shakaRequest);
    shakaRequestFilter(4, shakaRequest);

    expect(shakaRequest).toEqual({
      allowCrossSiteCredentials: undefined,
      headers: {},
    });

    shakaRequestFilter(0, shakaRequest);
    expect(shakaRequest).toEqual({
      headers: {
        Authorization: 'Bearer Xyz',
        'X-Custom-Data': 'def876',
      },
      allowCrossSiteCredentials: true,
    });
  });
  test('Nothing to add.', () => {
    const videoStreamerOptions: any = applyRequestInterceptors(source, { videoStreamer: {} }).videoStreamer;
    expect(videoStreamerOptions.hlsjs).toBeUndefined();
    expect(videoStreamerOptions.shakaPlayer).toBeUndefined();
  });
});
