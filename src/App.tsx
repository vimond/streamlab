import React from 'react';
import { Box, ColorModeProvider, CSSReset, Flex, FormControl, FormLabel, Switch, ThemeProvider } from '@chakra-ui/core';
import 'vimond-replay/index.css';
import './App.css';
import Advanced from './layout/Advanced';
import Sidebar from './layout/Sidebar';
import Basic from './layout/Basic';
import * as Space from 'react-spaces';
import Header, { Level } from './components/Header';
import { AppState } from './store/reducers';
import { toggleAdvancedMode } from './store/actions/ui';
import { Action } from './store/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Player from './layout/Player';

type Props = {
  advancedMode: boolean;
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

function App(props: Props) {
  const { advancedMode, toggleAdvancedMode } = props;
  return (
    <ThemeProvider>
      <ColorModeProvider value="light">
        <CSSReset />
        <Space.ViewPort>
          <Space.Fill>
            <Flex height="100vh" direction="column">
              <Flex direction="row" align="center" backgroundColor="gray.200" flex="0">
                <Header level={Level.H1} flex="1 1 auto">
                  Streamlab
                </Header>
                <FormControl
                  flex="0"
                  p={2}
                  mt={2}
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Switch id="advanced-switch" isChecked={advancedMode} onChange={toggleAdvancedMode}>
                    &nbsp;
                  </Switch>
                  <FormLabel ml={2} htmlFor="advanced-switch">
                    Advanced
                  </FormLabel>
                </FormControl>
              </Flex>
              <Box flex="1 1 auto" overflowY="auto">
                {advancedMode ? <Advanced /> : <Basic />}
                <Player />
              </Box>
            </Flex>
          </Space.Fill>
          <Space.RightResizable size="33%">
            <Sidebar />
          </Space.RightResizable>
        </Space.ViewPort>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => dispatch(toggleAdvancedMode(evt.target.checked))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
