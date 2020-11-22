import React from 'react';
import { Alert, AlertIcon, List, ListItem, Box, Link } from '@chakra-ui/react';
import { AppState } from '../store/reducers';
import { useSelector } from 'react-redux';
import { Message } from '../store/model/messageResolver';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const renderMessage = ({ text, level, link }: Message, i: number) => (
  <ListItem key={i} overflowWrap="break-word" wordBreak="break-all">
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
    <Box height="100%">
      <List styleType="none">{messages.map(renderMessage)}</List>
    </Box>
  );
};

export default Information;
