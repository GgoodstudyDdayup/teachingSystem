import { instance, loginPost } from './axios'
//login为了获取token
export const login = (params) => {
    return loginPost.post('/api/user/login', params)
}
//logout
export const logout = (params) => {
    return loginPost.post('/api/user/logout', params)
}
//instance实例作为系统内部cookie验证每个接口
export const tree = (params) => {
    return instance.post('/api/system/get_tree', params)
}
//科目接口
export const subjectList = () => {
    return instance.get('/api/system/get_subject_list')
}
//题库查询筛选接口
export const tkList = (params) => {
    return instance.post('/api/question/get_search_condition', params)
}
//获取题库列表选接口
export const question = (params) => {
    return instance.post('/api/question/get_question', params)
}
//获取已添加试题
export const get_ques_ids_cart = () => {
    return instance.get('/api/question/get_ques_ids_cart ')
}
//获取真题试卷
export const ztshijuan = (params) => {
    return instance.post('/api/paper/get_paper_list', params)
}
//获取真题试卷info
export const get_paper_info = (params) => {
    return instance.post('/api/paper/get_paperinfo', params)
}
//添加到试题篮
export const add_question_cart = (params) => {
    return instance.post('/api/question/add_question_cart', params)
}
//删除某个问题
export const remove_question_cart = (params) => {
    return instance.post('/api/question/remove_question_cart', params)
}


//获取排课信息
export const paike = (params) => {
    return instance.post('/api/self_lecture/get_course', params)
}
//上传课件
export const zidingyikejian = (params) => {
    return instance.post('/api/self_lecture/upload_lecture', params)
}
//获取进度
export const jindu = (params) => {
    return instance.post('/api/self_lecture/get_list', params)
}
//获取进度
export const jiangyishenghe = (params) => {
    return instance.post('/api/self_lecture/check_self_lecture', params)
}
//上传课程地址
export const kechendizhi = (params) => {
    return instance.post('/api/self_lecture/upload_course_url', params)
}
//获取后台权限组列表
export const quanxianList = (params) => {
    return instance.get('/api/user/get_permission_group', params)
}
//获取后台登录用户列表
export const loginUserList = (params) => {
    return instance.post('/api/user/get_user_list', params)
}
//添加用户
export const add_user = (params) => {
    return instance.post('/api/user/add_user', params)
}
//获取所有年级
export const grade_id_List = (params) => {
    return instance.get('/api/system/get_grade_list', params)
}
//获取自定义科目
export const object_id_List = (params) => {
    return instance.get('/api/system/get_own_subject_list', params)
}
//删除账号
export const delete_user = (params) => {
    return instance.post('/api/user/del_user', params)
}
//获取用户详情
export const get_user_detail = (params) => {
    return instance.post('/api/user/get_user_detail', params)
}
//修改账号权限
export const edit_user = (params) => {
    return instance.post('/api/user/edit_user', params)
}
//管理员修改用户密码
export const change_password = (params) => {
    return instance.post('/api/user/change_password', params)
}

//自己重置密码
export const change_password_byself = (params) => {
    return instance.post('/api/user/change_password_byself', params)
}


//获取教研组
export const get_teaching_group = (params) => {
    return instance.post('/api/system/get_teaching_group', params)
}
//添加教研组
export const add_teaching_group = (params) => {
    return instance.post('/api/system/add_teaching_group', params)
}
//删除教研组
export const del_teaching_group = (params) => {
    return instance.post('/api/system/del_teaching_group', params)
}
//修改教研组
export const edit_teaching_group = (params) => {
    return instance.post('/api/system/edit_teaching_group', params)
}
//获取修改教研组
export const get_teaching_group_detail = (params) => {
    return instance.post('/api/system/get_teaching_group_detail', params)
}

//获取我的试题篮(按照题型分组)
export const get_question_cart = () => {
    return instance.get('/api/question/get_question_cart')
}
//移除某类题型
export const remove_question_type = (params) => {
    return instance.post('/api/question/remove_question_type', params)
}

//获取我的试题篮(按照题型分组)
export const get_next_cart = () => {
    return instance.get('/api/question/get_next_cart')
}
//按照类排序
export const set_ques_type_sort = (params) => {
    return instance.post('/api/question/set_ques_type_sort', params)
}
//按照类里的题目排序
export const set_ques_sort = (params) => {
    return instance.post('/api/question/set_ques_sort', params)
}
//修改试卷的类名
export const set_show_type_name = (params) => {
    return instance.post('/api/question/set_show_type_name', params)
}
//批量修改类型分数
export const set_pager_score = (params) => {
    return instance.post('/api/question/set_pager_score', params)
}
export const get_grade_list = () => {
    return instance.get('/api/system/get_grade_list')
}
export const get_own_subject_list = (params) => {
    return instance.get('/api/system/get_own_subject_list')
}

//试卷保存设置用于单个数据上传
export const set_pager_config = (params) => {
    return instance.post('/api/question/set_pager_config', params)
}

//试卷保存设置(一起上传)
export const set_self_pager = (params) => {
    return instance.post('/api/question/set_self_pager', params)
}


//获取可以设置跨校区的用户
export const get_user_by_set = () => {
    return instance.get('/api/user/get_user_by_set')
}
//获取公司列表
export const get_company_list = () => {
    return instance.get('/api/system/get_company_list')
}
//多校区设置
export const set_user_school_rela = (params) => {
    return instance.post('/api/user/set_user_school_rela', params)
}


//通过建题的subject获取题型
export const get_ques_type_list = (params) => {
    return instance.post('/api/system/get_ques_type_list', params)
}

//创建自己的试题
export const add_question = (params) => {
    return instance.post('/api/question/add_question', params)
}

//删除自己的试题
export const del_question = (params) => {
    return instance.post('/api/question/del_question', params)
}

//获取详情接口
export const get_questioninfo = (params) => {
    return instance.post('/api/question/get_questioninfo', params)
}
//编辑试题
export const edit_question_question = (params) => {
    return instance.post('/api/question/edit_question', params)
}
//获取自定义组卷列表
export const get_list = (params) => {
    return instance.post('/api/self_paper/get_list', params)
}
//获取自定义组卷对应的题目
export const get_self_paper_question = (params) => {
    return instance.post('/api/self_paper/get_self_paper_question', params)
}
//审核自定义组卷
export const check_self_paper = (params) => {
    return instance.post('/api/self_paper/check_self_paper', params)
}

//预览组件
export const get_self_paperinfo = (params) => {
    return instance.post('/api/self_paper/get_self_paperinfo', params)
}
//删除自定义组卷
export const del_self_paper = (params) => {
    return instance.post('/api/self_paper/del_self_paper', params)
}
//根据科目id获取教材版本
export const get_version_by_subject_id = (params) => {
    return instance.post('/api/system/get_version_by_subject_id', params)
}
//根据科目id、教材版本获取教材
export const get_course_by_course_id = (params) => {
    return instance.post('/api/system/get_course_by_course_id', params)
}
//获取年级、章节模块
export const get_course_section = (params) => {
    return instance.post('/api/system/get_course_section', params)
}
//提交年级、章节模块跟知识点对应关系
export const submit_knowledge_section = (params) => {
    return instance.post('/api/system/submit_knowledge_section', params)
}
//获取一级设置的年级、章节模块跟知识点对应关系
export const get_knowledge_by_section_id = (params) => {
    return instance.post('/api/system/get_knowledge_by_section_id', params)
}

