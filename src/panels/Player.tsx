import { Replay } from 'vimond-replay';
import React from 'react';
import { Box, Text, Flex, Link, Image } from '@chakra-ui/react';
import { PlaybackActions, VideoStreamState } from 'vimond-replay/default-player/Replay';
import ReplayLogo from '../graphics/replay-logo.svg';

import { AppState } from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { handlePlayerError, stop } from '../store/actions/player';
import VideoStreamerResolver from './VideoStreamerResolver';
import { applyRequestInterceptors } from '../store/model/request-interceptors';

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
  console.log(`Streamlab v${process.env.REACT_APP_VERSION}`);
  console.info(
    'Playback methods and playback state is exposed to a global %cplayer %cobject. Expand for details:',
    highlightConsoleStyle,
    normalConsoleStyle
  );
  // @ts-ignore
  console.dir(window.player);
  console.info(
    'Start playing a stream. then type e.g. %cplayer.setPosition(123), %cto seek to 02:03, or %cplayer.state.position %cto get the current playback position.',
    highlightConsoleStyle,
    normalConsoleStyle,
    highlightConsoleStyle,
    normalConsoleStyle
  );
};

const Player: React.FC = () => {
  const { source, options, playerLibraryOverride, additionalRequestData, visibleLogo } = useSelector(
    (state: AppState) => ({
      ...state.player,
    })
  );
  const dispatch = useDispatch();
  const onExit = () => dispatch(stop);
  const onError = (err: any) => dispatch(handlePlayerError(err));

  const mergedOptions = applyRequestInterceptors(source, options, additionalRequestData);

  return (
    <Box my={1} p={4} position="relative">
      <Replay
        source={source}
        options={source ? mergedOptions : { ...mergedOptions, ...stickyPlayerControls }}
        onError={onError}
        onExit={source ? onExit : undefined}
        onStreamStateChange={onStreamStateChange}
        onPlaybackActionsReady={onPlaybackActionsReady}
      >
        <VideoStreamerResolver playerLibraryOverride={playerLibraryOverride} />
      </Replay>
      {visibleLogo && (
        <Flex
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={16}
          direction="column"
          alignItems="center"
          justifyContent="center"
          opacity={0.7}
        >
          <Text width="20%">
            <Link href="https://vimond.github.io/replay/" isExternal>
              <Image src={ReplayLogo} alt="Replay" width="8rem" margin="0 auto" />
            </Link>
          </Text>
          <Text color="white" mt={2} size="sm" width="12rem" align="center" lineHeight={1.3}>
            The{' '}
            <Link href="https://vimond.github.io/replay/" isExternal style={{ textDecoration: 'underline' }}>
              open source
            </Link>
            <br />
            React video player <br />
            from{' '}
            <Link href="https://vimond.com" isExternal style={{ textDecoration: 'underline' }}>
              Vimond
            </Link>
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default Player;
