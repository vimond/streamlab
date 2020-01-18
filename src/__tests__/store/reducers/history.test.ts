import historyReducer from '../../../store/reducers/history';
import { HistoryEntry } from '../../../store/model/history';
import {
  DELETE_HISTORY,
  DELETE_HISTORY_ENTRY,
  HistoryEntryFilter,
  SELECT_HISTORY_ENTRY,
  SET_HISTORY_LIST_FILTER,
  UPDATE_HISTORY_ENTRY_NAME
} from '../../../store/actions/history';
import { PLAY, PLAYER_ERROR } from '../../../store/actions/player';
import { BaseTech, PlayerLogLevel } from '../../../store/model/streamDetails';

const resourceData1 = {
  url: 'abc',
  useProxy: false,
  headers: [],
  technology: BaseTech.AUTO
};

const resourceData2 = {
  url: 'def',
  useProxy: true,
  headers: [],
  technology: BaseTech.AUTO
};

const resourceData3 = {
  url: 'ghi',
  useProxy: false,
  headers: [],
  technology: BaseTech.AUTO
};

const historyEntry1: HistoryEntry = {
  timestamp: '2020-01-11T20:37:37.885Z',
  name: 'My stream test',
  formData: {
    streamDetails: {
      streamResource: resourceData1,
      drmLicenseResource: resourceData1,
      drmCertificateResource: resourceData1,
      subtitlesResource: resourceData1
    },
    playerOptions: {
      logLevel: PlayerLogLevel.WARNING,
      customConfiguration: '',
      showPlaybackMonitor: true
    }
  }
};

const historyEntry2: HistoryEntry = {
  timestamp: '2018-04-23T12:23:02.734Z',
  name: 'Stream 2',
  formData: {
    streamDetails: {
      streamResource: resourceData2,
      drmLicenseResource: resourceData2,
      drmCertificateResource: resourceData2,
      subtitlesResource: resourceData2
    }
  }
};

const historyEntry3: HistoryEntry = {
  timestamp: '2019-11-05T08:45:12.917Z',
  name: 'Problematic stream',
  formData: {
    streamDetails: {
      streamResource: resourceData3,
      drmLicenseResource: resourceData3,
      drmCertificateResource: resourceData3,
      subtitlesResource: resourceData3
    }
  }
};

describe('Form history reducer', () => {
  test('The SELECT_HISTORY_ENTRY action makes a history entry the currently selected for preview.', () => {
    const newState = historyReducer(
      { history: [historyEntry1, historyEntry2], historyListFilter: HistoryEntryFilter.BOTH },
      { type: SELECT_HISTORY_ENTRY, value: historyEntry1 }
    );
    expect(newState).toEqual({
      history: [historyEntry1, historyEntry2],
      historyListFilter: HistoryEntryFilter.BOTH,
      selectedEntry: historyEntry1
    });
  });
  test('The SELECT_HISTORY_ENTRY action unselects an already selected history entry', () => {
    const newState = historyReducer(
      {
        history: [historyEntry1, historyEntry2],
        historyListFilter: HistoryEntryFilter.BOTH,
        selectedEntry: historyEntry1
      },
      { type: SELECT_HISTORY_ENTRY, value: historyEntry1 }
    );
    expect(newState).toEqual({
      history: [historyEntry1, historyEntry2],
      historyListFilter: HistoryEntryFilter.BOTH,
      selectedEntry: undefined
    });
  });
  test('The DELETE_HISTORY_ENTRY removes an entry from the history list and from selection.', () => {
    const newState = historyReducer(
      {
        history: [historyEntry1, historyEntry2],
        selectedEntry: historyEntry1,
        historyListFilter: HistoryEntryFilter.BOTH
      },
      { type: DELETE_HISTORY_ENTRY, value: historyEntry1 }
    );
    expect(newState).toEqual({
      history: [historyEntry2],
      historyListFilter: HistoryEntryFilter.BOTH,
      selectedEntry: undefined
    });
  });
  test('The UPDATE_HISTORY_ENTRY_NAME action sets the name of the selected history entry, and updates the entry in the history list', () => {
    const newState = historyReducer(
      {
        history: [historyEntry1, historyEntry2],
        selectedEntry: historyEntry1,
        historyListFilter: HistoryEntryFilter.BOTH
      },
      { type: UPDATE_HISTORY_ENTRY_NAME, value: 'A new name being typ' }
    );
    expect(newState).toEqual({
      history: [{ ...historyEntry1, name: 'A new name being typ' }, historyEntry2],
      historyListFilter: HistoryEntryFilter.BOTH,
      selectedEntry: {
        timestamp: '2020-01-11T20:37:37.885Z',
        name: 'A new name being typ',
        formData: {
          streamDetails: {
            streamResource: resourceData1,
            drmLicenseResource: resourceData1,
            drmCertificateResource: resourceData1,
            subtitlesResource: resourceData1
          },
          playerOptions: {
            logLevel: PlayerLogLevel.WARNING,
            customConfiguration: '',
            showPlaybackMonitor: true
          }
        }
      }
    });
  });
  test('The DELETE_HISTORY action removes all entries from the history list, and also the selected entry.', () => {
    const newState = historyReducer(
      {
        history: [historyEntry1, historyEntry2],
        selectedEntry: historyEntry1,
        historyListFilter: HistoryEntryFilter.UNNAMED
      },
      { type: DELETE_HISTORY }
    );
    expect(newState).toEqual({
      history: [],
      historyListFilter: HistoryEntryFilter.UNNAMED,
      selectedEntry: undefined
    });
  });
  test('The SET_HISTORY_LIST_FILTER changes the current filter for the history list.', () => {
    const newState = historyReducer(
      { history: [historyEntry1, historyEntry2], historyListFilter: HistoryEntryFilter.BOTH },
      { type: SET_HISTORY_LIST_FILTER, value: HistoryEntryFilter.NAMED }
    );
    expect(newState).toEqual({
      history: [historyEntry1, historyEntry2],
      historyListFilter: HistoryEntryFilter.NAMED
    });
  });
  test(
    'The PLAY action adds all current form data to a new history entry, ' +
      'with a ISO-8601-formatted date/time stamp.',
    () => {
      const newState = historyReducer(
        {
          history: [historyEntry1, historyEntry2],
          selectedEntry: historyEntry1,
          historyListFilter: HistoryEntryFilter.BOTH
        },
        {
          type: PLAY,
          value: {
            source: { streamUrl: '' },
            historyEntry: historyEntry3
          }
        }
      );
      expect(newState).toEqual({
        history: [historyEntry1, historyEntry2, historyEntry3],
        historyListFilter: HistoryEntryFilter.BOTH,
        selectedEntry: historyEntry1
      });
    }
  );
  test(
    "The PLAY action doesn't add a new entry if an entry with equal form details " +
      'already exist in the history. Instead the timestamp is updated and the existing entry is moved to the end.',
    () => {
      {
        const duplicateEntry = {
          ...historyEntry2,
          timestamp: '2020-01-16T20:36:29.713Z'
        };
        const newState = historyReducer(
          {
            history: [historyEntry1, historyEntry2, historyEntry3],
            historyListFilter: HistoryEntryFilter.BOTH,
            selectedEntry: historyEntry2
          },
          {
            type: PLAY,
            value: {
              source: { streamUrl: '' },
              historyEntry: duplicateEntry
            }
          }
        );
        expect(newState).toEqual({
          history: [historyEntry1, historyEntry3, duplicateEntry],
          historyListFilter: HistoryEntryFilter.BOTH,
          selectedEntry: {
            ...duplicateEntry,
            name: historyEntry2.name
          }
        });
      }
      {
        const duplicateEntry = {
          ...historyEntry2,
          timestamp: '2020-01-16T20:36:29.713Z'
        };
        const newState = historyReducer(
          {
            history: [historyEntry1, historyEntry2, historyEntry3],
            historyListFilter: HistoryEntryFilter.BOTH,
            selectedEntry: historyEntry1
          },
          {
            type: PLAY,
            value: {
              source: { streamUrl: '' },
              historyEntry: duplicateEntry
            }
          }
        );
        expect(newState).toEqual({
          history: [historyEntry1, historyEntry3, duplicateEntry],
          historyListFilter: HistoryEntryFilter.BOTH,
          selectedEntry: historyEntry1
        });
      }
    }
  );
  test('The PLAYER_ERROR action marks the latest history entry as failed.', () => {
    const error = new Error('Bad playback.');
    const newState = historyReducer(
      {
        history: [historyEntry1, historyEntry2, historyEntry3],
        selectedEntry: historyEntry1,
        historyListFilter: HistoryEntryFilter.BOTH
      },
      {
        type: PLAYER_ERROR,
        error
      }
    );
    expect(newState).toEqual({
      history: [
        historyEntry1,
        historyEntry2,
        {
          timestamp: '2019-11-05T08:45:12.917Z',
          error,
          name: 'Problematic stream',
          formData: {
            streamDetails: {
              streamResource: resourceData3,
              drmLicenseResource: resourceData3,
              drmCertificateResource: resourceData3,
              subtitlesResource: resourceData3
            }
          }
        }
      ],
      historyListFilter: HistoryEntryFilter.BOTH,
      selectedEntry: historyEntry1
    });
  });
  // TODO: Select another right pane tab unselects a history entry.
});

// TODO: RESTORE_HISTORY_ENTRY must be handled and tested in another reducer.
// TODO: The history panel should display a message when the history list shrinks by one. This means an entry is deleted.
