import playerOptionsReducer from '../../../store/reducers/playerOptions';
import { SET_LOG_LEVEL, SET_PLAYER_CONFIGURATION, TOGGLE_PLAYBACK_MONITOR } from '../../../store/actions/playerOptions';
import { BaseTech, PlayerLogLevel, StreamTechnology } from '../../../store/model/streamDetails';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../../../store/actions/history';
import { AdvancedHistoryEntry } from '../../../store/model/history';
import { CLEAR_FORMS } from '../../../store/actions/ui';

const initialState = {
  customConfiguration: '',
  showPlaybackMonitor: false,
  logLevel: PlayerLogLevel.ERROR,
  isModified: false
};

describe('Player options reducer', () => {
  test('Updating the log level state when set', () => {
    const newState = playerOptionsReducer(initialState, { type: SET_LOG_LEVEL, value: PlayerLogLevel.INFO });
    expect(newState).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.INFO,
      isModified: true
    });
  });
  test('Toggling the playback monitor state', () => {
    const newState1 = playerOptionsReducer(initialState, { type: TOGGLE_PLAYBACK_MONITOR, value: true });
    expect(newState1).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: true,
      logLevel: PlayerLogLevel.ERROR,
      isModified: true
    });
    const newState2 = playerOptionsReducer(newState1, { type: TOGGLE_PLAYBACK_MONITOR, value: false });
    expect(newState2).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.ERROR,
      isModified: false
    });
  });
  test('Updating the JSON string representation state', () => {
    const newState1 = playerOptionsReducer(initialState, { type: SET_PLAYER_CONFIGURATION, value: '{"key":"value"}' });
    expect(newState1).toEqual({
      customConfiguration: '{"key":"value"}',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.ERROR,
      isModified: true
    });
    const newState2 = playerOptionsReducer(newState1, { type: SET_PLAYER_CONFIGURATION, value: '' });
    expect(newState2).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.ERROR,
      isModified: false
    });
  });
  test('Restoring a history entry should overwrite all player options.', () => {
    const emptyResource = {
      url: '',
      technology: BaseTech.AUTO,
      headers: [],
      useProxy: false
    };
    const historyEntry: AdvancedHistoryEntry = {
      timestamp: '2020-01-12T19:11:02.837Z',
      name: 'My good old stream',
      formData: {
        streamDetails: {
          streamResource: {
            url: 'http://example.com/my-good-old-stream.mpd',
            technology: StreamTechnology.MSS,
            headers: [],
            useProxy: true
          },
          drmLicenseResource: emptyResource,
          drmCertificateResource: emptyResource,
          subtitlesResource: emptyResource,
          startOffset: ''
        },
        playerOptions: {
          customConfiguration: '{"key":"value"}',
          logLevel: PlayerLogLevel.WARNING,
          showPlaybackMonitor: false
        }
      }
    };
    const action: HistoryEntryAction = {
      type: RESTORE_HISTORY_ENTRY,
      value: historyEntry
    };
    const oldState = {
      customConfiguration: '',
      showPlaybackMonitor: true,
      logLevel: PlayerLogLevel.ERROR,
      isModified: true
    };
    const newState = playerOptionsReducer(oldState, action);
    expect(newState).toEqual({ ...historyEntry.formData.playerOptions, isModified: true });
  });
  test('Clearing forms reverts player options to the initial state', () => {
    const oldState = {
      customConfiguration: '{"key":"value"}',
      showPlaybackMonitor: true,
      logLevel: PlayerLogLevel.INFO,
      isModified: true
    };
    const newState = playerOptionsReducer(oldState, { type: CLEAR_FORMS });
    expect(newState).toEqual({
      logLevel: PlayerLogLevel.ERROR,
      showPlaybackMonitor: false,
      customConfiguration: '',
      isModified: false
    });
  });
});
