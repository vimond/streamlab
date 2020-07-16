import { Replay } from 'vimond-replay';
import React from 'react';
import { Box } from '@chakra-ui/core';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';

// @ts-ignore
import CompoundVideoStreamer from 'vimond-replay/video-streamer/compound';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { connect } from 'react-redux';
import { handlePlayerError, stop } from '../store/actions/player';

type Props = {
  source?: PlaybackSource;
  options?: PlayerConfiguration;
  onExit: () => void;
  onError: (err: any) => void;
};

const Player: React.FC<Props> = ({ source, options, onError, onExit }) => (
  <Box my={1} p={4}>
    <Replay source={source} options={options} onError={onError} onExit={source ? onExit : undefined}>
      <CompoundVideoStreamer />
    </Replay>
  </Box>
);

const mapStateToProps = (state: AppState) => ({
  ...state.player,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  // @ts-ignore No proper typing for thunks.
  onError: (err: any) => dispatch(handlePlayerError(err)),
  // @ts-ignore
  onExit: () => dispatch(stop),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
