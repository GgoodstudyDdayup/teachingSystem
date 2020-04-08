import { XueKeActionTypes } from '../actions/XueKeList'
const XueKeReducer = (preState = [], action) => {
    const xiaoxue = []
    const chuzhong = []
    const gaozhong = []
    switch (action.type) {
        case XueKeActionTypes.XUEKE_LIST:
            preState = action.payload.reduce((item, res) => {
                if (res.name.search('小学') === 0) {
                    item[0].name === '小学' ? item[0].key = true : item[0].name = '小学'
                    item[0].code === '小学' ? item[0].key = true : item[0].subject_id = '小学'
                    xiaoxue.push(res)
                    item[0].items = xiaoxue
                } else if (res.name.search('初中') === 0) {
                    item[1].name === '初中' ? item[1].key = true : item[1].name = '初中'
                    item[1].code === '初中' ? item[1].key = true : item[1].subject_id = '初中'
                    chuzhong.push(res)
                    item[1].items = chuzhong
                } else {
                    item[2].name === '高中' ? item[2].key = true : item[2].name = '高中'
                    item[2].code === '高中' ? item[2].key = true : item[2].subject_id = '高中'
                    gaozhong.push(res)
                    item[2].items = gaozhong
                }
                return item
            }, [{}, {}, {}])
            return preState
        default:
            return preState
    }
}
export default XueKeReducer