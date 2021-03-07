import { HistoryEntry } from '../model/history';

export const SELECT_HISTORY_ENTRY = 'SELECT_HISTORY_ENTRY';
export const RESTORE_HISTORY_ENTRY = 'RESTORE_HISTORY_ENTRY';
export const UPDATE_HISTORY_ENTRY_NAME = 'UPDATE_HISTORY_ENTRY_NAME';
export const DELETE_HISTORY_ENTRY = 'DELETE_HISTORY_ENTRY';
export const DELETE_HISTORY = 'DELETE_HISTORY';
export const DELETE_UNNAMED_HISTORY_ENTRIES = 'DELETE_UNNAMED_HISTORY_ENTRIES';
export const SET_HISTORY_LIST_FILTER = 'SET_HISTORY_LIST_FILTER';

export enum HistoryEntryFilter {
  BOTH,
  NAMED,
  UNNAMED,
}

export interface HistoryEntryAction {
  type: typeof SELECT_HISTORY_ENTRY | typeof RESTORE_HISTORY_ENTRY | typeof DELETE_HISTORY_ENTRY;
  value: HistoryEntry;
}

export interface UpdateSelectedHistoryEntryNameAction {
  type: typeof UPDATE_HISTORY_ENTRY_NAME;
  value: string;
}

export interface DeleteHistoryAction {
  type: typeof DELETE_HISTORY;
}

export interface DeleteUnnamedHistoryEntriesAction {
  type: typeof DELETE_UNNAMED_HISTORY_ENTRIES;
}

export interface SetHistoryFilterAction {
  type: typeof SET_HISTORY_LIST_FILTER;
  value: HistoryEntryFilter;
}

export const selectHistoryEntry = (value: HistoryEntry): HistoryEntryAction => ({
  type: SELECT_HISTORY_ENTRY,
  value,
});

export const updateSelectedHistoryEntryName = (value: string): UpdateSelectedHistoryEntryNameAction => ({
  type: UPDATE_HISTORY_ENTRY_NAME,
  value,
});

export const restoreHistoryEntry = (value: HistoryEntry): HistoryEntryAction => ({
  type: RESTORE_HISTORY_ENTRY,
  value,
});

export const deleteHistoryEntry = (value: HistoryEntry): HistoryEntryAction => ({
  type: DELETE_HISTORY_ENTRY,
  value,
});

export const deleteHistory = (): DeleteHistoryAction => ({
  type: DELETE_HISTORY,
});

export const setHistoryFilter = (value: HistoryEntryFilter): SetHistoryFilterAction => ({
  type: SET_HISTORY_LIST_FILTER,
  value,
});

export const deleteUnnamedHistoryEntries = (): DeleteUnnamedHistoryEntriesAction => ({
  type: DELETE_UNNAMED_HISTORY_ENTRIES,
});
