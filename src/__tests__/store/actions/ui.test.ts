import {
  toggleAdvancedMode,
  updatePaneSize,
  updateAdvancedAccordionExpansions,
  updateActiveRightPaneTab,
  TOGGLE_ADVANCED_MODE,
  PANE_RESIZE,
  ADVANCED_ACCORDION_CHANGE,
  RIGHT_PANE_TAB_CHANGE
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
});
