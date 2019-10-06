import React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Heading,
  Stack,
  Text
} from '@chakra-ui/core';
import StreamDetails from './StreamDetails';
import ApiLookup from './ApiLookup';
import StreamProcessor from './StreamProcessor';
import PlayerOptions from './PlayerOptions';

const SectionHeader: React.FC<{ header: string; isRequired?: boolean }> = ({ header, isRequired }) => (
  <AccordionHeader backgroundColor="gray.100">
    <Heading as="h2" size="sm" margin={0} padding={1} flex="1" textAlign="left">
      {header}
      {!isRequired && (
        <Text as="em" fontStyle="normal" color="gray.500" fontWeight="normal" ml="4">
          {' '}
          optional
        </Text>
      )}
    </Heading>
    <AccordionIcon />
  </AccordionHeader>
);

const Advanced: React.FC = () => (
  <Stack>
    <Accordion defaultIndex={[1]} allowMultiple>
      <AccordionItem>
        <SectionHeader header="CMS/API stream lookup" />
        <AccordionPanel ml={2} backgroundColor="White">
          <ApiLookup />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <SectionHeader header="Stream details" isRequired />
        <AccordionPanel ml={2} backgroundColor="White">
          <StreamDetails />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <SectionHeader header="Stream processor" />
        <AccordionPanel ml={2} backgroundColor="White">
          <StreamProcessor />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <SectionHeader header="Player options" />
        <AccordionPanel ml={2} backgroundColor="White">
          <PlayerOptions />
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
);

export default Advanced;
