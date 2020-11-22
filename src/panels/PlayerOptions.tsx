import React from 'react';
import { Button, Grid, Link, Switch, FormLabel, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import { AppState } from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { setLogLevel, togglePlaybackMonitor, setPlayerConfiguration } from '../store/actions/playerOptions';
import { getLogLevelLabel, PlayerLogLevel } from '../store/model/streamDetails';
import { JsonEditor } from '../components/JsonEditor';
import { updateAddressBar } from '../store/model/sharing';
import { ChevronDownIcon } from '@chakra-ui/icons';

// TODO: Let clicks on log level label open the log level menu, parallel to the switch label.

const PlayerOptions: React.FC = () => {
  const { logLevel, showPlaybackMonitor, customConfiguration } = useSelector((state: AppState) => ({
    ...state.playerOptions,
  }));
  const dispatch = useDispatch();

  const handleLogLevelClick = (value: PlayerLogLevel) => {
    updateAddressBar();
    dispatch(setLogLevel(value));
  };
  const handlePlayerConfigurationChange = (value: string) => {
    updateAddressBar();
    return dispatch(setPlayerConfiguration(value));
  };
  const handlePlaybackMonitorToggle = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateAddressBar();
    return dispatch(togglePlaybackMonitor(evt.target.checked));
  };

  return (
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
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} style={{ justifySelf: 'end' }}>
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
};

export default PlayerOptions;
