import {
  DELETE_HISTORY,
  DELETE_HISTORY_ENTRY,
  DELETE_UNNAMED_HISTORY_ENTRIES,
  RESTORE_HISTORY_ENTRY,
  SELECT_HISTORY_ENTRY,
  SET_HISTORY_LIST_FILTER,
  UPDATE_HISTORY_ENTRY_NAME,
  deleteHistory,
  deleteHistoryEntry,
  deleteUnnamedHistoryEntries,
  HistoryEntryFilter,
  restoreHistoryEntry,
  selectHistoryEntry,
  setHistoryFilter,
  updateSelectedHistoryEntryName,
} from '../../../store/actions/history';
import { HistoryEntry } from '../../../store/model/history';
import { BaseTech } from '../../../store/model/streamDetails';

const resourceData = {
  url: '',
  useProxy: false,
  headers: [],
  technology: BaseTech.AUTO,
};

const historyEntry: HistoryEntry = {
  timestamp: '2020-01-11T19:40:17.405',
  name: '',
  formData: {
    streamDetails: {
      streamResource: resourceData,
      drmLicenseResource: resourceData,
      drmCertificateResource: resourceData,
      subtitlesResource: resourceData,
    },
  },
};

describe('History actions', () => {
  test('Select history entry', () => {
    expect(selectHistoryEntry(historyEntry)).toEqual({
      type: SELECT_HISTORY_ENTRY,
      value: historyEntry,
    });
  });
  test('Update selected history entry name', () => {
    expect(updateSelectedHistoryEntryName('A history entry')).toEqual({
      type: UPDATE_HISTORY_ENTRY_NAME,
      value: 'A history entry',
    });
  });
  test('Restore history entry to forms', () => {
    expect(restoreHistoryEntry(historyEntry)).toEqual({
      type: RESTORE_HISTORY_ENTRY,
      value: historyEntry,
    });
  });
  test('Delete history entry', () => {
    expect(deleteHistoryEntry(historyEntry)).toEqual({
      type: DELETE_HISTORY_ENTRY,
      value: historyEntry,
    });
  });
  test('Delete history', () => {
    expect(deleteHistory()).toEqual({
      type: DELETE_HISTORY,
    });
  });
  test('Delete unnamed history entries', () => {
    expect(deleteUnnamedHistoryEntries()).toEqual({
      type: DELETE_UNNAMED_HISTORY_ENTRIES,
    });
  });
  test('Set history filter', () => {
    expect(setHistoryFilter(HistoryEntryFilter.UNNAMED)).toEqual({
      type: SET_HISTORY_LIST_FILTER,
      value: HistoryEntryFilter.UNNAMED,
    });
  });
});
