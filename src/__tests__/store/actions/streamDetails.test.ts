import {
  DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
  DRM_LICENSE_RESOURCE_FIELD_CHANGE,
  SET_BROWSER_FEATURES,
  setBrowserFeatures,
  START_OFFSET_FIELD_CHANGE,
  STREAM_RESOURCE_FIELD_CHANGE,
  SUBTITLES_RESOURCE_FIELD_CHANGE,
  updateStreamDetailsField,
} from '../../../store/actions/streamDetails';
import { DrmTechnology } from '../../../store/model/streamDetails';

describe('Stream details Redux actions', () => {
  test('Stream field updates', () => {
    expect(
      updateStreamDetailsField({
        streamResource: {
          url: 'https://example.com/stream.m3u8',
        },
      })
    ).toEqual({
      type: STREAM_RESOURCE_FIELD_CHANGE,
      value: {
        url: 'https://example.com/stream.m3u8',
      },
    });
    expect(
      updateStreamDetailsField({
        drmLicenseResource: {
          useProxy: true,
          technology: DrmTechnology.PLAYREADY,
        },
      })
    ).toEqual({
      type: DRM_LICENSE_RESOURCE_FIELD_CHANGE,
      value: {
        useProxy: true,
        technology: DrmTechnology.PLAYREADY,
      },
    });
    expect(
      updateStreamDetailsField({
        drmCertificateResource: {
          url: 'https://example.com/certificate',
          technology: DrmTechnology.FAIRPLAY,
        },
      })
    ).toEqual({
      type: DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
      value: {
        url: 'https://example.com/certificate',
        technology: DrmTechnology.FAIRPLAY,
      },
    });
    expect(
      updateStreamDetailsField({
        subtitlesResource: {
          url: 'https://example.com/subs.ttml',
          useProxy: false,
        },
      })
    ).toEqual({
      type: SUBTITLES_RESOURCE_FIELD_CHANGE,
      value: {
        url: 'https://example.com/subs.ttml',
        useProxy: false,
      },
    });
    expect(
      updateStreamDetailsField({
        startOffset: 123.456,
      })
    ).toEqual({
      type: START_OFFSET_FIELD_CHANGE,
      value: 123.456,
    });
    expect(
      updateStreamDetailsField({
        startOffset: '',
      })
    ).toEqual({
      type: START_OFFSET_FIELD_CHANGE,
      value: '',
    });
  });
  test('Setting browser specific stream details', () => {
    expect(
      setBrowserFeatures(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X ' +
          '10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15'
      )
    ).toEqual({
      type: SET_BROWSER_FEATURES,
      value: {
        supportedDrmTypes: [DrmTechnology.FAIRPLAY],
      },
    });
    expect(
      setBrowserFeatures(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36 Edg/84.0.522.44'
      )
    ).toEqual({
      type: SET_BROWSER_FEATURES,
      value: {
        supportedDrmTypes: [DrmTechnology.PLAYREADY, DrmTechnology.WIDEVINE],
      },
    });
  });
});
