import React from 'react';
import Header, { Level } from '../components/Header';
import { Flex, FormControl, FormLabel, Switch, Image, Button } from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { toggleAdvancedMode, toggleRightPane } from '../store/actions/ui';
import { connect } from 'react-redux';
import StreamlabLogo from '../graphics/streamlab-logo.svg';

type Props = {
  advancedMode: boolean;
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  toggleRightPane: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  isRightPaneExpanded: boolean;
};

const HeaderBar: React.FC<Props> = ({ advancedMode, isRightPaneExpanded, toggleAdvancedMode, toggleRightPane }) => (
  <Flex direction="row" align="center" backgroundColor="gray.200" flex="0 0 auto">
    <Header level={Level.H1} flex="1 1 auto">
      <Image src={StreamlabLogo} alt="Streamlab" width="11rem" opacity={0.7} />
    </Header>
    <FormControl flex="0" p={2} mt={2} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <Switch id="advanced-switch" isChecked={advancedMode} onChange={toggleAdvancedMode}>
        &nbsp;
      </Switch>
      <FormLabel ml={2} htmlFor="advanced-switch">
        Advanced
      </FormLabel>
    </FormControl>
    <Button size="xs" flex="0" ml={4} mt={1} title={`${isRightPaneExpanded ? 'Collapse' : 'Expand'} sidebar`} onClick={toggleRightPane}>{isRightPaneExpanded ? '›' : '‹'}</Button>
  </Flex>
);

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode,
  isRightPaneExpanded: state.ui.isRightPaneExpanded,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => dispatch(toggleAdvancedMode(evt.target.checked)),
  toggleRightPane: (evt: React.MouseEvent<HTMLButtonElement>) => dispatch(toggleRightPane(evt.currentTarget.textContent === '‹' ? true : false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
