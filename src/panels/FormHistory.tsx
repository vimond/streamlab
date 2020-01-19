import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Icon,
  Input,
  List,
  PseudoBox,
  Text,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import { HistoryEntry, SimpleStreamResource } from '../store/model/history';
import {
  deleteHistory,
  deleteHistoryEntry,
  HistoryEntryFilter,
  restoreHistoryEntry,
  selectHistoryEntry,
  updateSelectedHistoryEntryName
} from '../store/actions/history';
import {
  BaseTech,
  drmTechLabels,
  DrmTechnology,
  getLabel,
  LabeledTechOption,
  Resource,
  streamTechLabels,
  StreamTechnology,
  SubtitlesFormat,
  subtitlesFormatLabels
} from '../store/model/streamDetails';
import { AppState } from '../store/reducers';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { UserSelectProperty } from 'csstype';

type Props = {
  selectedEntry?: HistoryEntry;
  history: HistoryEntry[];
  historyListFilter: HistoryEntryFilter;
  handleEntryClick: (entry: HistoryEntry) => void;
  handleRestoreEntryClick: (entry: HistoryEntry) => void;
  handleDeleteEntryClick: (entry: HistoryEntry) => void;
  handleEntryLabelChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteHistory: () => void;
};

type Header = { id: number; name: string; value: string };

const formatDate = (isoDate: string) => isoDate.replace(/T/, ' ').substr(0, 16);

const formatLabel = (entry: HistoryEntry) => {
  if (entry.name) {
    return entry.name;
  } else {
    const { streamResource } = entry.formData.streamDetails;
    const match = streamResource.url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    const hostname = match && match[2];
    const techLabel =
      streamResource.technology === BaseTech.AUTO ? ' S' : `${getLabel(streamResource.technology, streamTechLabels)} s`;
    return `${techLabel}tream on ${hostname || '[unknown host]'}`;
  }
};

const HistoryListItem: React.FC<{ entry: HistoryEntry; isSelected: boolean; handleClick: () => void }> = ({
  entry,
  isSelected,
  handleClick
}) => (
  <PseudoBox
    as="li"
    p={2}
    cursor="pointer"
    backgroundColor={isSelected ? 'gray.200' : undefined}
    _hover={{ backgroundColor: 'gray.100' }}
    style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
    onClick={handleClick}
    title={formatLabel(entry)}
  >
    {formatDate(entry.timestamp)}{' '}
    {entry.error && (
      <Icon name="warning" mx={1} mb={1} title={`This playback attempt failed with an error: ${entry.error.message}`} />
    )}{' '}
    {formatLabel(entry)}
  </PseudoBox>
);

const isResourcePopulated = (resource: Resource<unknown>) => !!(resource.url || resource.headers.length);

const userSelectProp: UserSelectProperty = 'text';

const inputStyle = {
  userSelect: userSelectProp,
  borderRadius: 0,
  backgroundColor: 'white',
  padding: '0.1rem',
  border: 'none',
  height: 'auto',
  lineHeight: 'normal',
  marginBottom: '0.2rem'
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
        <Checkbox isChecked />
      </>
    )}
    {resource.technology !== BaseTech.AUTO && (
      <>
        <FormLabel justifySelf="right">Technology</FormLabel>
        <Input type="text" value={getLabel(resource.technology, techLabels)} isReadOnly style={inputStyle} />
      </>
    )}
    {'headers' in resource && resource.headers.length ? (
      <>
        <FormLabel alignSelf="start" justifySelf="right">
          Headers
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

const FormHistory: React.FC<Props> = ({
  selectedEntry,
  history,
  handleEntryClick,
  handleRestoreEntryClick,
  handleDeleteEntryClick,
  handleEntryLabelChange,
  handleDeleteHistory
}) => {
  const [isOpen, setIsOpen] = React.useState();
  const handleCloseClick = () => setIsOpen(false);
  const handleDeleteHistoryClick = () => {
    handleDeleteHistory();
    handleCloseClick();
  };
  const cancelRef = React.useRef();
  return (
    <Box mx={4}>
      <Box>
        <Header level={Level.H3}>Form history</Header>
        <Text>
          The form data from each playback attempt is registered in the entries below. Duplicates are listed once with
          their last playback time. Select for inspection and restoration:
        </Text>
        <List overflowY="scroll" backgroundColor="white" maxHeight={64} my={2}>
          {history
            .slice(0)
            .reverse()
            .map(entry => (
              <HistoryListItem
                key={entry.timestamp}
                entry={entry}
                handleClick={() => handleEntryClick(entry)}
                isSelected={!!(selectedEntry && entry.timestamp === selectedEntry.timestamp)}
              />
            ))}
        </List>
      </Box>
      {selectedEntry && (
        <Box mt={4} p={2} backgroundColor="gray.200">
          <Grid
            templateColumns={selectedEntry.error ? 'auto auto 1fr' : 'auto 1fr'}
            gap={4}
            alignItems="center"
            title={
              selectedEntry.error
                ? `This playback attempt failed with an error: ${selectedEntry.error.message || selectedEntry.error}`
                : undefined
            }
          >
            {selectedEntry.error && <Icon name="warning" />}
            <Header level={Level.H4}>{formatDate(selectedEntry.timestamp)}</Header>
            <Input
              type="text"
              placeholder="Enter a name for this entry"
              value={selectedEntry.name}
              onChange={handleEntryLabelChange}
            />
          </Grid>
          <Text>
            The details below can be reapplied to the form fields by pressing Restore. Note that fields not included in
            the stored data will be cleared.
          </Text>
          <Grid mt={2} templateColumns="auto 1fr" rowGap={1} columnGap={2} alignItems="center">
            <StreamResourceFields
              label="Stream"
              resource={selectedEntry.formData.streamDetails.streamResource}
              techLabels={streamTechLabels}
            />
            {'drmLicenseResource' in selectedEntry.formData.streamDetails &&
              isResourcePopulated(selectedEntry.formData.streamDetails.drmLicenseResource) && (
                <StreamResourceFields
                  label="DRM license"
                  resource={selectedEntry.formData.streamDetails.drmLicenseResource}
                  techLabels={drmTechLabels}
                />
              )}
            {'drmCertificateResource' in selectedEntry.formData.streamDetails &&
              isResourcePopulated(selectedEntry.formData.streamDetails.drmCertificateResource) && (
                <StreamResourceFields
                  label="DRM certificate"
                  resource={selectedEntry.formData.streamDetails.drmCertificateResource}
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
          </Grid>
          <Flex justify="center" pt={4}>
            <Button m={2} variantColor="blue" onClick={() => handleRestoreEntryClick(selectedEntry)}>
              Restore into forms
            </Button>
            <Button m={2} variantColor="red" onClick={() => handleDeleteEntryClick(selectedEntry)}>
              Delete from history
            </Button>
          </Flex>
        </Box>
      )}
      <Flex justify="center" py={1}>
        <Button m={2} variantColor="red" onClick={() => setIsOpen(true)}>
          Clear history
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
              Are you sure you want to clear all history entries? You cannot undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseClick}>
                Cancel
              </Button>
              <Button variantColor="red" onClick={handleDeleteHistoryClick} ml={3}>
                Clear history
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Flex>
    </Box>
  );
};

const mapStateToProps = ({ history }: AppState) => history;

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleEntryClick: (entry: HistoryEntry) => dispatch(selectHistoryEntry(entry)),
  handleEntryLabelChange: (evt: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateSelectedHistoryEntryName(evt.target.value)),
  handleRestoreEntryClick: (entry: HistoryEntry) => dispatch(restoreHistoryEntry(entry)),
  handleDeleteEntryClick: (entry: HistoryEntry) => dispatch(deleteHistoryEntry(entry)),
  handleDeleteHistory: () => dispatch(deleteHistory())
});

export default connect(mapStateToProps, mapDispatchToProps)(FormHistory);
