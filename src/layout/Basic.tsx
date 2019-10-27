import React from 'react';
import { Box, Button, Flex, FormControl, Input, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { updateStreamDetailsField } from '../store/actions/streamDetails';
import { connect } from 'react-redux';
import { AutoTechnology, BaseTech, Resource, StreamTechnology } from '../store/model/streamDetails';
import { play } from '../store/actions/player';

type StreamTech = AutoTechnology<StreamTechnology>;

const techOptions = [
  {
    key: BaseTech.AUTO,
    label: 'Autodetect stream technology'
  },
  {
    key: StreamTechnology.DASH,
    label: 'MPEG-DASH'
  },
  {
    key: StreamTechnology.HLS,
    label: 'HLS'
  },
  {
    key: StreamTechnology.PROGRESSIVE,
    label: 'Progressive video'
  }
];

const getLabel = (tech: StreamTech) => (techOptions.find(({ key }) => key === tech) || techOptions[0]).label;

type Props = {
  streamResource: Resource<StreamTechnology>;
  handleStreamUrlChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  handleStreamTechnologyChange: (technology: StreamTech) => void;
  handleFormSubmit: (evt: React.FormEvent) => void;
  handlePlay: () => void;
};

const Basic: React.FC<Props> = ({
  streamResource,
  handleStreamUrlChange,
  handleStreamTechnologyChange,
  handleFormSubmit,
  handlePlay
}) => (
  <Box as="form" my={8} onSubmit={handleFormSubmit}>
    <Header level={Level.H3} fontSize="md" textAlign="center">
      Test progressive, HLS, or MPEG-DASH streams
    </Header>
    <FormControl isRequired m={4}>
      <Input placeholder="Stream URL" type="url" value={streamResource.url} onChange={handleStreamUrlChange} />
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
      <Button variantColor="green" mx={4} onClick={handlePlay}>
        Play
      </Button>
    </Flex>
  </Box>
);

const mapStateToProps = (state: AppState) => ({
  streamResource: state.streamDetails.streamResource
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleStreamUrlChange: (evt: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateStreamDetailsField({
        streamResource: { url: evt.target.value }
      })
    ),
  handleStreamTechnologyChange: (technology: StreamTech) =>
    dispatch(
      updateStreamDetailsField({
        streamResource: { technology }
      })
    ),
  // @ts-ignore Typing not supported for thunk actions.
  handlePlay: () => dispatch(play),
  handleFormSubmit: (evt: React.FormEvent) => {
    evt.preventDefault();
    // @ts-ignore
    dispatch(play);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Basic);
