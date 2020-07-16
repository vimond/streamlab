import { PlayerOptionsState } from '../reducers/playerOptions';
import { AutoTechnology, StreamTechnology } from './streamDetails';
import { StreamDetailsState } from '../reducers/streamDetails';

type HistoryEntryBase = {
  timestamp: string;
  error?: any;
  name: string;
};

export type SimpleStreamResource = {
  url: string;
  technology: AutoTechnology<StreamTechnology>;
};

export type BasicHistoryEntry = HistoryEntryBase & {
  formData: {
    streamDetails: {
      streamResource: SimpleStreamResource;
    };
  };
};

export type AdvancedHistoryEntry = HistoryEntryBase & {
  formData: {
    streamDetails: StreamDetailsState;
    playerOptions?: Omit<PlayerOptionsState, 'isModified'>;
  };
};

export type HistoryEntry = BasicHistoryEntry | AdvancedHistoryEntry;

// NaN, null, '', undefined, [] values should be ignored.
const hasValue = ([key, value]: [string, unknown]) =>
  !(
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'number' && Number.isNaN(value))
  );

const sortByKey = ([a]: [string, unknown], [b]: [string, unknown]) => a.localeCompare(b, 'en-US');

// @ts-ignore Object (indexed property) type guards for the unknown type appears to not be supported.
const isObject = (obj: unknown) => obj != null && obj.constructor === {}.constructor;

export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length === b.length) {
      for (let i = a.length; i--; ) {
        if (!isDeepEqual(a[i], b[i])) return false;
      }
      return true;
    } else {
      return false;
    }
  } else if (isObject(a) && isObject(b)) {
    // @ts-ignore Object (indexed property) type guards for the unknown type appears to not be supported.
    const entriesA = Object.entries(a).filter(hasValue).sort(sortByKey);
    // @ts-ignore
    const entriesB = Object.entries(b).filter(hasValue).sort(sortByKey);
    if (entriesA.length !== entriesB.length) {
      return false;
    }
    for (let i = entriesA.length; i--; ) {
      if (entriesA[i][0] !== entriesB[i][0] || !isDeepEqual(entriesA[i][1], entriesB[i][1])) return false;
    }
    return true;
  } else {
    return false;
  }
};

export const addOrUpdateEntry = (entries: HistoryEntry[], newEntry: HistoryEntry) => {
  const foundIndex = entries.findIndex((e) => isDeepEqual(e.formData, newEntry.formData));
  if (foundIndex !== -1) {
    const name = entries[foundIndex].name;
    const clonedEntries = entries.slice(0);
    clonedEntries.splice(foundIndex, 1);
    return clonedEntries.concat({
      ...newEntry,
      name,
    });
  } else {
    return entries.concat(newEntry);
  }
};
