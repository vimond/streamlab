import React from 'react';
import { Alert, AlertIcon, List, ListItem, Box, Link, Text } from '@chakra-ui/react';
import { AppState } from '../store/reducers';
import { useSelector } from 'react-redux';
import { Message } from '../store/model/messageResolver';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const renderMessage = ({ text, level, link }: Message, i: number) => (
  <ListItem key={i}>
    <Alert status={level} alignItems="flex-start" style={{ overflowX: 'auto' }}>
      <AlertIcon flex="0 0 1rem" />
      {link ? (
        <>
          <Link href={link} isExternal>
            {text}
          </Link>
          <Link alignSelf="center" mx={2} href={link} isExternal>
            <ExternalLinkIcon />
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
    <Box display="flex" flex="1" position="relative">
      <List styleType="none">{messages.map(renderMessage)}</List>
      <Text position="absolute" bottom={3} left={1} right={1} align="center">
        An{' '}
        <Link href="https://github.com/vimond/streamlab/" isExternal textDecoration="underline">
          open source project
        </Link>{' '}
        from{' '}
        <Link href="https://www.vimond.com/vimond-tools" isExternal textDecoration="underline">
          Vimond developers
        </Link>
        .
      </Text>
    </Box>
  );
};

export default Information;
