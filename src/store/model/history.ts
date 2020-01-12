import { PlayerOptionsState } from '../reducers/playerOptions';
import { AutoTechnology, StreamTechnology } from './streamDetails';
import { StreamDetailsState } from '../reducers/streamDetails';

type HistoryEntryBase = {
  timestamp: string;
  error?: any;
  name: string;
};

export type BasicHistoryEntry = HistoryEntryBase & {
  formData: {
    streamDetails: {
      streamResource: {
        url: string;
        technology: AutoTechnology<StreamTechnology>;
      };
    };
  };
};

export type AdvancedHistoryEntry = HistoryEntryBase & {
  formData: {
    streamDetails: StreamDetailsState;
    playerOptions?: PlayerOptionsState;
  };
};

export type HistoryEntry = BasicHistoryEntry | AdvancedHistoryEntry;
