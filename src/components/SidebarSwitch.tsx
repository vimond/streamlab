import React from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

type FullSwitchProps = {
  label: string;
  isChecked?: boolean;
  id?: string;
};

const generateId = () => `switch-${(Math.random() * 100000).toFixed(0)}`;

const SidebarSwitch: React.FC<FullSwitchProps> = ({ label, isChecked, id = generateId() }) => (
  <FormControl flex="0" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
    <Switch id={id} isChecked={isChecked} onChange={() => {}}>
      &nbsp;
    </Switch>
    <FormLabel ml={2} htmlFor={id}>
      {label}
    </FormLabel>
  </FormControl>
);

export default SidebarSwitch;
