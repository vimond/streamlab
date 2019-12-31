import {
  PlayerOptionsAction,
  SET_LOG_LEVEL,
  TOGGLE_PLAYBACK_MONITOR,
  SET_PLAYER_CONFIGURATION
} from '../actions/playerOptions';
import { PlayerLogLevel } from '../model/streamDetails';

export interface PlayerOptionsState {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
}

const playerOptions = (
  state: PlayerOptionsState = { logLevel: PlayerLogLevel.ERROR, showPlaybackMonitor: false, customConfiguration: '' },
  action: PlayerOptionsAction
): PlayerOptionsState => {
  switch (action.type) {
    case SET_LOG_LEVEL:
      return {
        ...state,
        logLevel: action.value
      };
    case TOGGLE_PLAYBACK_MONITOR:
      return {
        ...state,
        showPlaybackMonitor: action.value
      };
    case SET_PLAYER_CONFIGURATION:
      return {
        ...state,
        customConfiguration: action.value
      };
    default:
      return state;
  }
};

export default playerOptions;
