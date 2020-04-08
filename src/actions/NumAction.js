//Action:对数据做的任何修改的类型
//Action:一个属性：type是字符串一般要求大写，区分不同的动作
//payload属性:是当前动作的数据
export const NumActionTypes = {
    ADD_NUM: 'ADD_NUM',
    MINUS_NUM: 'MINUS_NUM',
    REPLACE_NUM: 'REPLACE_NUM'
}
//创建一个Action对象的辅助方法
//最终组件调用要引入这个文件并调用方法
export const NumActionCreators = {
    AddActionCreator(payload) {
        return {
            type: NumActionTypes.ADD_NUM,
            payload
        }
    },
    MinusActionCreator(payload) {
        return {
            type: NumActionTypes.MINUS_NUM,
            payload
        }
    },
    ReplaceActionCreator(payload) {
        return {
            type: NumActionTypes.REPLACE_NUM,
            payload
        }
    }
}