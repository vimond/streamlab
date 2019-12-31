import { AdvancedAccordionExpansionAction, PaneResizeAction, ToggleAdvancedModeAction } from './ui';
import { SetBrowserFeaturesAction, StreamDetailsFieldChangeAction } from './streamDetails';
import { PlayerAction, PlayerErrorAction } from './player';
import { SetLogLevelAction, SetPlayerConfigurationAction, TogglePlaybackMonitorAction } from './playerOptions';

export type Action =
  | SetBrowserFeaturesAction
  | ToggleAdvancedModeAction
  | PaneResizeAction
  | AdvancedAccordionExpansionAction
  | StreamDetailsFieldChangeAction
  | PlayerAction
  | PlayerErrorAction
  | SetLogLevelAction
  | TogglePlaybackMonitorAction
  | SetPlayerConfigurationAction;
