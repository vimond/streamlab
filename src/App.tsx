import React, { Component } from 'react';
import { Box, ColorModeProvider, CSSReset, Flex, ThemeProvider } from '@chakra-ui/core';
import Advanced from './panels/Advanced';
import Sidebar from './panels/Sidebar';
import Basic from './panels/Basic';
import { ViewPort, Fill, RightResizable } from 'react-spaces';
import { AppState } from './store/reducers';
import { connect } from 'react-redux';
import Player from './panels/Player';
import HeaderBar from './panels/HeaderBar';
import { Action } from './store/actions';
import { Dispatch } from 'redux';
import { updatePaneSize } from './store/actions/ui';
import { setBrowserFeatures } from './store/actions/streamDetails';

import 'vimond-replay/index.css';
import './App.css';

type Props = {
  advancedMode: boolean;
  rightPaneWidth?: number | string;
  handlePaneResize: (size: number) => void;
  initializeFeatureState: (userAgent: string) => void;
};

class App extends Component<Props> {
  componentDidMount(): void {
    this.props.initializeFeatureState(navigator.userAgent);
  }

  render() {
    const { advancedMode, handlePaneResize, rightPaneWidth = '33%' } = this.props;
    console.log(rightPaneWidth);
    return (
      <ThemeProvider>
        <ColorModeProvider value="light">
          <CSSReset />
          <ViewPort>
            <Fill>
              <Flex height="100vh" direction="column">
                <HeaderBar />
                <Box flex="1 1 auto" overflowY="auto">
                  {advancedMode ? <Advanced /> : <Basic />}
                  <Player />
                </Box>
              </Flex>
            </Fill>
            <RightResizable size={rightPaneWidth} trackSize={true} onResizeEnd={handlePaneResize} minimumSize={100}>
              <Sidebar />
            </RightResizable>
          </ViewPort>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode,
  rightPaneWidth: state.ui.rightPaneWidth,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handlePaneResize: (size: number) => {
    dispatch(updatePaneSize(size));
    return null;
  },
  initializeFeatureState: (userAgent: string) => {
    dispatch(setBrowserFeatures(userAgent));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
