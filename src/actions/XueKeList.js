export const XueKeActionTypes = {
    XUEKE_LIST: 'XUEKE_LIST'
}
//保存登陆之后的首页的学科信息
export const XueKeActionCreators = {
    SaveXueKeActionCreator(payload) {
        return {
            type: XueKeActionTypes.XUEKE_LIST,
            payload
        }
    },
}