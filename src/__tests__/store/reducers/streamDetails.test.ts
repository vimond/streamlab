import streamDetailsReducer from '../../../store/reducers/streamDetails';
import { BaseTech, DrmTechnology, StreamTechnology, SubtitlesFormat } from '../../../store/model/streamDetails';
import {
  DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
  DRM_LICENSE_RESOURCE_FIELD_CHANGE,
  SET_BROWSER_FEATURES,
  STREAM_RESOURCE_FIELD_CHANGE,
  SUBTITLES_RESOURCE_FIELD_CHANGE
} from '../../../store/actions/streamDetails';

const streamResource = {
  url: 'https://example.com/stream.mpd',
  technology: StreamTechnology.PROGRESSIVE,
  headers: [],
  useProxy: false
};

const drmLicenseResource = {
  url: 'https://example.com/license',
  technology: DrmTechnology.PLAYREADY,
  headers: [{ id: 2, name: 'Authorization', value: 'Bearer token' }],
  useProxy: false
};

const drmCertificateResource = {
  url: 'https://example.com/certificate',
  technology: DrmTechnology.FAIRPLAY,
  headers: [],
  useProxy: false
};

const subtitlesResource = {
  url: 'https://example.com/subs.vtt',
  technology: SubtitlesFormat.WEBVTT,
  headers: [],
  useProxy: false
};

const resourcesAndActions = [
  {
    type: STREAM_RESOURCE_FIELD_CHANGE,
    resource: 'streamResource'
  },
  {
    type: DRM_LICENSE_RESOURCE_FIELD_CHANGE,
    resource: 'drmLicenseResource'
  },
  {
    type: DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
    resource: 'drmCertificateResource'
  },
  {
    type: SUBTITLES_RESOURCE_FIELD_CHANGE,
    resource: 'subtitlesResource'
  }
];

const oldState = { streamResource, drmLicenseResource, drmCertificateResource, subtitlesResource };

describe('Stream details reducer', () => {
  test('Changes to form fields should be applied to the state for every type of playback resource.', () => {
    const value = {
      url: 'https://example.com/changed',
      technology: BaseTech.AUTO,
      useProxy: true,
      headers: [{ id: 1, name: 'X-Token', value: 'TOKEN' }]
    };
    resourcesAndActions.forEach(({ type, resource }) => {
      // @ts-ignore
      const newState = streamDetailsReducer(oldState, { type, value });
      // @ts-ignore
      expect(newState[resource]).toEqual(value);
    });

    {
      const newState = streamDetailsReducer(oldState, { type: STREAM_RESOURCE_FIELD_CHANGE, value: { url: '' } });
      const { url, ...rest } = streamResource;
      expect(newState.streamResource.url).toBe('');
      expect(newState.streamResource).toMatchObject(rest);
    }
    {
      const newState = streamDetailsReducer(oldState, {
        type: DRM_LICENSE_RESOURCE_FIELD_CHANGE,
        value: { technology: DrmTechnology.WIDEVINE }
      });
      const { technology, ...rest } = drmLicenseResource;
      expect(newState.drmLicenseResource.technology).toBe(DrmTechnology.WIDEVINE);
      expect(newState.drmLicenseResource).toMatchObject(rest);
    }
    {
      const newState = streamDetailsReducer(oldState, {
        type: DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
        value: { technology: BaseTech.AUTO }
      });
      const { technology, ...rest } = drmCertificateResource;
      expect(newState.drmCertificateResource.technology).toBe(BaseTech.AUTO);
      expect(newState.drmCertificateResource).toMatchObject(rest);
    }
    {
      const newState = streamDetailsReducer(oldState, {
        type: SUBTITLES_RESOURCE_FIELD_CHANGE,
        value: { useProxy: true, headers: [{ id: 3, name: 'X', value: 'Y' }] }
      });
      const { useProxy, headers, ...rest } = subtitlesResource;
      expect(newState.subtitlesResource.useProxy).toBe(true);
      expect(newState.subtitlesResource.headers[0]).toEqual({ id: 3, name: 'X', value: 'Y' });
      expect(newState.subtitlesResource).toMatchObject(rest);
    }
  });
  test('DRM technology should be applied to the DRM related resources when browser features are detected.', () => {
    const action = {
      type: SET_BROWSER_FEATURES,
      value: {
        drmTechnology: DrmTechnology.WIDEVINE
      }
    };
    // @ts-ignore
    const newState = streamDetailsReducer(oldState, action);
    const { drmLicenseResource, drmCertificateResource, ...rest } = newState;
    expect(drmLicenseResource.technology).toBe(DrmTechnology.WIDEVINE);
    expect(drmCertificateResource.technology).toBe(DrmTechnology.WIDEVINE);
    expect(oldState).toMatchObject(rest);
  });
});
