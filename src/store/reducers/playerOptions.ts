import {
  PlayerOptionsAction,
  SET_LOG_LEVEL,
  SET_PLAYER_CONFIGURATION,
  TOGGLE_PLAYBACK_MONITOR,
} from '../actions/playerOptions';
import { PlayerLogLevel } from '../model/streamDetails';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../actions/history';
import { CLEAR_FORMS, ClearFormsAction } from '../actions/ui';
import { IsModifiedBaseState } from './index';
import { APPLY_BROWSER_ENVIRONMENT, ApplyBrowserEnvironmentAction } from '../actions/streamDetails';

export interface PlayerOptionsState extends IsModifiedBaseState {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
}

const initialState = {
  logLevel: PlayerLogLevel.WARNING,
  showPlaybackMonitor: false,
  customConfiguration: '',
  isModified: false,
};

const isInitialState = ({ logLevel, showPlaybackMonitor, customConfiguration }: PlayerOptionsState) =>
  logLevel === initialState.logLevel &&
  showPlaybackMonitor === initialState.showPlaybackMonitor &&
  customConfiguration === initialState.customConfiguration;

const playerOptions = (
  state: PlayerOptionsState = initialState,
  action: PlayerOptionsAction | HistoryEntryAction | ClearFormsAction | ApplyBrowserEnvironmentAction
): PlayerOptionsState => {
  switch (action.type) {
    case APPLY_BROWSER_ENVIRONMENT:
      if (
        action.value.urlSetup &&
        'playerOptions' in action.value.urlSetup &&
        action.value.urlSetup.playerOptions &&
        Object.keys(action.value.urlSetup.playerOptions).length >= 0
      ) {
        return {
          ...state,
          ...action.value.urlSetup.playerOptions,
          isModified: !isInitialState({
            ...state,
            ...action.value.urlSetup.playerOptions,
          }),
        };
      } else {
        return state;
      }
    case SET_LOG_LEVEL:
      return {
        ...state,
        logLevel: action.value,
        isModified: !isInitialState({ ...state, logLevel: action.value }),
      };
    case TOGGLE_PLAYBACK_MONITOR:
      return {
        ...state,
        showPlaybackMonitor: action.value,
        isModified: !isInitialState({ ...state, showPlaybackMonitor: action.value }),
      };
    case SET_PLAYER_CONFIGURATION:
      return {
        ...state,
        customConfiguration: action.value,
        isModified: !isInitialState({ ...state, customConfiguration: action.value }),
      };
    case CLEAR_FORMS:
      return initialState;
    case RESTORE_HISTORY_ENTRY:
      if ('playerOptions' in action.value.formData) {
        const { playerOptions } = action.value.formData;
        if (playerOptions) {
          return {
            ...playerOptions,
            isModified: !isInitialState({ ...playerOptions, isModified: false }),
          };
        }
      }
    // eslint-disable no-fallthrough
    default:
      return state;
  }
};

export default playerOptions;
