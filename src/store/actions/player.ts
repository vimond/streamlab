import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';
import { AppState } from '../reducers';
import { Dispatch } from 'redux';
import { createPlayerOptions, createPlayerSource } from '../model/streamDetails';
import { Action } from './index';
import { AdvancedHistoryEntry, BasicHistoryEntry, HistoryEntry } from '../model/history';
import { StreamDetailsState } from '../reducers/streamDetails';
import { PlayerOptionsState } from '../reducers/playerOptions';

export const PLAY = 'PLAY';
export const STOP = 'STOP';
export const PLAYER_ERROR = 'PLAYER_ERROR';

export type PlayerAction =
  | {
      type: typeof PLAY;
      value: {
        source: PlaybackSource;
        options?: PlayerConfiguration;
        historyEntry: HistoryEntry;
      };
    }
  | {
      type: typeof STOP;
    };

export type PlayerErrorAction = {
  type: typeof PLAYER_ERROR;
  error: Error;
};

const createBasicHistoryEntry = (streamDetails: StreamDetailsState): BasicHistoryEntry => ({
  timestamp: new Date().toISOString(),
  name: '',
  formData: {
    streamDetails: {
      streamResource: {
        url: streamDetails.streamResource.url,
        technology: streamDetails.streamResource.technology,
      },
    },
  },
});

const createAdvancedHistoryEntry = (
  streamDetails: StreamDetailsState,
  playerOptions: PlayerOptionsState
): AdvancedHistoryEntry => ({
  timestamp: new Date().toISOString(),
  name: '',
  formData: {
    streamDetails,
    playerOptions,
  },
});

export const playBasic = (dispatch: Dispatch<Action>, getState: () => AppState) => {
  const { streamDetails } = getState();
  const { streamResource } = streamDetails; // Only including what's visible in the form.
  const source = createPlayerSource({ streamResource });
  if (source) {
    dispatch({
      type: PLAY,
      value: {
        source,
        historyEntry: createBasicHistoryEntry(streamDetails),
      },
    });
  }
};

export const playAdvanced = (dispatch: Dispatch<Action>, getState: () => AppState) => {
  const { streamDetails, playerOptions } = getState();
  const source = createPlayerSource(streamDetails);
  const options = createPlayerOptions(playerOptions);
  if (source) {
    dispatch({
      type: PLAY,
      value: {
        source,
        options,
        historyEntry: createAdvancedHistoryEntry({ ...streamDetails, startOffset: '' }, playerOptions),
      },
    });
  }
};

export const stop = (dispatch: Dispatch<Action>): PlayerAction => dispatch({ type: STOP });

export const handlePlayerError = (error: any) => (dispatch: Dispatch<Action>) => {
  // TODO: Improve typing for Replay errors.
  if (error instanceof Error) {
    // Redux dev tools has issues with JSON.stringify and HLS.js source errors.
    // @ts-ignore
    if (error.sourceError && (error.sourceError.loader || (error.sourceError.frag && error.sourceError.frag.loader))) {
      // @ts-ignore
      const { loader, context, frag, ...rest } = error.sourceError;
      // @ts-ignore
      error.sourceError = rest;
      dispatch({
        type: PLAYER_ERROR,
        error,
      });
    } else {
      dispatch({
        type: PLAYER_ERROR,
        error,
      });
    }
    console.error('Playback error: %s', error.message);
  } else {
    dispatch({
      type: PLAYER_ERROR,
      error: new Error(error),
    });
    console.error('Playback error:', error);
  }
  console.dir(error);
};
