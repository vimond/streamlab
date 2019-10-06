import React from 'react';
import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core';
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button, Collapse,
  CSSReset,
  Flex,
  FormControl,
  Heading, IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Switch, Tab, TabList, TabPanel, TabPanels, Tabs,
  Text
} from '@chakra-ui/core/dist';
import { Replay } from 'vimond-replay';
import 'vimond-replay/index.css';
import './App.css';

// Drawer for save/load.

const SectionHeader: React.FC<{ header: string, isRequired?: boolean }> = ({ header, isRequired }) => (
  <AccordionHeader backgroundColor="gray.100">
    <Heading as="h2" size="sm" margin={0} padding={1} flex="1" textAlign="left">
      {header}
      {!isRequired && <Text as="em" fontStyle="normal" color="gray.500" fontWeight="normal" ml="4"> optional</Text>}
    </Heading>
    <AccordionIcon />
  </AccordionHeader>
);

const StreamDetailRow: React.FC<{
  label: string;
  onChange?: () => void;
  selectedTechOption: string;
  techOptions: string[];
  isTechOptionsEnabled?: boolean;
  isHeadersEnabled?: boolean;
}> = ({ label, onChange, selectedTechOption, techOptions, isTechOptionsEnabled, isHeadersEnabled }) => {
  const [showHeaders, setShow] = React.useState(false);
  const handleToggle = () => setShow(!showHeaders);
  return (
    <>
      <FormControl isRequired>
        <Input onChange={ onChange } placeholder={ label } type="url"/>
      </FormControl>
      <Menu>
        {/*
          // @ts-ignore */ }
        <MenuButton as={ Button } rightIcon="chevron-down" isDisabled={ !isTechOptionsEnabled }>
          { selectedTechOption }
        </MenuButton>
        <MenuList>
          { techOptions.map((option, i) => (
            <MenuItem key={ i }>{ option }</MenuItem>
          )) }
        </MenuList>
      </Menu>
      <FormControl justifySelf="center">
        <Switch onChange={ onChange } id="stream-proxy-activate">
          Activate proxy for { label }
        </Switch>
      </FormControl>
      <Button onClick={handleToggle} isDisabled={ !isHeadersEnabled }>Add</Button>
      <Box gridColumn="1/span 4">
        <Collapse isOpen={showHeaders}>
          <Flex direction="row" mt={2} mb={4}>
            <Input flex="1 2 auto" placeholder="Header name" mr={2}/>
            <Input flex="2 1 auto" placeholder="Header value" mr={2}/>
            {/*
              // @ts-ignore */ }
            <IconButton flex="0" aria-label="Remove" icon="delete"/>
          </Flex>
        </Collapse>
      </Box>
    </>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <ColorModeProvider value="light">
      <CSSReset />
      <Flex flexDirection={['column-reverse', 'column-reverse', 'row', 'row']} alignItems="stretch" backgroundColor="gray.200">
        <Box width="100%" flex="1 1 auto" minWidth="30em">
          <Stack>
            <Accordion defaultIndex={[1]} allowMultiple>
              <AccordionItem>
                <SectionHeader header="CMS/API stream lookup" />
                <AccordionPanel ml={2} backgroundColor="White">
                  <Text>TODO</Text>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <SectionHeader header="Stream details" isRequired/>
                <AccordionPanel ml={2} backgroundColor="White">
                  <form>
                    <Box
                      display="grid"
                      gridTemplateColumns="1fr auto auto auto"
                      gridAutoRows="auto"
                      gridGap={2}
                      alignItems="center"
                    >
                      <Heading as="h6" size="sm" fontWeight="normal">
                        URLs
                      </Heading>
                      <Heading as="h6" size="sm" fontWeight="normal" justifySelf="center">
                        Technology
                      </Heading>
                      <Heading as="h6" size="sm" fontWeight="normal" justifySelf="center">
                        Proxy
                      </Heading>
                      <Heading as="h6" size="sm" fontWeight="normal" justifySelf="center">
                        Headers
                      </Heading>
                      <StreamDetailRow
                        label="Stream URL"
                        techOptions={['Auto', 'HLS', 'MPEG-DASH', 'Smooth stream', 'Progressive video']}
                        selectedTechOption="Auto"
                        isTechOptionsEnabled={true}
                        isHeadersEnabled={true}
                      />
                      <StreamDetailRow
                        label="DRM license URL"
                        techOptions={['Auto', 'Widevine', 'PlayReady', 'FairPlay']}
                        selectedTechOption="Widevine"
                        isTechOptionsEnabled={false}
                        isHeadersEnabled={true}
                      />
                      <StreamDetailRow
                        label="DRM certificate URL"
                        techOptions={['Auto', 'Widevine', 'FairPlay']}
                        selectedTechOption="Widevine"
                        isTechOptionsEnabled={false}
                        isHeadersEnabled={false}
                      />
                      <StreamDetailRow
                        label="Subtitles URL"
                        techOptions={['Auto', 'WebVTT', 'TTML', 'SRT']}
                        selectedTechOption="Auto"
                        isTechOptionsEnabled={true}
                        isHeadersEnabled={true}
                      />
                    </Box>
                  </form>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <SectionHeader header="Stream processor" />
                <AccordionPanel ml={2} backgroundColor="White">
                  <Text>TODO</Text>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <SectionHeader header="Player options" />
                <AccordionPanel ml={2} backgroundColor="White">
                  <Text>TODO</Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Flex justify="center" py={4}>
              <Button variantColor="green" mx={1}>
                Play
              </Button>
              <Button mx={1}>Clear</Button>
            </Flex>
          </Stack>
        </Box>
        <Box flex="0.1 1 auto" display="flex" flexDirection="column" maxWidth={['auto', 'auto', 'lg', 'lg']} minWidth={['auto', 'auto', 'sm', 'sm']}>
          <Heading flex="0" textAlign="center" p={4} backgroundColor="gray.300">
            Streamlab
          </Heading>
          <Tabs flex="1 1 auto" display="flex" flexDirection="column" alignContent="stretch" isFitted>
            <TabList flex="0" backgroundColor="white">
              <Tab>Info</Tab>
              <Tab>Stored data</Tab>
              <Tab>Share</Tab>
            </TabList>
            <TabPanels flex="1 1 auto">
              <TabPanel>
                <Alert status="info" alignItems="flex-start">
                  <AlertIcon />
                  Welcome to Streamlab.
                </Alert>
                <Alert status="info" alignItems="flex-start">
                  <AlertIcon />
                  Fill in an URL to the stream you want to test, and press Play.
                </Alert>
              </TabPanel>
              <TabPanel>
                <p>Yeah yeah. What's up?</p>
              </TabPanel>
              <TabPanel>
                <p>Oh, hello there.</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Box>
      </Flex>
      <Box mx={[0, 0, 8, 24]} my={8}>
        <Replay
          options={{
            interactionDetector: {
              inactivityDelay: -1
            }
          }}
        />
      </Box>
    </ColorModeProvider>
  </ThemeProvider>
);

export default App;
