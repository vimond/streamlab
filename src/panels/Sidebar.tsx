import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import Info from './Info';
import FormHistory from './FormHistory';
import Settings from './Settings';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { updateActiveRightPaneTab } from '../store/actions/ui';
import { connect } from 'react-redux';

const Sidebar: React.FC<{ activeTabIndex: number; handleActiveTabChange: (index: any) => void }> = ({
  activeTabIndex,
  handleActiveTabChange
}) => (
  <Tabs
    flex="1 1 auto"
    display="flex"
    flexDirection="column"
    alignContent="stretch"
    isFitted
    backgroundColor="gray.100"
    height="100vh"
    index={activeTabIndex}
    onChange={handleActiveTabChange}
  >
    <TabList flex="0 0 auto" backgroundColor="white">
      <Tab>Info</Tab>
      <Tab>History</Tab>
      <Tab>Settings</Tab>
    </TabList>
    <TabPanels flex="1 1 auto" overflowY="auto" outline="none">
      <TabPanel>
        <Info />
      </TabPanel>
      <TabPanel>
        <FormHistory />
      </TabPanel>
      <TabPanel>
        <Settings />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

const mapStateToProps = (state: AppState) => ({
  activeTabIndex: state.ui.rightPaneActiveTabIndex
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  // @ts-ignore Typing not supported for thunk actions.
  handleActiveTabChange: (index: number) => dispatch(updateActiveRightPaneTab(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
