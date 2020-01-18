import { PlayerOptionsAction, SET_LOG_LEVEL, SET_PLAYER_CONFIGURATION, TOGGLE_PLAYBACK_MONITOR } from '../actions/playerOptions';
import { PlayerLogLevel } from '../model/streamDetails';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../actions/history';
import { CLEAR_FORMS, ClearFormsAction } from "../actions/ui";

export interface PlayerOptionsState {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
}

const initialState = { logLevel: PlayerLogLevel.ERROR, showPlaybackMonitor: false, customConfiguration: '' };

const playerOptions = (
  state: PlayerOptionsState = initialState,
  action: PlayerOptionsAction | HistoryEntryAction | ClearFormsAction
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
    case CLEAR_FORMS:
      return initialState;
    case RESTORE_HISTORY_ENTRY:
      if ('playerOptions' in action.value.formData) {
        const { playerOptions } = action.value.formData;
        if (playerOptions) {
          return playerOptions;
        }
      }
    // eslint-disable no-fallthrough
    default:
      return state;
  }
};

export default playerOptions;
