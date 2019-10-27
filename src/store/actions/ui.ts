export const TOGGLE_ADVANCED_MODE = 'TOGGLE_ADVANCED_MODE';
export const PANE_RESIZE = 'PANE_RESIZE';

export interface ToggleAdvancedModeAction {
  type: typeof TOGGLE_ADVANCED_MODE;
  value: boolean;
}

export interface PaneResizeAction {
  type: typeof PANE_RESIZE;
  value: number;
}

export const toggleAdvancedMode = (value: boolean): ToggleAdvancedModeAction => {
  return {
    type: TOGGLE_ADVANCED_MODE,
    value
  };
};

export const handlePaneResize = (value: number): PaneResizeAction => {
  return {
    type: PANE_RESIZE,
    value
  };
};
