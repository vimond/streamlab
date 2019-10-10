import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import Info from './Info';
import Share from './Share';
import FormHistory from './FormHistory';
import Settings from './Settings';

type Props = {
  onAdvancedToggle: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const Sidebar: React.FC<Props> = () => (
  <Tabs
    flex="1 1 auto"
    display="flex"
    flexDirection="column"
    alignContent="stretch"
    isFitted
    backgroundColor="gray.100"
    minHeight="100%"
  >
    <TabList flex="0" backgroundColor="white">
      <Tab>Info</Tab>
      <Tab>History</Tab>
      <Tab>Settings</Tab>
      <Tab>Share</Tab>
    </TabList>
    <TabPanels flex="1 1 auto">
      <TabPanel>
        <Info />
      </TabPanel>
      <TabPanel>
        <FormHistory />
      </TabPanel>
      <TabPanel>
        <Settings />
      </TabPanel>
      <TabPanel>
        <Share />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default Sidebar;
