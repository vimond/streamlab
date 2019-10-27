import React from 'react';
import { Box, ColorModeProvider, CSSReset, Flex, ThemeProvider } from '@chakra-ui/core';
import 'vimond-replay/index.css';
import './App.css';
import Advanced from './layout/Advanced';
import Sidebar from './layout/Sidebar';
import Basic from './layout/Basic';
import * as Space from 'react-spaces';
import { AppState } from './store/reducers';
import { connect } from 'react-redux';
import Player from './layout/Player';
import HeaderBar from './layout/HeaderBar';
import { Action } from "./store/actions";
import { Dispatch } from "redux";
import { handlePaneResize } from "./store/actions/ui";

type Props = {
  advancedMode: boolean;
  rightPaneWidth?: number | string;
  handlePaneResize: (size: number) => null
};

function App(props: Props) {
  const { advancedMode, handlePaneResize, rightPaneWidth = '33%' } = props;
  return (
    <ThemeProvider>
      <ColorModeProvider value="light">
        <CSSReset />
        <Space.ViewPort>
          <Space.Fill>
            <Flex height="100vh" direction="column">
              <HeaderBar />
              <Box flex="1 1 auto" overflowY="auto">
                {advancedMode ? <Advanced /> : <Basic />}
                <Player />
              </Box>
            </Flex>
          </Space.Fill>
          <Space.RightResizable size={rightPaneWidth} trackSize={true} onResizeEnd={handlePaneResize}>
            <Sidebar />
          </Space.RightResizable>
        </Space.ViewPort>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode,
  rightPaneWidth: state.ui.rightPaneWidth
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handlePaneResize: (size: number) => {
    dispatch(handlePaneResize(size));
    return null;
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
