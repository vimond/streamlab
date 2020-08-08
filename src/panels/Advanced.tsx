import React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/core';
import StreamDetails from './StreamDetails';
import PlayerOptions from './PlayerOptions';
import Header, { Level } from '../components/Header';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { playAdvanced, stop } from '../store/actions/player';
import { connect } from 'react-redux';
import { clearForms, updateAdvancedAccordionExpansions } from '../store/actions/ui';
import { AppState } from '../store/reducers';
import { updateAddressBar } from '../store/model/sharing';

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
  isPlayerOptionsModified: boolean;
  isPlaying: boolean;
  isPlayable: boolean;
  handlePlay: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  handleStop: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  handleClear: () => void;
  handleAccordionChange: (indices: number[]) => void;
}> = ({
  expandedIndices,
  isPlayerOptionsModified,
  isPlaying,
  isPlayable,
  handlePlay,
  handleStop,
  handleClear,
  handleAccordionChange,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>();
  const handleCloseClick = () => setIsOpen(false);
  const handleClearClick = () => {
    handleClear();
    handleCloseClick();
  };
  const cancelRef = React.useRef();
  return (
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
          <SectionHeader header={`Player options${isPlayerOptionsModified ? ' *' : ''}`} />
          <AccordionPanel ml={2} backgroundColor="White">
            <PlayerOptions />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex justify="center" py={4}>
        <Button variantColor="green" onClick={handlePlay} mx={4} isDisabled={!isPlayable}>
          Play
        </Button>
        <Button variantColor="red" onClick={handleStop} isDisabled={!isPlaying}>
          Stop
        </Button>
        <Button variantColor="red" variant="outline" onClick={() => setIsOpen(true)} mx={4}>
          Clear all forms
        </Button>
        {/*
              // @ts-ignore Chakra type inconsistency. */}
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={handleCloseClick}>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear forms
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to empty all form fields? You cannot undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseClick}>
                Cancel
              </Button>
              <Button variantColor="red" onClick={handleClearClick} ml={3}>
                Clear forms
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Flex>
    </Stack>
  );
};

const mapStateToProps = (state: AppState) => ({
  expandedIndices: state.ui.expandedAdvancedAccordionIndices,
  isPlaying: !!state.player.source,
  isPlayable: !!state.streamDetails.streamResource.url,
  isPlayerOptionsModified: state.playerOptions.isModified,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handlePlay: (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.blur(); // Otherwise Replay's Ctrl+Alt+M short cut will be captured as a click on this button.
    // @ts-ignore Typing not supported for thunk actions.
    return dispatch(playAdvanced);
  },
  handleAccordionChange: (indices: number[]) => dispatch(updateAdvancedAccordionExpansions(indices)),
  handleClear: () => {
    updateAddressBar();
    // @ts-ignore
    return dispatch(clearForms());
  },
  // @ts-ignore
  handleStop: () => dispatch(stop),
});

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
