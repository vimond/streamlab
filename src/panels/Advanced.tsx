import React from 'react';
import {
  Accordion,
  AccordionButton,
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
} from '@chakra-ui/react';
import StreamDetails from './StreamDetails';
import PlayerOptions from './PlayerOptions';
import Header, { Level } from '../components/Header';
import { playAdvanced, stop } from '../store/actions/player';
import { useDispatch, useSelector } from 'react-redux';
import { clearForms, updateAdvancedAccordionExpansions } from '../store/actions/ui';
import { AppState } from '../store/reducers';
import { updateAddressBar } from '../store/model/sharing';

const SectionHeader: React.FC<{ header: string; isRequired?: boolean }> = ({ header, isRequired }) => (
  <AccordionButton backgroundColor="gray.100">
    <Header level={Level.H2} flex="1" lineHeight={1}>
      {header}
      {!isRequired && (
        <Text as="em" fontStyle="normal" color="gray.500" fontWeight="normal" ml="4">
          {' '}
          optional
        </Text>
      )}
    </Header>
    <AccordionIcon />
  </AccordionButton>
);

const Advanced: React.FC = () => {
  const expandedIndices = useSelector((state: AppState) => state.ui.expandedAdvancedAccordionIndices);
  const isPlaying = useSelector((state: AppState) => !!state.player.source);
  const isPlayable = useSelector((state: AppState) => !!state.streamDetails.streamResource.url);
  const isPlayerOptionsModified = useSelector((state: AppState) => !!state.playerOptions.isModified);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const handleCloseClick = () => setIsOpen(false);
  const handleClearClick = () => {
    setIsOpen(false);
    updateAddressBar();
    dispatch(clearForms());
  };
  const handlePlay = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.blur(); // Otherwise Replay's Ctrl+Alt+M short cut will be captured as a click on this button.
    dispatch(playAdvanced);
  };
  const handleStop = () => dispatch(stop);
  const handleAccordionChange = (indices: number[]) => dispatch(updateAdvancedAccordionExpansions(indices));

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Stack>
      {/*
              // @ts-ignore Inconsistently defined change handler type. */}
      <Accordion defaultIndex={expandedIndices} allowMultiple onChange={handleAccordionChange}>
        <AccordionItem>
          <SectionHeader header="Stream details" isRequired />
          <AccordionPanel ml={2} mt={1} backgroundColor="White">
            <StreamDetails />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <SectionHeader header={`Player options${isPlayerOptionsModified ? ' *' : ''}`} />
          <AccordionPanel ml={2} mt={1} backgroundColor="White">
            <PlayerOptions />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex justify="center" py={4}>
        <Button colorScheme="green" onClick={handlePlay} mx={4} isDisabled={!isPlayable}>
          Play
        </Button>
        <Button colorScheme="red" onClick={handleStop} isDisabled={!isPlaying}>
          Stop
        </Button>
        <Button colorScheme="red" variant="outline" onClick={() => setIsOpen(true)} mx={4}>
          Clear all forms
        </Button>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={handleCloseClick}>
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
              <Button colorScheme="red" onClick={handleClearClick} ml={3}>
                Clear forms
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Flex>
    </Stack>
  );
};

export default Advanced;
