import React from 'react';
import { Alert, AlertIcon, List, ListItem } from '@chakra-ui/core';
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

const Information: React.FC<{ messages: Message[] }> = ({ messages }) => (
  <List styleType="none">{messages.map(renderMessage)}</List>
);

const mapStateToProps = (state: AppState) => ({
  messages: state.information.messages,
});

export default connect(mapStateToProps)(Information);
