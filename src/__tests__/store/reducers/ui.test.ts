import uiReducer from '../../../store/reducers/ui';
import { PANE_RESIZE, TOGGLE_ADVANCED_MODE } from '../../../store/actions/ui';

describe('UI reducer', () => {
  test('Pane resizing should be applied to the UI state, so it can be persisted.', () => {
    const newState = uiReducer({ advancedMode: true, rightPaneWidth: 424 }, { type: PANE_RESIZE, value: 313 });
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 313
    });
  });
  test('Advanced mode switch should be applied to the UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424 },
      { type: TOGGLE_ADVANCED_MODE, value: false }
    );
    expect(newState).toEqual({
      advancedMode: false,
      rightPaneWidth: 424
    });
  });
});
