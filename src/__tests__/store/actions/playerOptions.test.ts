import {
  SET_LOG_LEVEL,
  SET_PLAYER_CONFIGURATION,
  SET_PLAYER_LIBRARY,
  setLogLevel,
  setPlayerConfiguration,
  setPlayerLibrary,
  TOGGLE_PLAYBACK_MONITOR,
  togglePlaybackMonitor,
} from '../../../store/actions/playerOptions';
import { PlayerLogLevel } from '../../../store/model/streamDetails';

describe('Player options Redux actions', () => {
  test('Setting player log level', () => {
    expect(setLogLevel(PlayerLogLevel.DEBUG)).toEqual({
      type: SET_LOG_LEVEL,
      value: PlayerLogLevel.DEBUG,
    });
    expect(setLogLevel(PlayerLogLevel.NONE)).toEqual({
      type: SET_LOG_LEVEL,
      value: PlayerLogLevel.NONE,
    });
  });
  test('Setting player library to use', () => {
    expect(setPlayerLibrary('RX_PLAYER')).toEqual({
      type: SET_PLAYER_LIBRARY,
      value: 'RX_PLAYER',
    });
    expect(setPlayerLibrary('AUTO')).toEqual({
      type: SET_PLAYER_LIBRARY,
      value: 'AUTO',
    });
  });
  test('Toggling playback monitor visibility', () => {
    expect(togglePlaybackMonitor(true)).toEqual({
      type: TOGGLE_PLAYBACK_MONITOR,
      value: true,
    });
    expect(togglePlaybackMonitor(false)).toEqual({
      type: TOGGLE_PLAYBACK_MONITOR,
      value: false,
    });
  });
  test('Setting a player configuration as a JSON string', () => {
    expect(setPlayerConfiguration('{"some":{"key":"value"}}')).toEqual({
      type: SET_PLAYER_CONFIGURATION,
      value: '{"some":{"key":"value"}}',
    });
  });
});
