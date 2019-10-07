import React, { Component } from 'react';
import {
  FormControl,
  Switch,
  FormLabel,
  ThemeProvider,
  ColorModeProvider,
  Heading,
  CSSReset,
  Flex,
  Box
} from '@chakra-ui/core';
import { Replay } from 'vimond-replay';
import 'vimond-replay/index.css';
import './App.css';
import Advanced from './layout/Advanced';
import Sidebar from './layout/Sidebar';
import Basic from './layout/Basic';
import * as Space from 'react-spaces';

type State = {
  isAdvancedEnabled: boolean;
};

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isAdvancedEnabled: true
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
                <Heading as="h1" size="md" flex="1 1 auto" px={4}>
                  Streamlab
                </Heading>
                <FormControl
                  flex="0"
                  p={2}
                  mt={2}
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Switch id="advanced-switch" isChecked={isAdvancedEnabled} onChange={this.onAdvancedToggle}>
                  </Switch>
                  <FormLabel ml={2} htmlFor="advanced-switch">
                    Advanced
                  </FormLabel>
                </FormControl>
              </Flex>
              {isAdvancedEnabled ? <Advanced /> : <Basic />}
              <Box my={1}>
                <Replay
                  options={ {
                    interactionDetector: {
                      inactivityDelay: -1
                    }
                  } }
                />
              </Box>
            </Space.Fill>
            <Space.RightResizable size="30%" scrollable={true}>
              <Sidebar onAdvancedToggle={this.onAdvancedToggle} />
            </Space.RightResizable>
          </Space.ViewPort>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

export default App;
