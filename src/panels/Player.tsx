import { Replay } from 'vimond-replay';
import React from 'react';
import { Box, Text, Flex, Link, Image } from '@chakra-ui/core';
import { PlaybackActions, PlaybackSource, VideoStreamState } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';
import ReplayLogo from '../graphics/replay-logo.svg';

import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { connect } from 'react-redux';
import { handlePlayerError, stop } from '../store/actions/player';
import VideoStreamerResolver from './VideoStreamerResolver';

type Props = {
  source?: PlaybackSource;
  options?: PlayerConfiguration;
  onExit: () => void;
  onError: (err: any) => void;
};

const stickyPlayerControls = {
  interactionDetector: {
    inactivityDelay: -1,
  },
};

const onStreamStateChange = (streamState: VideoStreamState) => {
  // @ts-ignore
  if (!window.player) {
    // @ts-ignore
    window.player = {};
  }
  // @ts-ignore
  if (!window.player.state) {
    // @ts-ignore
    window.player.state = {};
  }
  for (const [key, value] of Object.entries(streamState)) {
    // @ts-ignore
    window.player.state[key] = value;
  }
};

const highlightConsoleStyle = 'font-weight: bold; color: orange;';
const normalConsoleStyle = 'font-weight: normal; color: inherit';

const onPlaybackActionsReady = (actions: PlaybackActions) => {
  // @ts-ignore
  window.player = actions;
  // @ts-ignore
  window.player.state = {};
  console.info(
    'Playback methods and playback state is exposed to a global %cplayer %cobject. Expand for details:',
    highlightConsoleStyle,
    normalConsoleStyle
  );
  // @ts-ignore
  console.dir(window.player);
  console.info(
    'Start playing a stream. then type e.g. %cplayer.setPosition(123), %cto seek to 1:03, or %cplayer.state.position %cto get the current playback position.',
    highlightConsoleStyle,
    normalConsoleStyle,
    highlightConsoleStyle,
    normalConsoleStyle
  );
};

const Player: React.FC<Props> = ({ source, options, onError, onExit }) => (
  <Box my={1} p={4} position="relative">
    <Replay
      source={source}
      options={source ? options : { ...options, ...stickyPlayerControls }}
      onError={onError}
      onExit={source ? onExit : undefined}
      onStreamStateChange={onStreamStateChange}
      onPlaybackActionsReady={onPlaybackActionsReady}
    >
      <VideoStreamerResolver />
    </Replay>
    {!source && (
      <Flex position="absolute" left={0} right={0} top={0} direction="column" pt={12} alignItems="center" opacity={0.7}>
        <Text width="20%" mt={6}>
          <Link href="https://vimond.github.io/replay/" isExternal>
            <Image src={ReplayLogo} alt="Replay" width="8rem" margin="0 auto" />
          </Link>
        </Text>
        <Text color="white" mt={6}>
          The{' '}
          <Link href="https://vimond.github.io/replay/" isExternal style={{ textDecoration: 'underline' }}>
            open source
          </Link>{' '}
          React video player from{' '}
          <Link href="https://vimond.com" isExternal style={{ textDecoration: 'underline' }}>
            Vimond
          </Link>
          .
        </Text>
      </Flex>
    )}
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
