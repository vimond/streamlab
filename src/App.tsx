import React, { useEffect } from 'react';
import { Box, Flex, ChakraProvider, extendTheme } from '@chakra-ui/react';
import Advanced from './panels/Advanced';
import Sidebar from './panels/Sidebar';
import Basic from './panels/Basic';
import Split from 'react-split';
import { AppState } from './store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import Player from './panels/Player';
import HeaderBar from './panels/HeaderBar';
import { updatePaneSize } from './store/actions/ui';
import { applyBrowserEnvironment } from './store/actions/streamDetails';

import 'vimond-replay/index.css';
import './App.css';

// Needed for menu dropdown to overlay subsequent items with custom z-index.
const theme = extendTheme({
  components: {
    Menu: {
      baseStyle: {
        list: {
          zIndex: 5,
        },
      },
    },
  },
});

const gutterStyle = () => ({ backgroundColor: '#E2E8F0', width: '4px' });

const App: React.FC = () => {
  const advancedMode = useSelector((state: AppState) => state.ui.advancedMode);
  const rightPaneWidth = useSelector((state: AppState) => state.ui.rightPaneWidth || 33);
  const isRightPaneExpanded = useSelector((state: AppState) => state.ui.isRightPaneExpanded);
  const dispatch = useDispatch();
  const handlePaneResize = (sizes: number[]) => dispatch(updatePaneSize(sizes[1]));

  useEffect(() => {
    dispatch(applyBrowserEnvironment(navigator.userAgent, document.location.search));
  }, [dispatch]);

  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
};

export default App;
