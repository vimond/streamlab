import { PlayerLibrary, PlayerLogLevel } from '../model/streamDetails';

export const SET_LOG_LEVEL = 'SET_LOG_LEVEL';
export const TOGGLE_PLAYBACK_MONITOR = 'TOGGLE_PLAYBACK_MONITOR';
export const SET_PLAYER_CONFIGURATION = 'SET_PLAYER_CONFIGURATION';
export const SET_PLAYER_LIBRARY = 'SET_PLAYER_LIBRARY';

export type SetLogLevelAction = {
  type: typeof SET_LOG_LEVEL;
  value: PlayerLogLevel;
};

export type TogglePlaybackMonitorAction = {
  type: typeof TOGGLE_PLAYBACK_MONITOR;
  value: boolean;
};

export type SetPlayerConfigurationAction = {
  type: typeof SET_PLAYER_CONFIGURATION;
  value: string;
};

export type SetPlayerLibraryAction = {
  type: typeof SET_PLAYER_LIBRARY;
  value: PlayerLibrary;
};

export type PlayerOptionsAction =
  | SetLogLevelAction
  | TogglePlaybackMonitorAction
  | SetPlayerConfigurationAction
  | SetPlayerLibraryAction;

export const setLogLevel = (value: PlayerLogLevel): SetLogLevelAction => ({
  type: SET_LOG_LEVEL,
  value,
});

export const togglePlaybackMonitor = (value: boolean): TogglePlaybackMonitorAction => ({
  type: TOGGLE_PLAYBACK_MONITOR,
  value,
});

export const setPlayerConfiguration = (value: string): SetPlayerConfigurationAction => ({
  type: SET_PLAYER_CONFIGURATION,
  value,
});

export const setPlayerLibrary = (value: PlayerLibrary): SetPlayerLibraryAction => ({
  type: SET_PLAYER_LIBRARY,
  value,
});
