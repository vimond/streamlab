export const TOGGLE_ADVANCED_MODE = 'TOGGLE_ADVANCED_MODE';
export const PANE_RESIZE = 'PANE_RESIZE';
export const TOGGLE_RIGHT_PANE = 'TOGGLE_RIGHT_PANE';
export const ADVANCED_ACCORDION_CHANGE = 'ADVANCED_ACCORDION_CHANGE';
export const RIGHT_PANE_TAB_CHANGE = 'RIGHT_PANE_TAB_CHANGE';
export const CLEAR_FORMS = 'CLEAR_FORMS';

export interface ToggleAdvancedModeAction {
  type: typeof TOGGLE_ADVANCED_MODE;
  value: boolean;
}

export interface PaneResizeAction {
  type: typeof PANE_RESIZE;
  value: number;
}

export interface ToggleRightPaneAction {
  type: typeof TOGGLE_RIGHT_PANE;
  value: boolean;
}

export interface AdvancedAccordionExpansionAction {
  type: typeof ADVANCED_ACCORDION_CHANGE;
  value: number[];
}

export interface RightPaneTabChangeAction {
  type: typeof RIGHT_PANE_TAB_CHANGE;
  value: number;
}

export interface ClearFormsAction {
  type: typeof CLEAR_FORMS;
}

export const toggleAdvancedMode = (value: boolean): ToggleAdvancedModeAction => ({
  type: TOGGLE_ADVANCED_MODE,
  value,
});

export const updatePaneSize = (value: number): PaneResizeAction => ({
  type: PANE_RESIZE,
  value,
});

export const toggleRightPane = (value: boolean): ToggleRightPaneAction => ({
  type: TOGGLE_RIGHT_PANE,
  value,
});

export const updateAdvancedAccordionExpansions = (value: number[]): AdvancedAccordionExpansionAction => ({
  type: ADVANCED_ACCORDION_CHANGE,
  value,
});

export const updateActiveRightPaneTab = (value: number): RightPaneTabChangeAction => ({
  type: RIGHT_PANE_TAB_CHANGE,
  value,
});

export const clearForms = (): ClearFormsAction => ({
  type: CLEAR_FORMS,
});
