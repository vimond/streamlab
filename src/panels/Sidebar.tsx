import React from 'react';
import { Badge, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import Information from './Information';
import FormHistory from './FormHistory';
import Sharing from './Sharing';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { updateActiveRightPaneTab } from '../store/actions/ui';
import { connect } from 'react-redux';
import { MessageLevel } from '../store/model/messageResolver';

const Sidebar: React.FC<{
  activeTabIndex: number;
  errorMessageCount: number;
  handleActiveTabChange: (index: any) => void;
}> = ({ activeTabIndex, errorMessageCount, handleActiveTabChange }) => (
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
      <Tab>
        Info{' '}
        {activeTabIndex > 0 && errorMessageCount > 0 && (
          <Badge ml={2} variantColor="red" variant="solid">
            {errorMessageCount}
          </Badge>
        )}
      </Tab>
      <Tab>History</Tab>
      <Tab>Sharing</Tab>
    </TabList>
    <TabPanels flex="1 1 auto" overflowY="auto" outline="none">
      <TabPanel>
        <Information />
      </TabPanel>
      <TabPanel>
        <FormHistory />
      </TabPanel>
      <TabPanel>
        <Sharing />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

const mapStateToProps = (state: AppState) => ({
  activeTabIndex: state.ui.rightPaneActiveTabIndex,
  errorMessageCount: state.information.messages.filter((m) => m.level === MessageLevel.ERROR).length,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  // @ts-ignore Typing not supported for thunk actions.
  handleActiveTabChange: (index: number) => dispatch(updateActiveRightPaneTab(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
