import React, { Component } from 'react';
import { FormControl, Switch, FormLabel, ThemeProvider, ColorModeProvider, CSSReset, Flex, Box } from '@chakra-ui/core';
import { Replay } from 'vimond-replay';
import 'vimond-replay/index.css';
import './App.css';
import Advanced from './layout/Advanced';
import Sidebar from './layout/Sidebar';
import Basic from './layout/Basic';
import * as Space from 'react-spaces';
import Header, { Level } from './components/Header';

type State = {
  isAdvancedEnabled: boolean;
};

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isAdvancedEnabled: false
    };
  }

  onAdvancedToggle = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isAdvancedEnabled: evt.target.checked });
  };

  render() {
    const { isAdvancedEnabled } = this.state;
    return (
      <ThemeProvider>
        <ColorModeProvider value="light">
          <CSSReset />
          <Space.ViewPort>
            <Space.Fill scrollable={true}>
              <Flex direction="row" align="center" backgroundColor="gray.200">
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
                  <Switch id="advanced-switch" isChecked={isAdvancedEnabled} onChange={this.onAdvancedToggle}>&nbsp;</Switch>
                  <FormLabel ml={2} htmlFor="advanced-switch">
                    Advanced
                  </FormLabel>
                </FormControl>
              </Flex>
              {isAdvancedEnabled ? <Advanced /> : <Basic />}
              <Box my={1}>
                <Replay
                  options={{
                    interactionDetector: {
                      inactivityDelay: -1
                    }
                  }}
                />
              </Box>
            </Space.Fill>
            <Space.RightResizable size="33%" scrollable={true}>
              <Sidebar onAdvancedToggle={this.onAdvancedToggle} />
            </Space.RightResizable>
          </Space.ViewPort>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

export default App;
