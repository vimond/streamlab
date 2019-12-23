import React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Stack,
  Text
} from '@chakra-ui/core';
import StreamDetails from './StreamDetails';
import PlayerOptions from './PlayerOptions';
import Header, { Level } from '../components/Header';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { playAdvanced } from '../store/actions/player';
import { connect } from 'react-redux';
import { updateAdvancedAccordionExpansions } from '../store/actions/ui';
import { AppState } from '../store/reducers';

const SectionHeader: React.FC<{ header: string; isRequired?: boolean }> = ({ header, isRequired }) => (
  <AccordionHeader backgroundColor="gray.100">
    <Header level={Level.H2} flex="1">
      {header}
      {!isRequired && (
        <Text as="em" fontStyle="normal" color="gray.500" fontWeight="normal" ml="4">
          {' '}
          optional
        </Text>
      )}
    </Header>
    <AccordionIcon />
  </AccordionHeader>
);

const Advanced: React.FC<{
  expandedIndices: number[];
  handlePlay: () => void;
  handleAccordionChange: (indices: number[]) => void;
}> = ({ expandedIndices, handlePlay, handleAccordionChange }) => (
  <Stack>
    {/*
            // @ts-ignore Inconsistently defined change handler type. */}
    <Accordion defaultIndex={expandedIndices} allowMultiple onChange={handleAccordionChange}>
      <AccordionItem>
        <SectionHeader header="Stream details" isRequired />
        <AccordionPanel ml={2} backgroundColor="White">
          <StreamDetails />
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
      <Button variantColor="green" onClick={handlePlay}>
        Play
      </Button>
    </Flex>
  </Stack>
);

const mapStateToProps = (state: AppState) => ({
  expandedIndices: state.ui.expandedAdvancedAccordionIndices
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  // @ts-ignore Typing not supported for thunk actions.
  handlePlay: () => dispatch(playAdvanced),
  handleAccordionChange: (indices: number[]) => dispatch(updateAdvancedAccordionExpansions(indices))
});

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
