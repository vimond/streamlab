import React, { Component } from 'react';
import { Box, ColorModeProvider, CSSReset, Flex, ThemeProvider } from '@chakra-ui/core';
import Advanced from './panels/Advanced';
import Sidebar from './panels/Sidebar';
import Basic from './panels/Basic';
import Split from 'react-split';
import { AppState } from './store/reducers';
import { connect } from 'react-redux';
import Player from './panels/Player';
import HeaderBar from './panels/HeaderBar';
import { Action } from './store/actions';
import { Dispatch } from 'redux';
import { updatePaneSize } from './store/actions/ui';
import { applyBrowserEnvironment } from './store/actions/streamDetails';

import 'vimond-replay/index.css';
import './App.css';

type Props = {
  advancedMode: boolean;
  rightPaneWidth?: number;
  isRightPaneExpanded: boolean;
  handlePaneResize: (sizes: number[]) => void;
  initializeFeatureState: (userAgent: string, queryString: string) => void;
};

const gutterStyle = () => ({ backgroundColor: '#E2E8F0', width: '4px' });

class App extends Component<Props> {
  componentDidMount(): void {
    this.props.initializeFeatureState(navigator.userAgent, document.location.search);
  }

  render() {
    const { advancedMode, handlePaneResize, isRightPaneExpanded, rightPaneWidth = 33 } = this.props;
    return (
      <ThemeProvider>
        <ColorModeProvider value="light">
          <CSSReset />
          <Split
            onDragEnd={handlePaneResize}
            sizes={[100 - rightPaneWidth, rightPaneWidth]}
            direction="horizontal"
            cursor="col-resize"
            gutterAlign="end"
            gutterSize={4}
            gutterStyle={gutterStyle}
            collapsed={isRightPaneExpanded ? undefined : 1}
            minSize={isRightPaneExpanded ? 300 : 0}
            style={{ display: 'flex' }}
          >
            <Flex height="100vh" direction="column">
              <HeaderBar />
              <Box flex="1 1 auto" overflowY="auto">
                {advancedMode ? <Advanced /> : <Basic />}
                <Player />
              </Box>
            </Flex>
            <Sidebar />
          </Split>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode,
  rightPaneWidth: state.ui.rightPaneWidth,
  isRightPaneExpanded: state.ui.isRightPaneExpanded,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handlePaneResize: (sizes: number[]) => {
    dispatch(updatePaneSize(sizes[1]));
    return null;
  },
  initializeFeatureState: (userAgent: string, queryString: string) => {
    dispatch(applyBrowserEnvironment(userAgent, queryString));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
