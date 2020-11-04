import React from 'react';
import { Alert, AlertIcon, List, ListItem, Box, Link, Icon } from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { useSelector } from 'react-redux';
import { Message } from '../store/model/messageResolver';

const renderMessage = ({ text, level, link }: Message, i: number) => (
  <ListItem key={i}>
    <Alert status={level} alignItems="flex-start" style={{ overflowX: 'auto' }}>
      <AlertIcon />
      {link ? (
        <>
          <Link href={link} isExternal>
            {text}
          </Link>
          <Link alignSelf="center" mx={2} href={link} isExternal>
            <Icon name="external-link" />
          </Link>
        </>
      ) : (
        text
      )}
    </Alert>
  </ListItem>
);

const Information: React.FC = () => {
  const messages = useSelector((state: AppState) => state.information.messages);
  return (
    <Box height="100%">
      <List styleType="none">{messages.map(renderMessage)}</List>
    </Box>
  );
};

export default Information;
