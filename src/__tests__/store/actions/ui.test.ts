import { toggleAdvancedMode, handlePaneResize, TOGGLE_ADVANCED_MODE, PANE_RESIZE } from '../../../store/actions/ui';

describe('UI Redux actions', () => {
  test('Toggle advanced mode', () => {
    expect(toggleAdvancedMode(true)).toEqual({ type: TOGGLE_ADVANCED_MODE, value: true });
  });
  test('Pane resizing', () => {
    expect(handlePaneResize(313)).toEqual({ type: PANE_RESIZE, value: 313 });
  });
});
