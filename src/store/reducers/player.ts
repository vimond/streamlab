import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';
import { PLAY, PLAYER_ERROR, PlayerAction, PlayerErrorAction, STOP } from '../actions/player';
import { CLEAR_FORMS, ClearFormsAction } from '../actions/ui';

// TODO: It seems wrong that the reducer is dependent on player (i.e. UI component) types.
// Consider having an intermediate type, even if that seems redundant.

export interface PlayerState {
  source?: PlaybackSource;
  options?: PlayerConfiguration;
  error?: Error;
}

const initialState = {
  source: undefined,
  options: {
    interactionDetector: {
      inactivityDelay: -1,
    },
  },
};

const player = (state: PlayerState = initialState, action: PlayerAction | PlayerErrorAction | ClearFormsAction) => {
  switch (action.type) {
    case PLAY:
      const { source, options } = action.value;
      return {
        source,
        options,
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
