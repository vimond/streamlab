import playerOptionsReducer from '../../../store/reducers/playerOptions';
import { SET_LOG_LEVEL, SET_PLAYER_CONFIGURATION, TOGGLE_PLAYBACK_MONITOR } from '../../../store/actions/playerOptions';
import { PlayerLogLevel } from '../../../store/model/streamDetails';

const initialState = { customConfiguration: '', showPlaybackMonitor: false, logLevel: PlayerLogLevel.ERROR };

describe('Player options reducer', () => {
  test('Updating the log level state when set', () => {
    const newState = playerOptionsReducer(initialState, { type: SET_LOG_LEVEL, value: PlayerLogLevel.INFO });
    expect(newState).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.INFO
    });
  });
  test('Toggling the playback monitor state', () => {
    const newState1 = playerOptionsReducer(initialState, { type: TOGGLE_PLAYBACK_MONITOR, value: true });
    expect(newState1).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: true,
      logLevel: PlayerLogLevel.ERROR
    });
    const newState2 = playerOptionsReducer(newState1, { type: TOGGLE_PLAYBACK_MONITOR, value: false });
    expect(newState2).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.ERROR
    });
  });
  test('Updating the JSON string representation state', () => {
    const newState1 = playerOptionsReducer(initialState, { type: SET_PLAYER_CONFIGURATION, value: '{"key":"value"}' });
    expect(newState1).toEqual({
      customConfiguration: '{"key":"value"}',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.ERROR
    });
    const newState2 = playerOptionsReducer(newState1, { type: SET_PLAYER_CONFIGURATION, value: '' });
    expect(newState2).toEqual({
      customConfiguration: '',
      showPlaybackMonitor: false,
      logLevel: PlayerLogLevel.ERROR
    });
  });
});
