import React from 'react';
import { Alert, AlertIcon, List, ListItem } from '@chakra-ui/core';

const Info: React.FC = () => (
  <List styleType="none">
    <ListItem>
      <Alert status="info" alignItems="flex-start">
        <AlertIcon />
        Welcome to Streamlab.
      </Alert>
    </ListItem>
    <ListItem>
      <Alert status="info" alignItems="flex-start">
        <AlertIcon />
        Fill in an URL to the stream you want to test, and press Play.
      </Alert>
    </ListItem>
  </List>
);

export default Info;
