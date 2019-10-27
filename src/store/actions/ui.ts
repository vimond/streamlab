export const TOGGLE_ADVANCED_MODE = 'TOGGLE_ADVANCED_MODE';

export interface ToggleAdvancedModeAction {
  type: typeof TOGGLE_ADVANCED_MODE;
  value: boolean;
}

export const toggleAdvancedMode = (value: boolean): ToggleAdvancedModeAction => {
  return {
    type: TOGGLE_ADVANCED_MODE,
    value
  };
};
