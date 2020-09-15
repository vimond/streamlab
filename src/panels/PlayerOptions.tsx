import React from 'react';
import { Button, Grid, Link, Switch, FormLabel, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { setLogLevel, togglePlaybackMonitor, setPlayerConfiguration } from '../store/actions/playerOptions';
import { getLogLevelLabel, PlayerLogLevel } from '../store/model/streamDetails';
import { JsonEditor } from '../components/JsonEditor';
import { updateAddressBar } from '../store/model/sharing';

type Props = {
  logLevel: PlayerLogLevel;
  showPlaybackMonitor: boolean;
  customConfiguration: string;
  handleLogLevelClick: (level: PlayerLogLevel) => void;
  handlePlaybackMonitorToggle: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlayerConfigurationChange: (value: string) => void;
};

// TODO: Let clicks on log level label open the log level menu, parallel to the switch label.

const PlayerOptions: React.FC<Props> = ({
  logLevel,
  showPlaybackMonitor,
  customConfiguration,
  handleLogLevelClick,
  handlePlaybackMonitorToggle,
  handlePlayerConfigurationChange,
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
        <MenuList zIndex={5}>
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
      Player configuration overrides according to{' '}
      <Link
        href="https://vimond.github.io/replay/#/custom-replay/configuration"
        isExternal
        style={{ textDecoration: 'underline' }}
      >
        Replay documentation
      </Link>
      :
    </Text>
    <JsonEditor value={customConfiguration} onChange={handlePlayerConfigurationChange} />
  </form>
);

const mapStateToProps = (state: AppState) => ({
  ...state.playerOptions,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleLogLevelClick: (value: PlayerLogLevel) => {
    updateAddressBar();
    return dispatch(setLogLevel(value));
  },
  handlePlayerConfigurationChange: (value: string) => {
    updateAddressBar();
    return dispatch(setPlayerConfiguration(value));
  },
  handlePlaybackMonitorToggle: (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateAddressBar();
    return dispatch(togglePlaybackMonitor(evt.target.checked));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerOptions);
