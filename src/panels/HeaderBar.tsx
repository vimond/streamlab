import React from 'react';
import Header, { Level } from '../components/Header';
import { Flex, FormControl, FormLabel, Switch, Image, Button, Link } from '@chakra-ui/core';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { toggleAdvancedMode, toggleRightPane } from '../store/actions/ui';
import { connect } from 'react-redux';
import StreamlabLogo from '../graphics/streamlab-logo.svg';
import { updateAddressBar } from '../store/model/sharing';

type Props = {
  advancedMode: boolean;
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  toggleRightPane: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  isRightPaneExpanded: boolean;
};

const HeaderBar: React.FC<Props> = ({ advancedMode, isRightPaneExpanded, toggleAdvancedMode, toggleRightPane }) => (
  <Flex direction="row" align="center" backgroundColor="gray.200" flex="0 0 auto">
    <Header level={Level.H1} flex="1 1 auto" display="flex" flexDirection="row" alignItems="center">
      <Link href="https://github.com/vimond/streamlab" isExternal>
        <Image src={StreamlabLogo} alt="Streamlab" width="10rem" opacity={0.8} />
      </Link>
    </Header>
    <FormControl flex="0" p={2} mt={1} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <Switch id="advanced-switch" isChecked={advancedMode} onChange={toggleAdvancedMode}>
        &nbsp;
      </Switch>
      <FormLabel ml={2} fontSize="sm" htmlFor="advanced-switch">
        Advanced
      </FormLabel>
    </FormControl>
    <Button
      size="xs"
      flex="0"
      ml={4}
      title={`${isRightPaneExpanded ? 'Collapse' : 'Expand'} sidebar`}
      onClick={toggleRightPane}
    >
      {isRightPaneExpanded ? '›' : '‹'}
    </Button>
  </Flex>
);

const mapStateToProps = (state: AppState) => ({
  advancedMode: state.ui.advancedMode,
  isRightPaneExpanded: state.ui.isRightPaneExpanded,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleAdvancedMode: (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateAddressBar();
    return dispatch(toggleAdvancedMode(evt.target.checked));
  },
  toggleRightPane: (evt: React.MouseEvent<HTMLButtonElement>) =>
    dispatch(toggleRightPane(evt.currentTarget.textContent === '‹' ? true : false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
