import React from 'react';
import { Box, Button, Flex, FormControl, Input, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import { AppState } from '../store/reducers';
import { updateStreamDetailsField } from '../store/actions/streamDetails';
import { useDispatch, useSelector } from 'react-redux';
import { AutoTechnology, BaseTech, StreamTechnology } from '../store/model/streamDetails';
import { playBasic } from '../store/actions/player';
import { updateAddressBar } from '../store/model/sharing';

type StreamTech = AutoTechnology<StreamTechnology>;

const techOptions = [
  {
    key: BaseTech.AUTO,
    label: 'Autodetect stream technology',
  },
  {
    key: StreamTechnology.DASH,
    label: 'MPEG-DASH',
  },
  {
    key: StreamTechnology.HLS,
    label: 'HLS',
  },
  {
    key: StreamTechnology.PROGRESSIVE,
    label: 'Progressive video',
  },
];

const getLabel = (tech: StreamTech) => (techOptions.find(({ key }) => key === tech) || techOptions[0]).label;

const Basic: React.FC = () => {
  const streamResource = useSelector((state: AppState) => state.streamDetails.streamResource);
  const dispatch = useDispatch();

  const handleStreamUrlChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateAddressBar();
    dispatch(
      updateStreamDetailsField({
        streamResource: { url: evt.target.value },
      })
    );
  };
  const handleStreamTechnologyChange = (technology: StreamTech) => {
    updateAddressBar();
    dispatch(
      updateStreamDetailsField({
        streamResource: { technology },
      })
    );
  };
  const handlePlay = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.blur(); // Otherwise Replay's Ctrl+Alt+M short cut will be captured as a click on this button.
    return dispatch(playBasic);
  };
  const handleFormSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    dispatch(playBasic);
  };

  return (
    <Box as="form" my={8} onSubmit={handleFormSubmit}>
      <Header level={Level.H3} fontSize="md" textAlign="center">
        Test progressive, HLS, MPEG-DASH, or smooth streams:
      </Header>
      <FormControl isRequired m={4}>
        <Input
          placeholder="Stream URL"
          type="url"
          textAlign="center"
          value={streamResource.url}
          onChange={handleStreamUrlChange}
        />
      </FormControl>
      <Flex justify="center" mx={4}>
        <Menu>
          {/*
              // @ts-ignore */}
          <MenuButton as={Button} rightIcon="chevron-down" flex="0 0 none" ml={2}>
            {getLabel(streamResource.technology)}
          </MenuButton>
          <MenuList>
            {techOptions.map(({ key, label }) => (
              <MenuItem key={key} onClick={() => handleStreamTechnologyChange(key)}>
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Button variantColor="green" mx={4} onClick={handlePlay} isDisabled={!streamResource.url}>
          Play
        </Button>
      </Flex>
    </Box>
  );
};

export default Basic;
