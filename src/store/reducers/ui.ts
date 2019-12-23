import {
  ADVANCED_ACCORDION_CHANGE,
  AdvancedAccordionExpansionAction,
  PANE_RESIZE,
  PaneResizeAction,
  TOGGLE_ADVANCED_MODE,
  ToggleAdvancedModeAction
} from '../actions/ui';

export interface UiState {
  advancedMode: boolean;
  expandedAdvancedAccordionIndices: number[];
  rightPaneWidth?: number;
}

const ui = (
  state: UiState = { advancedMode: false, expandedAdvancedAccordionIndices: [0] },
  action: ToggleAdvancedModeAction | PaneResizeAction | AdvancedAccordionExpansionAction
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
    default:
      return state;
  }
};

export default ui;
