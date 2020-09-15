import {
  handlePlayerError,
  PLAY,
  playAdvanced,
  playBasic,
  PLAYER_ERROR,
  stop,
  STOP,
} from '../../../store/actions/player';
import { BaseTech, DrmTechnology, PlayerLogLevel } from '../../../store/model/streamDetails';

const basicFormState = {
  streamDetails: {
    streamResource: {
      url: 'https://example.com/stream.mpd',
      technology: BaseTech.AUTO,
    },
  },
  ui: {
    advancedMode: false,
    expandedAdvancedAccordionIndices: [],
  },
  playerOptions: {
    logLevel: PlayerLogLevel.DEBUG,
    showPlaybackMonitor: false,
    customConfiguration: '',
  },
};

const basicFormStateWithoutStreamUrl = {
  streamDetails: {
    streamResource: {
      url: '',
      technology: BaseTech.AUTO,
    },
  },
  ui: {
    advancedMode: false,
    expandedAdvancedAccordionIndices: [],
  },
  playerOptions: {
    logLevel: PlayerLogLevel.DEBUG,
    showPlaybackMonitor: false,
    customConfiguration: '',
  },
};

const advancedFormState = {
  streamDetails: {
    streamResource: {
      url: 'https://example.com/stream.m3u8',
      technology: BaseTech.AUTO,
      headers: [{ name: 'X-Header', value: '123' }],
      useProxy: true,
    },
    drmLicenseResource: {
      url: 'https://example.com/license',
      technology: DrmTechnology.WIDEVINE,
      headers: [
        {
          name: 'Authorization',
          value: 'Token',
        },
        {
          name: 'Something',
          value: 'Somewhat',
        },
      ],
    },
    drmCertificateResource: {
      url: 'https://example.com/certificate',
      technology: DrmTechnology.WIDEVINE,
    },
    subtitlesResource: {
      url: 'https://example.com/subs.vtt',
      technology: BaseTech.AUTO,
    },
    startOffset: 123.456,
    supportedDrmTechnologies: [DrmTechnology.PLAYREADY, DrmTechnology.WIDEVINE],
    isDrmCertificateApplicable: true,
  },
  playerOptions: {
    logLevel: PlayerLogLevel.WARNING,
    showPlaybackMonitor: true,
    customConfiguration: '{"some":"value"}',
  },
};

const isoTimestamp = '2020-01-12T16:46:58.596Z';

describe('Player Redux actions', () => {
  let originalDate: DateConstructor;
  beforeAll(() => {
    originalDate = global.Date;
    const MockDate = jest.fn(() => ({ toISOString: () => isoTimestamp }));
    // @ts-ignore
    global.Date = MockDate;
  });
  afterAll(() => {
    global.Date = originalDate;
  });
  describe('Playback start mapping form details to Replay source', function () {
    test('Basic playback start only applying visible stream details', () => {
      const getState = jest.fn().mockReturnValueOnce(basicFormState).mockReturnValue(advancedFormState);
      const dispatch = jest.fn();

      playBasic(dispatch, getState);
      playBasic(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: PLAY,
        value: {
          source: {
            streamUrl: 'https://example.com/stream.m3u8',
            contentType: 'application/x-mpegurl',
          },
          historyEntry: {
            timestamp: isoTimestamp,
            name: '',
            formData: {
              streamDetails: {
                streamResource: {
                  url: 'https://example.com/stream.m3u8',
                  technology: BaseTech.AUTO,
                },
              },
            },
          },
        },
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: PLAY,
        value: {
          source: {
            streamUrl: 'https://example.com/stream.mpd',
            contentType: 'application/dash+xml',
          },
          historyEntry: {
            timestamp: isoTimestamp,
            name: '',
            formData: {
              streamDetails: basicFormState.streamDetails,
            },
          },
        },
      });
    });
    test('Advanced playback start applying all advanced form details', () => {
      const getState = jest.fn().mockReturnValue(advancedFormState);
      const dispatch = jest.fn();

      playAdvanced(dispatch, getState);

      const { supportedDrmTechnologies, ...streamDetails } = advancedFormState.streamDetails;

      const historyStreamDetails = {
        ...streamDetails,
        startOffset: '',
      };

      expect(dispatch).toHaveBeenCalledWith({
        type: PLAY,
        value: {
          source: {
            streamUrl: 'https://example.com/stream.m3u8',
            contentType: 'application/x-mpegurl',
            licenseUrl: 'https://example.com/license',
            drmType: 'com.widevine.alpha',
            licenseAcquisitionDetails: {
              licenseRequestHeaders: {
                Authorization: 'Token',
                Something: 'Somewhat',
              },
              widevineServiceCertificateUrl: 'https://example.com/certificate',
            },
            textTracks: [
              {
                src: 'https://example.com/subs.vtt',
                contentType: 'text/vtt',
                label: 'Subtitles file from example.com',
              },
            ],
            startPosition: 123.456,
          },
          options: {
            some: 'value',
            videoStreamer: {
              logLevel: 'WARNING',
            },
            playbackMonitor: {
              visibleAtStart: true,
            },
          },
          historyEntry: {
            timestamp: isoTimestamp,
            name: '',
            formData: {
              streamDetails: historyStreamDetails,
              playerOptions: advancedFormState.playerOptions,
            },
          },
        },
      });
    });
  });
  test('Advanced playback start without start offset', () => {
    const s = {
      ...advancedFormState,
      streamDetails: {
        ...advancedFormState.streamDetails,
        startOffset: '',
      },
    };
    const getState = jest.fn().mockReturnValue(s);
    const dispatch = jest.fn();

    playAdvanced(dispatch, getState);

    const result = dispatch.mock.calls[0][0];
    expect(result.value.source).toMatchObject({
      streamUrl: 'https://example.com/stream.m3u8',
      contentType: 'application/x-mpegurl',
      licenseUrl: 'https://example.com/license',
      drmType: 'com.widevine.alpha',
      licenseAcquisitionDetails: {
        licenseRequestHeaders: {
          Authorization: 'Token',
          Something: 'Somewhat',
        },
        widevineServiceCertificateUrl: 'https://example.com/certificate',
      },
      textTracks: [
        {
          src: 'https://example.com/subs.vtt',
          contentType: 'text/vtt',
        },
      ],
    });
    expect(result.value.source.startPosition).toBeUndefined();
  });
  test('Ignore playback start without a stream URL', () => {
    const getState = jest.fn().mockReturnValue(basicFormStateWithoutStreamUrl);
    const dispatch = jest.fn();

    playAdvanced(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalled();
  });
  test('Playback stop', () => {
    const dispatch = jest.fn();
    stop(dispatch);
    expect(dispatch).toHaveBeenCalledWith({ type: STOP });
  });
  describe('Playback error handling', () => {
    test('Passing on error objects', () => {
      const dispatch = jest.fn();
      const err = new Error('Playback error.');
      // @ts-ignore
      err.code = 'STREAM_ERROR_DOWNLOAD';

      handlePlayerError(err)(dispatch);
      const { type, error } = dispatch.mock.calls[0][0];

      expect(type).toBe(PLAYER_ERROR);
      expect(error.message).toBe('Playback error.');
      expect(error.code).toBe('STREAM_ERROR_DOWNLOAD');
      expect(error).toBeInstanceOf(Error);
    });
    test('Passing on HLS.js error objects without loader property otherwise failing in redux-persist', () => {
      const dispatch = jest.fn();
      const err = new Error('HLS.js error.');
      // @ts-ignore
      err.sourceError = {
        loader: {},
        data: [
          {
            url: 'https://example.com',
          },
        ],
        context: {},
      };
      // @ts-ignore
      err.severity = 'FATAL';

      handlePlayerError(err)(dispatch);
      const { type, error } = dispatch.mock.calls[0][0];

      expect(type).toBe(PLAYER_ERROR);
      expect(error.message).toBe('HLS.js error.');
      expect(error.severity).toBe('FATAL');
      expect(error.sourceError).toEqual({
        data: [
          {
            url: 'https://example.com',
          },
        ],
      });
    });
    test('Wrapping and passing on errors not being instances of Error', () => {
      const dispatch = jest.fn();
      const err = 'A playback error message.';

      handlePlayerError(err)(dispatch);
      const { type, error } = dispatch.mock.calls[0][0];

      expect(type).toBe(PLAYER_ERROR);
      expect(error.message).toBe('A playback error message.');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
