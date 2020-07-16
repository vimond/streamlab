import React from 'react';
import Header, { Level } from '../components/Header';
import { Flex, FormControl, FormLabel, Switch } from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { toggleAdvancedMode } from '../store/actions/ui';
import { connect } from 'react-redux';

type Props = {
  advancedMode: boolean;
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const HeaderBar: React.FC<Props> = ({ advancedMode, toggleAdvancedMode }) => (
  <Flex direction="row" align="center" backgroundColor="gray.200" flex="0 0 auto">
    <Header level={Level.H1} flex="1 1 auto">
      Streamlab
    </Header>
    <FormControl flex="0" p={2} mt={2} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <Switch id="advanced-switch" isChecked={advancedMode} onChange={toggleAdvancedMode}>
        &nbsp;
      </Switch>
      <FormLabel ml={2} htmlFor="advanced-switch">
        Advanced
      </FormLabel>
    </FormControl>
  </Flex>
);

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => dispatch(toggleAdvancedMode(evt.target.checked)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
