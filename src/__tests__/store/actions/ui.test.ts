import {
  toggleAdvancedMode,
  updatePaneSize,
  updateAdvancedAccordionExpansions,
  updateActiveRightPaneTab,
  TOGGLE_ADVANCED_MODE,
  PANE_RESIZE,
  ADVANCED_ACCORDION_CHANGE,
  RIGHT_PANE_TAB_CHANGE,
  clearForms,
  CLEAR_FORMS,
  toggleRightPane,
  TOGGLE_RIGHT_PANE,
} from '../../../store/actions/ui';

describe('UI Redux actions', () => {
  test('Toggle advanced mode', () => {
    expect(toggleAdvancedMode(true)).toEqual({ type: TOGGLE_ADVANCED_MODE, value: true });
  });
  test('Pane resizing', () => {
    expect(updatePaneSize(313)).toEqual({ type: PANE_RESIZE, value: 313 });
  });
  test('Advanced accordion expansion changes', () => {
    expect(updateAdvancedAccordionExpansions([1, 3])).toEqual({ type: ADVANCED_ACCORDION_CHANGE, value: [1, 3] });
  });
  test('Changing the active tab in the right pane', () => {
    expect(updateActiveRightPaneTab(2)).toEqual({ type: RIGHT_PANE_TAB_CHANGE, value: 2 });
  });
  test('Clear forms', () => {
    expect(clearForms()).toEqual({ type: CLEAR_FORMS });
  });
  test('Collapse/expand sidebar', () => {
    expect(toggleRightPane(false)).toEqual({ type: TOGGLE_RIGHT_PANE, value: false });
    expect(toggleRightPane(true)).toEqual({ type: TOGGLE_RIGHT_PANE, value: true });
  });
});
