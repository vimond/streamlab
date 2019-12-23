import uiReducer from '../../../store/reducers/ui';
import { ADVANCED_ACCORDION_CHANGE, PANE_RESIZE, TOGGLE_ADVANCED_MODE } from '../../../store/actions/ui';

describe('UI reducer', () => {
  test('Pane resizing should be applied to the UI state, so it can be persisted.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1] },
      { type: PANE_RESIZE, value: 313 }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 313,
      expandedAdvancedAccordionIndices: [1]
    });
  });
  test('Advanced mode switch should be applied to the UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1] },
      { type: TOGGLE_ADVANCED_MODE, value: false }
    );
    expect(newState).toEqual({
      advancedMode: false,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [1]
    });
  });
  test('Changes to advanced accordion expansions is applied to UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1] },
      { type: ADVANCED_ACCORDION_CHANGE, value: [0, 1] }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [0, 1]
    });
  });
});
