import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';
import { PLAY, PLAYER_ERROR, PlayerAction, PlayerErrorAction, STOP } from '../actions/player';
import { CLEAR_FORMS, ClearFormsAction } from '../actions/ui';
import { AdditionalRequestData, PlayerLibrary } from '../model/streamDetails';

// TODO: It seems wrong that the reducer is dependent on player (i.e. UI component) types.
// Consider having an intermediate type, even if that seems redundant.

export interface PlayerState {
  source?: PlaybackSource;
  options?: PlayerConfiguration;
  playerLibraryOverride?: PlayerLibrary;
  additionalRequestData?: AdditionalRequestData;
  error?: Error;
}

const initialState = {
  source: undefined,
  options: {
    interactionDetector: {
      inactivityDelay: -1,
    },
  },
  additionalRequestData: undefined,
  playerLibraryOverride: undefined,
};

const player = (state: PlayerState = initialState, action: PlayerAction | PlayerErrorAction | ClearFormsAction) => {
  switch (action.type) {
    case PLAY:
      const { source, options, playerLibraryOverride, additionalRequestData } = action.value;
      return {
        source,
        options,
        playerLibraryOverride,
        additionalRequestData,
      };
    case STOP:
    case CLEAR_FORMS:
      return initialState;
    case PLAYER_ERROR:
      return {
        ...initialState,
        error: action.error,
      };
  }
  return state;
};

export default player;
