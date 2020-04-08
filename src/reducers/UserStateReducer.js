import { UserStateActionTypes } from '../actions/UserStateAction'
const UserStateReducer = (preState = [], action) => {
    switch (action.type) {
        case UserStateActionTypes.LOAD_USERSTATE:
            return preState = action.payload.user_info
        default:
            return preState
    }
}
export default UserStateReducer