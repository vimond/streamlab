import {
  playBasic,
  playAdvanced,
  stop,
  PLAY,
  STOP,
  handlePlayerError,
  PLAYER_ERROR
} from '../../../store/actions/player';
import { BaseTech, DrmTechnology, PlayerLogLevel } from '../../../store/model/streamDetails';

const basicFormState = {
  streamDetails: {
    streamResource: {
      url: 'https://example.com/stream.mpd',
      technology: BaseTech.AUTO
    }
  }
};

const advancedFormState = {
  streamDetails: {
    streamResource: {
      url: 'https://example.com/stream.m3u8',
      technology: BaseTech.AUTO
    },
    drmLicenseResource: {
      url: 'https://example.com/license',
      technology: DrmTechnology.WIDEVINE,
      headers: [
        {
          name: 'Authorization',
          value: 'Token'
        },
        {
          name: 'Something',
          value: 'Somewhat'
        }
      ]
    },
    drmCertificateResource: {
      url: 'https://example.com/certificate',
      technology: DrmTechnology.WIDEVINE
    },
    subtitlesResource: {
      url: 'https://example.com/subs.vtt',
      technology: BaseTech.AUTO
    }
  },
  playerOptions: {
    logLevel: PlayerLogLevel.WARNING,
    showPlaybackMonitor: true,
    customConfiguration: '{"some":"value"}'
  }
};

describe('Player Redux actions', () => {
  describe('Playback start mapping form details to Replay source', function() {
    test('Basic playback start only applying visible stream details', () => {
      const getState = jest
        .fn()
        .mockReturnValueOnce(basicFormState)
        .mockReturnValue(advancedFormState);
      const dispatch = jest.fn();

      playBasic(dispatch, getState);
      playBasic(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: PLAY,
        value: {
          source: {
            streamUrl: 'https://example.com/stream.m3u8',
            contentType: 'application/x-mpegurl'
          }
        }
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: PLAY,
        value: {
          source: {
            streamUrl: 'https://example.com/stream.mpd',
            contentType: 'application/dash+xml'
          }
        }
      });
    });
    test('Advanced playback start applying all advanced form details', () => {
      const getState = jest.fn().mockReturnValue(advancedFormState);
      const dispatch = jest.fn();

      playAdvanced(dispatch, getState);

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
                Something: 'Somewhat'
              },
              widevineServiceCertificateUrl: 'https://example.com/certificate'
            },
            textTracks: [
              {
                src: 'https://example.com/subs.vtt',
                contentType: 'text/vtt'
              }
            ]
          },
          options: {
            some: 'value',
            videoStreamer: {
              logLevel: 'WARNING'
            },
            playbackMonitor: {
              visibleAtStart: true
            }
          }
        }
      });
    });
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
            url: 'https://example.com'
          }
        ],
        context: {}
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
            url: 'https://example.com'
          }
        ]
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
