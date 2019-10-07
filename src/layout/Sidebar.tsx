import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import Info from './Info';
import Share from './Share';
import History from './History';
import {} from '@chakra-ui/core/dist';

type Props = {
  onAdvancedToggle: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const Sidebar: React.FC<Props> = ({ onAdvancedToggle }: Props) => (
  <Tabs flex="1 1 auto" display="flex" flexDirection="column" alignContent="stretch" isFitted>
    <TabList flex="0" backgroundColor="white">
      <Tab>Info</Tab>
      <Tab>History</Tab>
      <Tab>Share</Tab>
    </TabList>
    <TabPanels flex="1 1 auto">
      <TabPanel>
        <Info />
      </TabPanel>
      <TabPanel>
        <History />
      </TabPanel>
      <TabPanel>
        <Share />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default Sidebar;
