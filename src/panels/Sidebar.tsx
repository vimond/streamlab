import React from 'react';
import { Badge, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Information from './Information';
import FormHistory from './FormHistory';
import Sharing from './Sharing';
import { AppState } from '../store/reducers';
import { updateActiveRightPaneTab } from '../store/actions/ui';
import { useDispatch, useSelector } from 'react-redux';
import { MessageLevel } from '../store/model/messageResolver';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const activeTabIndex = useSelector((state: AppState) => state.ui.rightPaneActiveTabIndex);
  const errorMessageCount = useSelector(
    (state: AppState) => state.information.messages.filter((m) => m.level === MessageLevel.ERROR).length
  );
  const handleActiveTabChange = (index: number) => dispatch(updateActiveRightPaneTab(index));

  return (
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
            <Badge ml={2} colorScheme="red" variant="solid">
              {errorMessageCount}
            </Badge>
          )}
        </Tab>
        <Tab>History</Tab>
        <Tab>Sharing</Tab>
      </TabList>
      <TabPanels flex="1 1 auto" overflowY="auto" outline="none">
        <TabPanel p={0} aria-label="Information panel" height="100%">
          <Information />
        </TabPanel>
        <TabPanel p={0} aria-label="Form history panel">
          <FormHistory />
        </TabPanel>
        <TabPanel p={0} aria-label="Sharing panel">
          <Sharing />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Sidebar;
