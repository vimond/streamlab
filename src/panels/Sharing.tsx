import React from 'react';
import { Box, Text, Button, useClipboard } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import { AppState } from '../store/reducers';
import { PersistibleFormData } from '../store/model/history';
import { buildUrlFromState } from '../store/model/sharing';
import { useSelector } from 'react-redux';

// TODO: Make this a flag being part of the Redux state, comparing with initialState.
// Also separate the form data from this other props in state slices, in order to avoid excluding props to be serialised.
const hasContent = ({ streamDetails, playerOptions, ui }: AppState) => {
  if (ui.advancedMode) {
    return (
      playerOptions.isModified ||
      [
        streamDetails.streamResource,
        streamDetails.drmLicenseResource,
        streamDetails.drmCertificateResource,
        streamDetails.subtitlesResource,
      ].some((resource) => resource.url || resource.headers.some((h) => h.name || h.value) || resource.useProxy)
    );
  } else {
    return !!streamDetails.streamResource.url;
  }
};

const extractPersistibleFormData = (state: AppState): PersistibleFormData | undefined => {
  if (hasContent(state)) {
    if (state.ui.advancedMode) {
      const { supportedDrmTechnologies, ...streamDetails } = state.streamDetails;
      const { isModified, ...playerOptions } = state.playerOptions;
      return {
        streamDetails,
        playerOptions,
      };
    } else {
      const { headers, useProxy, ...streamResource } = state.streamDetails.streamResource;
      return {
        streamDetails: {
          streamResource,
        },
      };
    }
  }
};

const Sharing: React.FC = () => {
  const shareState = useSelector((state: AppState) => extractPersistibleFormData(state));
  const link = shareState ? buildUrlFromState(shareState, document.location) : '';
  const { onCopy, hasCopied } = useClipboard(link);
  if (shareState) {
    return (
      <Box mx={4}>
        <Header level={Level.H4}>Share your stream setup</Header>
        <Text userSelect="none" mb={2}>
          This Streamlab page, with the{' '}
          {'playerOptions' in shareState ? 'stream details and player options' : 'stream specified'} to the left
          pre-filled and ready to be played, can be shared through the following link:
        </Text>
        <Text backgroundColor="white" borderRadius="md" cursor="text" p={2} wordBreak="break-all">
          {link}
        </Text>
        <Button
          variantColor="blue"
          my={4}
          mx="auto"
          display="block"
          leftIcon={hasCopied ? 'check' : 'copy'}
          onClick={onCopy}
        >
          Copy to clipboard
        </Button>
      </Box>
    );
  } else {
    return (
      <Box mx={4}>
        <Header level={Level.H4}>Share your stream setup</Header>
        <Text userSelect="none" mb={2}>
          When you have filled in stream details and/or set some player options, you can share this page with the full
          setup in a link appearing here.
        </Text>
      </Box>
    );
  }
};

export default Sharing;
