import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Grid,
  Input,
  List,
  Text,
} from '@chakra-ui/react';
import Header, { Level } from '../components/Header';
import { HistoryEntry, SimpleStreamResource } from '../store/model/history';
import {
  deleteHistory,
  deleteHistoryEntry,
  deleteUnnamedHistoryEntries,
  restoreHistoryEntry,
  selectHistoryEntry,
  updateSelectedHistoryEntryName,
} from '../store/actions/history';
import {
  BaseTech,
  DEFAULT_PLAYER_LOG_LEVEL,
  detectStreamTechnology,
  drmTechLabels,
  DrmTechnology,
  getLabel,
  getLogLevelLabel,
  LabeledTechOption,
  playerLibraries,
  Resource,
  streamTechLabels,
  StreamTechnology,
  SubtitlesFormat,
  subtitlesFormatLabels,
} from '../store/model/streamDetails';
import { AppState } from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Property } from 'csstype';
import { updateAddressBar } from '../store/model/sharing';

type Header = { id: number; name: string; value: string };

const formatDate = (isoDate: string) => isoDate.replace(/T/, ' ').substr(0, 16);

const getStreamTechLabel = ({ url, technology }: Resource<StreamTechnology> | SimpleStreamResource) => {
  return getLabel(technology === BaseTech.AUTO ? detectStreamTechnology(url) : technology, streamTechLabels);
};

const formatLabel = (entry: HistoryEntry) => {
  if (entry.name) {
    return entry.name;
  } else {
    const { streamResource } = entry.formData.streamDetails;
    const match = streamResource.url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    const hostname = match && match[2];
    const techLabel = getStreamTechLabel(streamResource);
    const stream = techLabel.indexOf('stream') < 0 ? ' stream' : '';
    return `${techLabel}${stream} on ${hostname || '[unknown host]'}`;
  }
};

const HistoryListItem: React.FC<{ entry: HistoryEntry; isSelected: boolean; handleClick: () => void }> = ({
  entry,
  isSelected,
  handleClick,
}) => (
  <Box
    as="li"
    p={2}
    cursor="pointer"
    backgroundColor={isSelected ? 'gray.200' : undefined}
    _hover={{ backgroundColor: 'gray.100' }}
    style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
    color={entry.name ? undefined : 'gray.500'}
    onClick={handleClick}
    title={formatDate(entry.timestamp) + ' ' + formatLabel(entry)}
  >
    {entry.error && (
      <Badge colorScheme="red" mt="-0.2em" title={`This playback attempt failed with an error: ${entry.error.message}`}>
        Err
      </Badge>
    )}{' '}
    {formatLabel(entry) + (entry.name ? '' : ', ' + formatDate(entry.timestamp))}
  </Box>
);

const isResourcePopulated = (resource: Resource<unknown>) => !!(resource.url || resource.headers.length);

const userSelectProp: Property.UserSelect = 'text';

const inputStyle = {
  userSelect: userSelectProp,
  backgroundColor: '#F7FAFC',
  padding: '0.2rem',
  border: 'none',
  height: 'auto',
  marginBottom: '0.2rem',
};

const renderHeaderRow = ({ id, name, value }: Header) => (
  <React.Fragment key={id}>
    <Input type="text" value={name} isReadOnly style={inputStyle} />
    <Input type="text" value={value} isReadOnly style={inputStyle} />
  </React.Fragment>
);

const StreamResourceFields: React.FC<{
  label: string;
  resource: Resource<StreamTechnology | DrmTechnology | SubtitlesFormat> | SimpleStreamResource;
  techLabels: LabeledTechOption[];
}> = ({ label, resource, techLabels }) => (
  <>
    <FormLabel justifySelf="right">{label} URL</FormLabel>
    <Input type="url" value={resource.url} isReadOnly style={inputStyle} />
    {'useProxy' in resource && resource.useProxy && (
      <>
        <FormLabel justifySelf="right">Use proxy</FormLabel>
        <Checkbox isChecked isReadOnly />
      </>
    )}
    {resource.technology !== BaseTech.AUTO && (
      <>
        <FormLabel justifySelf="right">{label} technology</FormLabel>
        <Input type="text" value={getLabel(resource.technology, techLabels)} isReadOnly style={inputStyle} />
      </>
    )}
    {'headers' in resource && resource.headers.some(({ name, value }) => name || value) ? (
      <>
        <FormLabel alignSelf="start" justifySelf="right">
          {label} headers
        </FormLabel>
        <Grid templateColumns="1fr 3fr" gap={2} alignItems="center">
          {resource.headers.map(renderHeaderRow)}
        </Grid>
      </>
    ) : (
      ''
    )}
  </>
);

const FormHistory: React.FC = () => {
  const dispatch = useDispatch();
  const history = useSelector((state: AppState) => state.history.history);
  const selectedEntry = useSelector((state: AppState) => state.history.selectedEntry);

  const [isFullClearOpen, setIsFullClearOpen] = React.useState<boolean>(false);
  const [isClearUnnamedOpen, setIsClearUnnamedOpen] = React.useState<boolean>(false);

  const handleCloseClick = () => {
    setIsFullClearOpen(false);
    setIsClearUnnamedOpen(false);
  };
  const handleDeleteHistoryClick = () => {
    handleDeleteHistory();
    handleCloseClick();
  };
  const handleDeleteUnnamedClick = () => {
    handleDeleteUnnamed();
    handleCloseClick();
  };
  const handleDeleteEntryClick = (entry: HistoryEntry) => dispatch(deleteHistoryEntry(entry));
  const handleDeleteHistory = () => dispatch(deleteHistory());
  const handleDeleteUnnamed = () => dispatch(deleteUnnamedHistoryEntries());

  const handleEntryClick = (entry: HistoryEntry) => dispatch(selectHistoryEntry(entry));
  const handleEntryLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateSelectedHistoryEntryName(evt.target.value));
  const handleRestoreEntryClick = (entry: HistoryEntry) => {
    updateAddressBar();
    return dispatch(restoreHistoryEntry(entry));
  };

  const cancelFullDeleteRef = React.useRef<HTMLButtonElement>(null);
  const cancelUnnamedDeleteRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Box mx={4}>
      <Box>
        <Header level={Level.H4}>Form history</Header>
        <Text>
          The form data from each playback attempt is registered in the entries below. Duplicates are listed once with
          their last playback time. Select for inspection and restoration back into the forms:
        </Text>
        {!!history.length && (
          <List
            overflowY="scroll"
            backgroundColor="white"
            minHeight={32}
            maxHeight={64}
            my={2}
            borderWidth="1px"
            rounded="md"
            borderColor="gray.400"
          >
            {history
              .slice(0)
              .reverse()
              .map((entry) => (
                <HistoryListItem
                  key={entry.timestamp}
                  entry={entry}
                  handleClick={() => handleEntryClick(entry)}
                  isSelected={!!(selectedEntry && entry.timestamp === selectedEntry.timestamp)}
                />
              ))}
          </List>
        )}
      </Box>
      {selectedEntry && (
        <Box mt={4} p={2} backgroundColor="gray.200" rounded="md" aria-label="Form history entry">
          <Grid
            templateColumns={selectedEntry.error ? 'auto auto 1fr' : 'auto 1fr'}
            gap={4}
            alignItems="center"
            title={
              selectedEntry.error
                ? `Unsuccessful playback attempt: ${
                    selectedEntry.error.message || selectedEntry.error.code || selectedEntry.error
                  }`
                : undefined
            }
          >
            {selectedEntry.error && (
              <Badge
                colorScheme="red"
                mt="-0.2em"
                title={`This playback attempt failed with an error: ${selectedEntry.error.message}`}
              >
                Err
              </Badge>
            )}
            <Header level={Level.H4}>{formatDate(selectedEntry.timestamp)}</Header>
            <Input
              type="text"
              placeholder="Enter a name for this entry"
              value={selectedEntry.name}
              onChange={handleEntryLabelChange}
              backgroundColor="White"
            />
          </Grid>
          <Text>
            The details below can be reapplied to the form fields by pressing Restore. Note that fields not included in
            the stored data will be cleared.
          </Text>
          <Grid mt={2} templateColumns="auto 1fr" rowGap={1} columnGap={0} alignItems="center">
            <StreamResourceFields
              label="Stream"
              resource={selectedEntry.formData.streamDetails.streamResource}
              techLabels={streamTechLabels}
            />
            {'drmLicenseResource' in selectedEntry.formData.streamDetails &&
              isResourcePopulated(selectedEntry.formData.streamDetails.drmLicenseResource) && (
                <StreamResourceFields
                  label="DRM license"
                  resource={{ ...selectedEntry.formData.streamDetails.drmLicenseResource, technology: BaseTech.AUTO }}
                  techLabels={drmTechLabels}
                />
              )}
            {'drmCertificateResource' in selectedEntry.formData.streamDetails &&
              isResourcePopulated(selectedEntry.formData.streamDetails.drmCertificateResource) && (
                <StreamResourceFields
                  label="DRM certificate"
                  resource={{
                    ...selectedEntry.formData.streamDetails.drmCertificateResource,
                    technology: BaseTech.AUTO,
                  }}
                  techLabels={drmTechLabels}
                />
              )}
            {'subtitlesResource' in selectedEntry.formData.streamDetails &&
              isResourcePopulated(selectedEntry.formData.streamDetails.subtitlesResource) && (
                <StreamResourceFields
                  label="Subtitles"
                  resource={selectedEntry.formData.streamDetails.subtitlesResource}
                  techLabels={subtitlesFormatLabels}
                />
              )}
            {'playerOptions' in selectedEntry.formData &&
              selectedEntry.formData.playerOptions &&
              selectedEntry.formData.playerOptions.showPlaybackMonitor && (
                <>
                  <FormLabel justifySelf="right">Show playback monitor</FormLabel>
                  <Checkbox isChecked isReadOnly />
                </>
              )}
            {'playerOptions' in selectedEntry.formData &&
              selectedEntry.formData.playerOptions &&
              selectedEntry.formData.playerOptions.playerLibrary !== 'AUTO' && (
                <>
                  <FormLabel justifySelf="right">Player library</FormLabel>
                  <Input
                    type="text"
                    value={playerLibraries[selectedEntry.formData.playerOptions.playerLibrary]}
                    isReadOnly
                    style={inputStyle}
                  />
                </>
              )}
            {'playerOptions' in selectedEntry.formData &&
              selectedEntry.formData.playerOptions &&
              selectedEntry.formData.playerOptions.logLevel !== DEFAULT_PLAYER_LOG_LEVEL && (
                <>
                  <FormLabel justifySelf="right">Player log level</FormLabel>
                  <Input
                    type="text"
                    value={getLogLevelLabel(selectedEntry.formData.playerOptions.logLevel)}
                    isReadOnly
                    style={inputStyle}
                  />
                </>
              )}
            {'playerOptions' in selectedEntry.formData &&
              selectedEntry.formData.playerOptions &&
              selectedEntry.formData.playerOptions.customConfiguration &&
              selectedEntry.formData.playerOptions.customConfiguration.trim() && (
                <>
                  <FormLabel justifySelf="right">Custom configuration</FormLabel>
                  <Input
                    type="text"
                    value={selectedEntry.formData.playerOptions.customConfiguration.trim()}
                    isReadOnly
                    style={inputStyle}
                  />
                </>
              )}
          </Grid>
          <Flex justify="center" pt={4}>
            <Button m={2} colorScheme="blue" onClick={() => handleRestoreEntryClick(selectedEntry)}>
              Restore into forms
            </Button>
            <Button m={2} colorScheme="red" onClick={() => handleDeleteEntryClick(selectedEntry)}>
              Delete from history
            </Button>
          </Flex>
        </Box>
      )}
      {!!history.length && (
        <Flex justify="center" py={1}>
          <Button m={2} colorScheme="red" variant="outline" onClick={() => setIsClearUnnamedOpen(true)}>
            Clear unnamed entries
          </Button>
          <Button m={2} colorScheme="red" variant="outline" onClick={() => setIsFullClearOpen(true)}>
            Clear history
          </Button>
          <AlertDialog
            isOpen={isClearUnnamedOpen}
            leastDestructiveRef={cancelUnnamedDeleteRef}
            onClose={handleCloseClick}
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Clear unnamed entries
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text>
                  Are you sure you want to clear all history entries you haven't given a name? You cannot undo this
                  action afterwards.{' '}
                </Text>
                <Text mt={2}>
                  If you want to keep some entries, give them a name before proceeding with this operation.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelUnnamedDeleteRef} onClick={handleCloseClick}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteUnnamedClick} ml={3}>
                  Clear history entries with no name
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog isOpen={isFullClearOpen} leastDestructiveRef={cancelFullDeleteRef} onClose={handleCloseClick}>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Clear forms
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to clear all history entries? You cannot undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelFullDeleteRef} onClick={handleCloseClick}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteHistoryClick} ml={3}>
                  Clear history completely
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Flex>
      )}
    </Box>
  );
};

export default FormHistory;
