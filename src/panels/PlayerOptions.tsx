import React from 'react';
import {
  Button,
  Grid,
  Link,
  Switch,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Textarea,
  Text
} from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { setLogLevel, togglePlaybackMonitor, setPlayerConfiguration } from '../store/actions/playerOptions';
import { getLogLevelLabel, PlayerLogLevel } from '../store/model/streamDetails';

type Props = {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
  handleLogLevelClick: (level: PlayerLogLevel) => void;
  handlePlaybackMonitorToggle: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlayerConfigurationChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const isInvalidJson = (str: string) => {
  const trimmed = str && str.trim();
  if (trimmed) {
    try {
      JSON.parse(trimmed);
      return false;
    } catch (e) {
      return true;
    }
  } else {
    return false;
  }
};

// TODO: Let clicks on log level label open the log level menu, parallel to the switch label.

const PlayerOptions: React.FC<Props> = ({
  logLevel,
  showPlaybackMonitor,
  customConfiguration,
  handleLogLevelClick,
  handlePlaybackMonitorToggle,
  handlePlayerConfigurationChange
}) => (
  <form>
    <Grid templateColumns="auto 1fr" gap={4} my={2} alignItems="center">
      <Switch
        id="playback-monitor-switch"
        style={{ justifySelf: 'end' }}
        isChecked={showPlaybackMonitor}
        onChange={handlePlaybackMonitorToggle}
      >
        &nbsp;
      </Switch>
      <FormLabel htmlFor="playback-monitor-switch">Display playback monitor overlay at startup</FormLabel>
      <Menu>
        {/*
            // @ts-ignore */}
        <MenuButton as={Button} rightIcon="chevron-down" style={{ justifySelf: 'end' }}>
          {getLogLevelLabel(logLevel)}
        </MenuButton>
        <MenuList>
          {Object.entries(PlayerLogLevel)
            // @ts-ignore
            .filter(([key]) => !isNaN(Number(PlayerLogLevel[key])))
            .map(([key, value]) => (
              <MenuItem key={value} onClick={() => handleLogLevelClick(Number(value))}>
                {key}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
      <FormLabel>Player log level (for messages to the JS console)</FormLabel>
    </Grid>
    <Text mt={4} mb={1}>
      Player{' '}
      <Link
        href="https://vimond.github.io/replay/#/custom-replay/configuration"
        isExternal
        style={{ textDecoration: 'underline' }}
      >
        configuration overrides
      </Link>
      :
    </Text>
    <Textarea
      height="8rem"
      placeholder="A valid JSON structure with properties found in the Replay configuration documentation linked above."
      value={customConfiguration}
      onChange={handlePlayerConfigurationChange}
      isInvalid={isInvalidJson(customConfiguration)}
    />
  </form>
);

const mapStateToProps = (state: AppState) => ({
  ...state.playerOptions
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleLogLevelClick: (value: PlayerLogLevel) => dispatch(setLogLevel(value)),
  handlePlayerConfigurationChange: (evt: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setPlayerConfiguration(evt.target.value)),
  handlePlaybackMonitorToggle: (evt: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(togglePlaybackMonitor(evt.target.checked))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerOptions);
