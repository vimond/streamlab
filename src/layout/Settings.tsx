import React from 'react';
import { Box, Button, FormLabel, Text, Input, InputRightAddon, InputGroup } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import SidebarSwitch from '../components/SidebarSwitch';

const Settings: React.FC = () => (
  <Box mx={4}>
    <Header level={Level.H3}>History & presets</Header>
    <SidebarSwitch label="Save all form fields on every playback start" isChecked />
    <Box display="grid" gridTemplateColumns="1fr 2fr" gridAutoRows="auto" gridGap={2} my={4} alignItems="center">
      <InputGroup size="sm">
        <Input type="number" value={100} id="max-history-count" onChange={() => {}} />
        <InputRightAddon children="days" />
      </InputGroup>
      <FormLabel htmlFor="max-history-count" mt="1">
        Maximum history age
      </FormLabel>
      <Button variantColor="red" id="clear-all-forms-button">
        Clear forms
      </Button>
      <FormLabel htmlFor="clear-all-forms-button" mt="1">
        Clear all current form details
      </FormLabel>
      <Button variantColor="red" id="clear-history-button">
        Clear history
      </Button>
      <FormLabel htmlFor="clear-history-button" mt="1">
        Clear history except presets
      </FormLabel>
      <Button variantColor="red" id="clear-presets-button">
        Clear presets
      </Button>
      <FormLabel htmlFor="clear-history-button" mt="1">
        Clear stored presets
      </FormLabel>
    </Box>
    <Text>Presets and history are saved to local storage.</Text>
  </Box>
);

export default Settings;
