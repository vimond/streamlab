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

export interface UiState {
  advancedMode: boolean;
  expandedAdvancedAccordionIndices: number[];
  rightPaneWidth?: number;
  rightPaneActiveTabIndex: number;
}

const ui = (
  state: UiState = { advancedMode: false, expandedAdvancedAccordionIndices: [0], rightPaneActiveTabIndex: 0 },
  action: ToggleAdvancedModeAction | PaneResizeAction | AdvancedAccordionExpansionAction | RightPaneTabChangeAction
) => {
  switch (action.type) {
    case TOGGLE_ADVANCED_MODE:
      return {
        ...state,
        advancedMode: action.value
      };
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
