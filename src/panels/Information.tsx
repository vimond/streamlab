import React from 'react';
import { Alert, AlertIcon, List, ListItem, Box, Badge } from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { connect } from 'react-redux';
import { Message } from '../store/model/messageResolver';

const renderMessage = ({ text, level }: Message, i: number) => (
  <ListItem key={i}>
    <Alert status={level} alignItems="flex-start" style={{ overflowX: 'auto' }}>
      <AlertIcon />
      {text}
    </Alert>
  </ListItem>
);

const Information: React.FC<{ messages: Message[], isRightPaneExpanded: boolean }> = ({ messages, isRightPaneExpanded }) => (
  <Box height="100%">
    <List styleType="none">{messages.map(renderMessage)}</List>
    {isRightPaneExpanded && <Badge position="absolute" bottom={2} right={2}>v{process.env.REACT_APP_VERSION}</Badge>}
  </Box>
);

const mapStateToProps = (state: AppState) => ({
  messages: state.information.messages,
  isRightPaneExpanded: state.ui.isRightPaneExpanded,
});

export default connect(mapStateToProps)(Information);
