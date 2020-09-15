import {
  AdvancedAccordionExpansionAction,
  ClearFormsAction,
  PaneResizeAction,
  ToggleAdvancedModeAction,
  ToggleRightPaneAction,
} from './ui';
import { ApplyBrowserEnvironmentAction, StreamDetailsFieldChangeAction } from './streamDetails';
import { PlayerAction, PlayerErrorAction } from './player';
import { SetLogLevelAction, SetPlayerConfigurationAction, TogglePlaybackMonitorAction } from './playerOptions';
import {
  DeleteHistoryAction,
  HistoryEntryAction,
  SetHistoryFilterAction,
  UpdateSelectedHistoryEntryNameAction,
} from './history';

export type Action =
  | ApplyBrowserEnvironmentAction
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
