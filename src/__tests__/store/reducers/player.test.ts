import playerReducer from '../../../store/reducers/player';
import { PLAY, PLAYER_ERROR, STOP } from '../../../store/actions/player';
import { PANE_RESIZE } from '../../../store/actions/ui';
import { BaseTech } from '../../../store/model/streamDetails';

const source = {
  streamUrl: 'https://example.com/stream.mpd',
  contentType: 'application/dash+xml',
};

const options = {
  videoStreamer: {
    playsInline: true,
  },
};

const additionalRequestData = {
  headers: [{ id: 33, name: 'X-My-Header', value: 'My value' }],
};

describe('Player reducer', () => {
  test('The PLAY action applies the source and any player options to the state.', () => {
    const newState = playerReducer(
      { source: { streamUrl: 'something' }, additionalRequestData: { headers: [], withCredentials: true } },
      {
        type: PLAY,
        value: {
          source,
          options,
          additionalRequestData,
          playerLibraryOverride: 'RX_PLAYER',
          historyEntry: {
            timestamp: '2020-01-12T19:11:02.837Z',
            name: '',
            formData: {
              streamDetails: {
                streamResource: {
                  url: 'something',
                  technology: BaseTech.AUTO,
                },
              },
            },
          },
        },
      }
    );
    expect(newState).toEqual({
      source: {
        streamUrl: 'https://example.com/stream.mpd',
        contentType: 'application/dash+xml',
      },
      options: {
        videoStreamer: {
          playsInline: true,
        },
      },
      additionalRequestData,
      playerLibraryOverride: 'RX_PLAYER',
    });
  });
  test(
    'The STOP or PLAYER_ERROR action types removes any current player source, and also makes the player ' +
      'controls constantly visible.',
    () => {
      const newState1 = playerReducer({ source, options }, { type: STOP });
      expect(newState1).toEqual({
        source: undefined,
        options: {
          interactionDetector: {
            inactivityDelay: -1,
          },
        },
        additionalRequestData: undefined,
      });
      const veryVeryBadError = new Error('Playback very very bad.');
      const newState2 = playerReducer({ source, options }, { type: PLAYER_ERROR, error: veryVeryBadError });
      expect(newState2).toEqual({
        source: undefined,
        options: {
          interactionDetector: {
            inactivityDelay: -1,
          },
        },
        error: veryVeryBadError,
        additionalRequestData: undefined,
      });
    }
  );
  test('The player state is unaffected by other action types.', () => {
    // @ts-ignore Actually a specific reducer should accept any action.
    const result = playerReducer({ source, options }, { type: PANE_RESIZE, value: 313 });
    expect(result).toEqual({ source, options });
  });
});
