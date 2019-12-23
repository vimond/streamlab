import {
  toggleAdvancedMode,
  updatePaneSize,
  TOGGLE_ADVANCED_MODE,
  PANE_RESIZE,
  updateAdvancedAccordionExpansions,
  ADVANCED_ACCORDION_CHANGE
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
});
