import uiReducer from '../../../store/reducers/ui';
import { ADVANCED_ACCORDION_CHANGE, PANE_RESIZE, RIGHT_PANE_TAB_CHANGE, TOGGLE_ADVANCED_MODE, TOGGLE_RIGHT_PANE } from '../../../store/actions/ui';
import { RESTORE_HISTORY_ENTRY } from '../../../store/actions/history';
import { BaseTech, PlayerLogLevel } from '../../../store/model/streamDetails';
import { HistoryEntry } from '../../../store/model/history';

const resourceData = {
  url: 'abc',
  useProxy: false,
  headers: [],
  technology: BaseTech.AUTO,
};

const historyEntry: HistoryEntry = {
  timestamp: '2020-01-11T20:37:37.885Z',
  name: 'My stream test',
  formData: {
    streamDetails: {
      streamResource: resourceData,
      drmLicenseResource: resourceData,
      drmCertificateResource: resourceData,
      subtitlesResource: resourceData,
    },
    playerOptions: {
      logLevel: PlayerLogLevel.WARNING,
      customConfiguration: '',
      showPlaybackMonitor: true,
    },
  },
};

describe('UI reducer', () => {
  test('Pane resizing should be applied to the UI state, so it can be persisted.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1], rightPaneActiveTabIndex: 1, isRightPaneExpanded: true },
      { type: PANE_RESIZE, value: 313 }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 313,
      expandedAdvancedAccordionIndices: [1],
      rightPaneActiveTabIndex: 1,
      isRightPaneExpanded: true,
    });
  });
  test('Advanced mode switch should be applied to the UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1], rightPaneActiveTabIndex: 1, isRightPaneExpanded: true },
      { type: TOGGLE_ADVANCED_MODE, value: false }
    );
    expect(newState).toEqual({
      advancedMode: false,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [1],
      rightPaneActiveTabIndex: 1,
      isRightPaneExpanded: true,
    });
  });
  test('Change to advanced mode if restoring a history entry with data from the advanced forms.', () => {
    const newState = uiReducer(
      { advancedMode: false, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1], rightPaneActiveTabIndex: 1, isRightPaneExpanded: true },
      {
        type: RESTORE_HISTORY_ENTRY,
        value: historyEntry,
      }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [1],
      rightPaneActiveTabIndex: 1,
      isRightPaneExpanded: true,
    });
  });
  test('Changes to advanced accordion expansions is applied to UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1], rightPaneActiveTabIndex: 1, isRightPaneExpanded: true },
      { type: ADVANCED_ACCORDION_CHANGE, value: [0, 1] }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [0, 1],
      rightPaneActiveTabIndex: 1,
      isRightPaneExpanded: true,
    });
  });
  test('Selection of active tab in the right pane is applied to UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1], rightPaneActiveTabIndex: 1, isRightPaneExpanded: true },
      { type: RIGHT_PANE_TAB_CHANGE, value: 2 }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [1],
      rightPaneActiveTabIndex: 2,
      isRightPaneExpanded: true,
    });
  });
  test('Right pane expand/collapse toggle actions should be applied to the UI state.', () => {
    const newState = uiReducer(
      { advancedMode: true, rightPaneWidth: 424, expandedAdvancedAccordionIndices: [1], rightPaneActiveTabIndex: 1, isRightPaneExpanded: true },
      { type: TOGGLE_RIGHT_PANE, value: false }
    );
    expect(newState).toEqual({
      advancedMode: true,
      rightPaneWidth: 424,
      expandedAdvancedAccordionIndices: [1],
      rightPaneActiveTabIndex: 1,
      isRightPaneExpanded: false,
    });
  });
});
