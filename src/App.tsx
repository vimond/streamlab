import React, { RefObject } from 'react';
import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core';
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box, Button,
  CSSReset, Flex, FormControl,
  Heading, Input, Stack,
  Text
} from '@chakra-ui/core/dist';
import PanelGroup from 'react-panelgroup';

// Drawer for save/load.

const SectionHeader: React.FC<{ header: string }> = ({ header }) => (
  <AccordionHeader>
    <Heading as="h2" fontWeight="normal" size="sm" margin={0} padding={1} flex="1" textAlign="left">
      {header}
    </Heading>
    <AccordionIcon />
  </AccordionHeader>
);

const App: React.FC = () => (
  <ThemeProvider>
    <ColorModeProvider value="light">
      <CSSReset />
      <PanelGroup borderColor="#eee" spacing={3} panelWidths={[{ resize: 'stretch', size: 100 }, { resize: 'stretch', size: 70 }]}>
        <Accordion width="100%" defaultIndex={[1]} allowMultiple>
          <AccordionItem>
            <SectionHeader header="API lookup"/>
            <AccordionPanel><Text>TODO</Text></AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <SectionHeader header="Stream details"/>
            <AccordionPanel>
              <form>
                <Stack>
                  <FormControl isRequired>
                    <Input placeholder="Stream URL" type="url"/>
                  </FormControl>
                  <FormControl isRequired>
                    <Input placeholder="DRM license URL" type="url" />
                  </FormControl>
                  <FormControl isRequired>
                    <Input placeholder="Subtitles URL" type="url" />
                  </FormControl>
                  <Flex justify="center">
                    <Button variantColor="green" mx={1}>Play</Button>
                    <Button mx={1}>Clear</Button>
                  </Flex>
                </Stack>
              </form>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <SectionHeader header="Stream proxy"/>
            <AccordionPanel><Text>TODO</Text></AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <SectionHeader header="Player options"/>
            <AccordionPanel><Text>TODO</Text></AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Box width="100%" height="100%" backgroundColor="gray.100">
          <Heading textAlign="center" p={6} backgroundColor="gray.100">
            Streamlab
          </Heading>
          <Alert status="info" alignItems="flex-start">
            <AlertIcon />
            Welcome to Streamlab.
          </Alert>
          <Alert status="info" alignItems="flex-start">
            <AlertIcon />
            Fill in an URL to the stream you want to test, and press Play.
          </Alert>
        </Box>
      </PanelGroup>
    </ColorModeProvider>
  </ThemeProvider>
);

export default App;
