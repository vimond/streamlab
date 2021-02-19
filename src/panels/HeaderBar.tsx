import React from 'react';
import Header, { Level } from '../components/Header';
import { Flex, FormControl, FormLabel, Switch, Image, Button, Link } from '@chakra-ui/react';
import { AppState } from '../store/reducers';
import { toggleAdvancedMode, toggleRightPane } from '../store/actions/ui';
import { useDispatch, useSelector } from 'react-redux';
import StreamlabLogo from '../graphics/streamlab-logo.svg';
import { updateAddressBar } from '../store/model/sharing';

const HeaderBar: React.FC = () => {
  const advancedMode = useSelector((state: AppState) => state.ui.advancedMode);
  const isRightPaneExpanded = useSelector((state: AppState) => state.ui.isRightPaneExpanded);

  const dispatch = useDispatch();
  const handleAdvancedModeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateAddressBar();
    dispatch(toggleAdvancedMode(evt.target.checked));
  };
  const handleRightPaneClick = (evt: React.MouseEvent<HTMLButtonElement>) =>
    dispatch(toggleRightPane(evt.currentTarget.textContent === '‹' ? true : false));

  return (
    <Flex direction="row" align="center" backgroundColor="gray.200" flex="0 0 auto">
      <Header level={Level.H1} flex="1 1 auto" display="flex" flexDirection="row" alignItems="center">
        <Link href="https://github.com/vimond/streamlab" isExternal>
          <Image src={StreamlabLogo} alt="Streamlab" width="10rem" opacity={0.8} />
        </Link>
      </Header>
      <FormControl flex="0" p={1} mt={1} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        <Switch id="advanced-switch" isChecked={advancedMode} onChange={handleAdvancedModeChange} />
        <FormLabel ml={2} mt={1} fontSize="sm" htmlFor="advanced-switch">
          Advanced
        </FormLabel>
      </FormControl>
      <Button
        width="auto"
        minWidth="auto"
        height="auto"
        flex="0"
        ml={4}
        p={1}
        title={`${isRightPaneExpanded ? 'Collapse' : 'Expand'} sidebar`}
        onClick={handleRightPaneClick}
      >
        {isRightPaneExpanded ? '›' : '‹'}
      </Button>
    </Flex>
  );
};

export default HeaderBar;
