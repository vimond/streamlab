import { PlaybackSource, PlayerConfiguration } from 'vimond-replay/default-player/Replay';
import { AppState } from '../reducers';
import { Dispatch } from 'redux';
import { createPlayerSource } from '../model/streamDetails';
import { Action } from './index';

export const PLAY = 'PLAY';
export const STOP = 'STOP';
export const PLAYER_ERROR = 'PLAYER_ERROR';

export type PlayerAction =
  | {
      type: typeof PLAY;
      value: {
        source: PlaybackSource;
        options?: PlayerConfiguration;
      };
    }
  | {
      type: typeof STOP;
    };
export type PlayerErrorAction = {
  type: typeof PLAYER_ERROR;
  error: Error;
};

export const play = (dispatch: Dispatch<Action>, getState: () => AppState) => {
  const { streamDetails } = getState();
  const source = createPlayerSource(streamDetails.streamResource.url, streamDetails.streamResource.technology);
  if (source) {
    dispatch({ type: PLAY, value: { source } });
  }
};

export const stop = (dispatch: Dispatch<Action>): PlayerAction => dispatch({ type: STOP });

export const handlePlayerError = (error: any) => (dispatch: Dispatch<Action>) => {
  // TODO: Improve typing for Replay errors.
  if (error instanceof Error) {
    // @ts-ignore Redux dev tools has issues with JSON.stringify and HLS.js source errors.
    if (error.sourceError && error.sourceError.loader) {
      // @ts-ignore
      const { loader, context, ...rest } = error.sourceError;
      // @ts-ignore
      error.sourceError = rest;
      dispatch({
        type: PLAYER_ERROR,
        error
      });
    } else {
      dispatch({
        type: PLAYER_ERROR,
        error
      });
    }
    console.error('Playback error: %s', error.message);
  } else {
    dispatch({
      type: PLAYER_ERROR,
      error: new Error(error)
    });
    console.error('Playback error:', error);
  }
  console.dir(error);
};
