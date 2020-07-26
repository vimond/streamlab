import { Replay } from 'vimond-replay';
import React from 'react';
import { Box, Text, Flex, Link, Image } from '@chakra-ui/core';
import { PlaybackSource } from 'vimond-replay/default-player/Replay';
import { PlayerConfiguration } from 'vimond-replay';
import ReplayLogo from '../graphics/replay-logo.svg';

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
  <Box my={1} p={4} position="relative">
    {!source && (
      <Flex position="absolute" left={0} right={0} zIndex={33} direction="column" pt={12} alignItems="center" opacity={0.7}>
        <Text width="20%" mt={6}>
          <Link href="https://vimond.github.io/replay/" isExternal>
            <Image src={ReplayLogo} alt="Replay" />
          </Link>
        </Text>
        <Text color="white" mt={6}>
          The {' '}
          <Link href="https://vimond.github.io/replay/" isExternal style={{ textDecoration: 'underline' }}>
            open source React player
          </Link>
          {' '} from {' '}
          <Link href="https://vimond.com" isExternal style={{ textDecoration: 'underline' }}>
            Vimond
          </Link>
          .
        </Text>
      </Flex>
    )}
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
