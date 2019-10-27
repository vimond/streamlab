import { PANE_RESIZE, PaneResizeAction, TOGGLE_ADVANCED_MODE, ToggleAdvancedModeAction } from '../actions/ui';

export interface UiState {
  advancedMode: boolean;
  rightPaneWidth?: number;
}

const ui = (state: UiState = { advancedMode: false }, action: ToggleAdvancedModeAction | PaneResizeAction) => {
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
    default:
      return state;
  }
};

export default ui;
