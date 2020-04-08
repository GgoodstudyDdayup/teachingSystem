import UserStateReducer from './UserStateReducer'
import XueKeReducer from './XueKeReducer'
import { combineReducers } from 'redux'
const rootReduer = combineReducers({
    UserState: UserStateReducer,
    XueKeList:XueKeReducer
})
export default rootReduer
