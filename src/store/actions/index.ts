import { AdvancedAccordionExpansionAction, ClearFormsAction, PaneResizeAction, ToggleAdvancedModeAction, ToggleRightPaneAction } from './ui';
import { SetBrowserFeaturesAction, StreamDetailsFieldChangeAction } from './streamDetails';
import { PlayerAction, PlayerErrorAction } from './player';
import { SetLogLevelAction, SetPlayerConfigurationAction, TogglePlaybackMonitorAction } from './playerOptions';
import {
  DeleteHistoryAction,
  HistoryEntryAction,
  SetHistoryFilterAction,
  UpdateSelectedHistoryEntryNameAction,
} from './history';

export type Action =
  | SetBrowserFeaturesAction
  | ToggleAdvancedModeAction
  | PaneResizeAction
  | ToggleRightPaneAction
  | AdvancedAccordionExpansionAction
  | ClearFormsAction
  | StreamDetailsFieldChangeAction
  | PlayerAction
  | PlayerErrorAction
  | SetLogLevelAction
  | TogglePlaybackMonitorAction
  | SetPlayerConfigurationAction
  | HistoryEntryAction
  | UpdateSelectedHistoryEntryNameAction
  | DeleteHistoryAction
  | SetHistoryFilterAction;
