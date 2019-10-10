import React from 'react';
import { Box, Button, FormLabel, Stack, Textarea, Checkbox, Text, Input } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import SidebarSwitch from '../components/SidebarSwitch';

const Share: React.FC = () => (
  <Stack>
    <Box mx={4}>
      <Header level={Level.H3}>Share form details</Header>
      <Text mb={1}>Select details to share:</Text>
      <Stack>
        <Checkbox color="blue">API server and asset</Checkbox>
        <Checkbox color="blue">Stream details and proxy settings</Checkbox>
        <Checkbox color="blue">Stream processor settings</Checkbox>
        <Checkbox color="blue">Player options</Checkbox>
      </Stack>
      <FormLabel htmlFor="share-form-details-textarea" mt={2}>
        Streamlab URL including the selected form details:
      </FormLabel>
      <Input id="share-form-details-textarea" />
      <Button variantColor="blue" my={4}>
        Copy to clipboard
      </Button>
    </Box>
    <Box mx={4}>
      <Header level={Level.H3}>Proxy URLs for streams</Header>
      <Text>Play streams through the stream proxy in other apps or pages by using these URLs:</Text>
      <FormLabel htmlFor="proxy-stream-url-input" mt={2}>
        Stream URL
      </FormLabel>
      <Input id="proxy-stream-url-input" />
      <FormLabel htmlFor="proxy-license-url-input" mt={2}>
        License URL
      </FormLabel>
      <Input id="proxy-license-url-input" />
    </Box>
    <Box mx={4}>
      <Header level={Level.H3}>Transfer history</Header>
      <Header level={Level.H4}>Import history</Header>
      <FormLabel htmlFor="import-history-textarea">Paste exported history JSON here:</FormLabel>
      <Textarea id="import-history-textarea" mb={4} />
      <SidebarSwitch label="Replace existing form history" />
      <SidebarSwitch label="Replace existing presets" />
      <Button my={4} variantColor="blue">
        Import
      </Button>
      <Header level={Level.H4}>Export history</Header>
      <SidebarSwitch label="Include form history" isChecked />
      <SidebarSwitch label="Include presets" isChecked />
      <FormLabel htmlFor="import-history-textarea" mt={2}>
        History JSON:
      </FormLabel>
      <Textarea id="import-history-textarea" />
      <Button variantColor="blue" my={4}>
        Copy to clipboard
      </Button>
    </Box>
  </Stack>
);

export default Share;
