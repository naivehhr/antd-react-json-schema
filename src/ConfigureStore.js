import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import UserReducer from 'Reducer/UserReducer'
import SysConfigReducer from 'Reducer/SysConfigReducer'
import { persistStore, autoRehydrate } from 'redux-persist';

const enhancer = compose(
  applyMiddleware(
    thunk
  ),
  autoRehydrate()
)
const reducer = combineReducers({
  user: UserReducer,
  sysconfig: SysConfigReducer
});

const store = createStore(
  reducer,
  enhancer
)

export default function configureStore(onComplete) { 
  // 这个暂时先这么解决吧
  // persistStore(store,{blacklist: ['UserReducer']}, onComplete)
  return store;
}
