import { PaneResizeAction, ToggleAdvancedModeAction } from './ui';
import { SetBrowserFeaturesAction, StreamDetailsFieldChangeAction } from './streamDetails';
import { PlayerAction, PlayerErrorAction } from './player';

export type Action = SetBrowserFeaturesAction | ToggleAdvancedModeAction | PaneResizeAction | StreamDetailsFieldChangeAction | PlayerAction | PlayerErrorAction;
