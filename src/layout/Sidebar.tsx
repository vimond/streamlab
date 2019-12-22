import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import Info from './Info';
import FormHistory from './FormHistory';
import Settings from './Settings';

const Sidebar: React.FC = () => (
  <Tabs
    flex="1 1 auto"
    display="flex"
    flexDirection="column"
    alignContent="stretch"
    isFitted
    backgroundColor="gray.100"
    height="100vh"
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

export default Sidebar;
