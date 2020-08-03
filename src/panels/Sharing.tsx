import React from 'react';
import { Box, Text, FormHelperText } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import { AppState } from '../store/reducers';
import { PersistibleFormData } from '../store/model/history';
import { buildUrlFromState } from '../store/model/sharing';
import { connect } from 'react-redux';

type Props = {
  shareState: PersistibleFormData;
};

const extractPersistibleFormData = (state: AppState): PersistibleFormData => {
  if (state.ui.advancedMode) {
    const { supportedDrmTypes, ...streamDetails } = state.streamDetails;
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
};

const Sharing: React.FC<Props> = ({ shareState }) => (
  <Box mx={4}>
    <Header level={Level.H3}>Share your stream setup</Header>
    <Text userSelect="none" mb={2}>
      This Streamlab page, with the {'playerOptions' in shareState ? 'stream details and player options' : 'stream specified'} to the left pre-filled and ready to be played, can be shared through
      the following link:
    </Text>
    <Text backgroundColor="white" borderRadius="md" cursor="text" p={2} wordBreak="break-all">
      {buildUrlFromState(shareState, document.location)}
    </Text>
    <FormHelperText userSelect="none">
      You are capable of selecting and copy this URL without any helper buttons, aren't you?
    </FormHelperText>
  </Box>
);

const mapStateToProps = (state: AppState) => ({
  shareState: extractPersistibleFormData(state),
});

export default connect(mapStateToProps)(Sharing);
