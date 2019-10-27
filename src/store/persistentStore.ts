import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['player', 'information']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
  const persistor = persistStore(store);
  return { store, persistor };
};
