import streamDetailsReducer, { StreamDetailsState } from '../../../store/reducers/streamDetails';
import { BaseTech, DrmTechnology, StreamTechnology, SubtitlesFormat } from '../../../store/model/streamDetails';
import {
  DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
  DRM_LICENSE_RESOURCE_FIELD_CHANGE,
  SET_BROWSER_FEATURES,
  STREAM_RESOURCE_FIELD_CHANGE,
  SUBTITLES_RESOURCE_FIELD_CHANGE
} from '../../../store/actions/streamDetails';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../../../store/actions/history';
import { CLEAR_FORMS } from "../../../store/actions/ui";

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

const emptyResource = {
  url: '',
  technology: BaseTech.AUTO,
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
  test(
    'Restoring a history entry should overwrite all stream details with the history ' +
      'entry, and pad with the initial state for entries containing basic playback data only.',
    () => {
      const action1: HistoryEntryAction = {
        type: RESTORE_HISTORY_ENTRY,
        value: {
          timestamp: '2020-01-12T19:11:02.837Z',
          name: 'My good old stream',
          formData: {
            streamDetails: {
              streamResource: {
                url: 'http://example.com/my-good-old-stream.mpd',
                technology: StreamTechnology.MSS
              }
            }
          }
        }
      };
      const newState1 = streamDetailsReducer(oldState, action1);
      expect(newState1).toEqual({
        streamResource: {
          url: 'http://example.com/my-good-old-stream.mpd',
          technology: StreamTechnology.MSS,
          headers: [],
          useProxy: false
        },
        drmLicenseResource: emptyResource,
        drmCertificateResource: emptyResource,
        subtitlesResource: emptyResource
      });
      const action2: HistoryEntryAction = {
        type: RESTORE_HISTORY_ENTRY,
        value: {
          timestamp: '2020-01-12T19:11:02.837Z',
          name: 'My good old stream',
          formData: {
            streamDetails: {
              streamResource: {
                url: 'http://example.com/my-good-old-stream.mpd',
                technology: StreamTechnology.MSS,
                useProxy: true,
                headers: [{ id: 123, name: 'Max-Age', value: '300' }]
              },
              drmLicenseResource: {
                url: 'https://example.com/license',
                technology: DrmTechnology.WIDEVINE,
                headers: [
                  {
                    id: 123,
                    name: 'Authorization',
                    value: 'Token'
                  },
                  {
                    id: 456,
                    name: 'Something',
                    value: 'Somewhat'
                  }
                ],
                useProxy: true
              },
              drmCertificateResource: {
                url: 'https://example.com/certificate',
                technology: DrmTechnology.WIDEVINE,
                useProxy: true,
                headers: []
              },
              subtitlesResource: {
                url: 'https://example.com/subs.vtt',
                technology: BaseTech.AUTO,
                useProxy: false,
                headers: []
              }
            }
          }
        }
      };
      const newState2 = streamDetailsReducer(oldState, action2);
      expect(newState2).toEqual(action2.value.formData.streamDetails);
    }
  );
  test('Clearing forms reverts stream details to the initial state', () => {
    const oldState: StreamDetailsState = {
      streamResource,
      drmLicenseResource,
      drmCertificateResource,
      subtitlesResource
    };
    const blankResource = {
      url: '',
      technology: BaseTech.AUTO,
      useProxy: false,
      headers: []
    };


    const newState = streamDetailsReducer(oldState, { type: CLEAR_FORMS });
    expect(newState).toEqual({
      streamResource: blankResource,
      drmLicenseResource: {
        ...blankResource,
        technology: drmLicenseResource.technology,
      },
      drmCertificateResource: {
        ...blankResource,
        technology: drmCertificateResource.technology,
      },
      subtitlesResource: blankResource
    });
  });
});
