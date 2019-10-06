import React, { Component } from 'react';
import { ThemeProvider, ColorModeProvider, Box, CSSReset, Flex } from '@chakra-ui/core';
import { Replay } from 'vimond-replay';
import 'vimond-replay/index.css';
import './App.css';
import Advanced from './layout/Advanced';
import Sidebar from './layout/Sidebar';
import Basic from "./layout/Basic";

type State = {
  isAdvancedEnabled: boolean
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
          <CSSReset/>
          <Flex
            flexDirection={ ['column-reverse', 'column-reverse', 'row', 'row'] }
            alignItems="stretch"
            backgroundColor="gray.200"
          >
            <Box width="100%" flex="1 1 auto" minWidth="30em">
              {isAdvancedEnabled ? <Advanced/> : <Basic/> }
            </Box>
            <Box
              flex="0.1 1 auto"
              display="flex"
              flexDirection="column"
              maxWidth={ ['auto', 'auto', 'lg', 'lg'] }
              minWidth={ ['auto', 'auto', 'sm', 'sm'] }
            >
              <Sidebar onAdvancedToggle={this.onAdvancedToggle}/>
            </Box>
          </Flex>
          <Box mx={ [0, 0, 8, 24] } my={ 8 }>
            <Replay
              options={ {
                interactionDetector: {
                  inactivityDelay: -1
                }
              } }
            />
          </Box>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

export default App;
