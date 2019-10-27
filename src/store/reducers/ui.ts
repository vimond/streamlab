import { TOGGLE_ADVANCED_MODE, ToggleAdvancedModeAction } from '../actions/ui';

export interface UiState {
  advancedMode: boolean;
}

const ui = (state: UiState = { advancedMode: false }, action: ToggleAdvancedModeAction) => {
  switch (action.type) {
    case TOGGLE_ADVANCED_MODE:
      return {
        ...state,
        advancedMode: action.value
      };
    default:
      return state;
  }
};

export default ui;
