import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';
import { PLAY, PLAYER_ERROR, PlayerAction, PlayerErrorAction, STOP } from '../actions/player';

// TODO: It seems wrong that the reducer is dependent on player (i.e. UI component) types.
// Consider having an intermediate type, even if that seems redundant.

export interface PlayerState {
  source?: PlaybackSource;
  options?: PlayerConfiguration;
}

const player = (state: PlayerState = {}, action: PlayerAction | PlayerErrorAction) => {
  switch (action.type) {
    case PLAY:
      const { source, options } = action.value;
      return {
        source,
        options
      };
    case STOP:
    case PLAYER_ERROR:
      return {
        source: undefined,
        options: {
          interactionDetector: {
            inactivityDelay: -1
          }
        }
      };
  }
  return state;
};

export default player;
