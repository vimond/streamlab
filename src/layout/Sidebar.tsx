import React, { Fragment } from 'react';
import { Heading, FormLabel, Tab, TabList, TabPanel, TabPanels, Tabs, FormControl, Switch } from '@chakra-ui/core';
import Info from './Info';
import Share from "./Share";
import History from "./History";
import {  } from "@chakra-ui/core/dist";

type Props = {
  onAdvancedToggle: (evt: React.ChangeEvent<HTMLInputElement>) => void
};

const Sidebar: React.FC<Props> = ({ onAdvancedToggle }: Props) => (
  <Fragment>
    <Heading flex="0" textAlign="center" p={4} backgroundColor="gray.300">
      Streamlab
    </Heading>
    <FormControl backgroundColor="gray.300" display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <Switch id="advanced-switch" onChange={onAdvancedToggle}> </Switch>
      <FormLabel ml={2} htmlFor="advanced-switch"> Advanced</FormLabel>
    </FormControl>
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
  </Fragment>
);

export default Sidebar;
