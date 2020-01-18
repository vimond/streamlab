import {
  ADVANCED_ACCORDION_CHANGE,
  AdvancedAccordionExpansionAction,
  PANE_RESIZE,
  PaneResizeAction,
  RIGHT_PANE_TAB_CHANGE,
  RightPaneTabChangeAction,
  TOGGLE_ADVANCED_MODE,
  ToggleAdvancedModeAction
} from '../actions/ui';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../actions/history';

export interface UiState {
  advancedMode: boolean;
  expandedAdvancedAccordionIndices: number[];
  rightPaneWidth?: number;
  rightPaneActiveTabIndex: number;
}

const ui = (
  state: UiState = { advancedMode: false, expandedAdvancedAccordionIndices: [0], rightPaneActiveTabIndex: 0 },
  action:
    | ToggleAdvancedModeAction
    | PaneResizeAction
    | AdvancedAccordionExpansionAction
    | RightPaneTabChangeAction
    | HistoryEntryAction
) => {
  switch (action.type) {
    case TOGGLE_ADVANCED_MODE:
      return {
        ...state,
        advancedMode: action.value
      };
    case RESTORE_HISTORY_ENTRY:
      if ('drmLicenseResource' in action.value.formData.streamDetails) {
        return {
          ...state,
          advancedMode: true
        };
      } else {
        return state;
      }
    case PANE_RESIZE:
      return {
        ...state,
        rightPaneWidth: action.value
      };
    case ADVANCED_ACCORDION_CHANGE:
      return {
        ...state,
        expandedAdvancedAccordionIndices: action.value
      };
    case RIGHT_PANE_TAB_CHANGE:
      return {
        ...state,
        rightPaneActiveTabIndex: action.value
      };
    default:
      return state;
  }
};

export default ui;
