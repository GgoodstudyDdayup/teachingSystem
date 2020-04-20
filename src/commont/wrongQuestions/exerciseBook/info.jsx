import React, { Component, useState, useEffect } from 'react';
import TianK from '../../tiankong/index'
import JieD from '../../jieda/index'
import Choose from '../../choose/index'
import PanD from '../../panduan/index'
import MathJax from 'react-mathjax3'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tree, Drawer, Button, Modal, Input, Select, message, Radio } from 'antd'
import { submit_wrong_question, loginUserList, get_xiaoguanjia_student, get_xiaoguanjia_class, get_chapter_list, get_chapter_question, create_chapter, edit_chapter, del_question_children, del_chapter, edit_question, set_chapter_ques_sort, get_xiaoguanjia_subject, get_xiaoguanjia_grade } from '../../../axios/http'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import List from './chapterList'
import Creat from './creat'
const { TreeNode } = Tree;
const { Option } = Select
const { confirm } = Modal
// 重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const grid = 8;
// 设置样式
const getItemStyle = (isDragging, draggableStyle) => {
    const style = {
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // 拖拽的时候背景变化
        background: isDragging ? "lightgreen" : "#fff",
        border: '1px solid #eee',
        // styles we need to apply on draggables
        ...draggableStyle,
        textAlign: 'start',
        justifyContent: 'space-between',
        display: 'flex'
    }
    return (
        style
    )
}
const getListStyle = () => ({
    background: 'white',
    padding: grid,
    width: '100%'
});
class ExerciseBookInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,//drawer
            visible2: false,//目录
            visible3: false,//章节
            visible4: false,//目录修改
            visible5: false,//章节修改
            visible6: false,
            treeList: [],
            modalParamResult: {
                xiaoguanjia_subject_id: [],
                xiaoguanjia_grade_id: [],
                xiaoguanjia_class_id: [],
                xiaoguanjia_student_ids: [],
                analysis_teacher_id: [],
                book_question_id: '',
                image: '',
                text: '',
                upload_channel_id: 2,
            },
            treeParams: {
                exercise_book_id: localStorage.getItem('infoId'),
                book_chapter_id: '',
                ques_content: ''
            },
            params: {
                book_question_id: '',
                book_chapter_id: '',
                ques_answer: '',//答案
                ques_content: '',//内容
                ques_analysis: '',//解析
                ques_options: '',
                template_id: '',
            },//这个params是用于修改
            editorZparams: {
                chapter_id: [],
                chapter: '',
                parent_id: 0
            },
            editorCparams: {
                chapter_id: '',
                chapter: '',
                parent_id: ''
            },
            editorDParams: {

            },
            chapter_questionList: [],
            chapter_title: '',
            btnChange: false,//修改和添加的判断
            editorBook_id: '',
            book_chapter_id: '',
            paixuIndex: false,
            subjectchildren: [],
            gradechildren: [],
            teachChildren: []
        }
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    componentDidMount() {
        get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
            this.setState({
                treeList: res.data.list
            })
        })
        get_xiaoguanjia_subject().then(res => {
            const subjectchildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            this.setState({
                subjectchildren
            })
        })
        get_xiaoguanjia_grade().then(res => {
            const gradechildren = res.data.list.map(res => {
                const value = res.value.split('-')[1]
                return <Option key={res.xiaoguanjia_id} value={res.xiaoguanjia_id} >{value}</Option>
            })
            this.setState({
                gradechildren
            })
        })
        loginUserList({
            name: '',
            username: '',
            permission: '',
            page_size: 100,
        }).then(res => {
            console.log(res)
            const teachChildren = res.data.list.map(res => {
                return <Option key={res.id} value={res.id} >{res.name}</Option>
            })
            this.setState({
                teachChildren
            })
        })
        this.setState({
            infoId: localStorage.getItem('infoId')
        })
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
    }
    componentWillUnmount() {
        // 移除监听事件
        window.removeEventListener('resize', this.handleSize);
        this.setState = (state, callback) => {
            return
        }
    }
    //拖拽过后的钩子设置每个类里面题目的排序
    onDragEnd(result) {
        const chapter_id = this.state.treeParams.book_chapter_id
        const list = this.state.chapter_questionList
        if (!result.destination) {
            return;
        }
        const items = reorder(
            list,
            result.source.index,
            result.destination.index
        )
        // 告诉list你需要改变那个ques_list
        let ques_ids_sort = ''
        items.forEach(res => {
            ques_ids_sort += res.id + ','
        })
        set_chapter_ques_sort({ book_chapter_id: chapter_id, ques_ids_sort: ques_ids_sort }).then(res => {
            if (res.code === 0) {
                get_chapter_question(this.state.treeParams).then(res => {
                    this.setState({
                        chapter_questionList: res.data.list
                    })
                })
            } else {
                message.warning('系统繁忙请稍后再试~~~')
            }
        })

    }
    onCheck = (checkedKeys, info) => {
        new Promise((resolve, reject) => {
            const result = checkedKeys.reduce((item, res, index) => {
                item.push({
                    ques_knowledge_id: res,
                    ques_knowledge_first_id: "",
                    ques_knowledge_second_id: "",
                    ques_knowledge_three_id: ""
                })
                return item
            }, [])
            resolve(result)
        }).then(res => {
            const result = res
            result.forEach((l1, index) => {
                info.forEach((res2) => {
                    if (res2.children !== null) {
                        res2.children.forEach((res3) => {
                            if (res3.children !== null) {
                                res3.children.forEach((res4) => {
                                    if (res4.children !== null && res4.children !== undefined) {
                                        res4.children.forEach(res5 => {
                                            if (res5.aitifen_id === result[index].ques_knowledge_id) {
                                                result[index].ques_knowledge_three_id = res4.aitifen_id
                                                result[index].ques_knowledge_second_id = res3.aitifen_id
                                                result[index].ques_knowledge_first_id = res2.aitifen_id
                                            }
                                        })
                                    }
                                })
                            } else {
                                if (res3.aitifen_id === result[index].ques_knowledge_id) {
                                    result[index].ques_knowledge_first_id = res2.aitifen_id
                                }
                            }
                        })
                    }
                })
            })
            const params = this.state.params
            params.ques_knowledge_ids = JSON.stringify(result)
            this.setState({
                params
            })
        })
    };
    tableChange = e => {
        let whatSay = e
        if (whatSay) {
            let newMsgHandle = whatSay.match(/<div(([\s\S])*?)<\/div>/g)
            this.setState({
                newMsgHandle
            })
        }
    }
    onchangetemplate = e => {
        const params = { ...this.state.params }
        params.ques_answer = ''
        params.ques_analysis = ''
        params.ques_content = ''
        params.template_id = e.target.value
        this.setState({
            params
        })
    }
    switchState = (value, data) => {
        if (this.state.params.template_id === '') {
            switch (value) {
                case '1':
                    return <TianK data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} ques_answer={this.quesAnswer}></TianK>
                case '2':
                    return <JieD data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} ques_answer={this.quesAnswer}></JieD>
                case '3':
                    const list = data.ques_answer.split('')
                    return <Choose checkSingle={this.checkSingle} ques_options={this.state.newMsgHandle} data={data} chooseList={list} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} choose={this.choose} panduanState={this.state.chooseState}></Choose>
                case '4':
                    return <PanD data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} panduan={this.panduan} panduanState={this.state.panduanState}></PanD>
                default:
            }
        } else {
            switch (value) {
                case '1':
                    return <TianK data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} ques_answer={this.quesAnswer}></TianK>
                case '2':
                    return <JieD data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} ques_answer={this.quesAnswer}></JieD>
                case '3':
                    const list = data.ques_answer.split('')
                    const ques_options = this.state.params.ques_options.match(/<div(([\s\S])*?)<\/div>/g)
                    return <Choose checkSingle={this.checkSingle} ques_options={ques_options} data={data} chooseList={list} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} choose={this.choose} panduanState={this.state.chooseState}></Choose>
                case '4':
                    return <PanD data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} panduan={this.panduan} panduanState={this.state.panduanState}></PanD>
                default:
            }
        }
    }
    panduan = e => {
        const params = { ...this.state.params }
        params.ques_answer = e
        this.setState({
            params
        })
    }
    choose = e => {
        const params = { ...this.state.params }
        if (typeof (e) === 'object') {
            const result = e.reduce((item, res) => {
                item += res + ''
                return item
            })
            params.ques_answer = result
            this.setState({
                params
            })
        } else {
            params.ques_answer = e
            this.setState({
                params
            })
        }

    }
    quesAnalysis = e => {
        const params = { ...this.state.params }
        params.ques_analysis = e
        this.setState({
            params
        })
    }
    quesContent = e => {
        const params = { ...this.state.params }
        params.ques_content = e
        this.setState({
            params
        })
    }
    quesAnswer = e => {
        const params = { ...this.state.params }
        params.ques_answer = e
        this.setState({
            params
        })
    }
    showModal = () => {
        if (this.state.tree.length > 0) {
            this.setState({
                visible: true,
            });
        } else {
            message.warning('请先选择学科')
        }
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        const params = { ...this.state.params }
        params.ques_knowledge_ids = ''
        this.setState({
            visible: false,
            params,
            know_lageNameList: [],
            ques_knowledge_idList: [],
        });
    };
    know_lageId = e => {
        const params = { ...this.state.params }
        params.ques_knowledge_ids = JSON.stringify(e)
        this.setState({
            params
        })
    }
    know_lageName = e => {
        this.setState({
            know_lageNameList: e
        })
    }
    know_lagechangeList = (e) => {
        this.setState({
            ques_knowledge_idList: e
        })
    }
    tijiaoshiti = () => {
        const params = { ...this.state.params }
        const that = this
        confirm({
            title: '是否要修改试题？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                edit_question(params).then(res => {
                    if (res.code === 0) {
                        message.success({
                            content: res.message,
                        })
                        const params = {
                            book_question_id: localStorage.getItem('infoId'),
                            book_chapter_id: '',
                            ques_answer: '',//答案
                            ques_content: '',//内容
                            ques_analysis: '',//解析
                            ques_options: '',
                            template_id: '',
                        }
                        that.setState({
                            params
                        })
                        that.drawerCancel()
                        that.get_question()
                    } else {
                        message.error(res.message)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    checkSingle = (res, type) => {
        const params = { ...this.state.params }
        if (type === 'single') {
            const arr = Object.keys(res).map(l1 => {
                const newString = res[l1].toHTML().replace(/(\s+)?<br(\s+)?\/?>(\s+)?/gi, '')
                return `<td width="48%" height="40">
                <table style="height:100%;width:100%;" cellpadding="4">
                    <tr style="display:flex;align-items: center">
                        <th valign="middle" style="width:30px">${l1}、</th>
                        <td valign="middle">
                            <div class=WordSection1 style=''>
                                <div style="display:flex;align-items: center;">
                                    ${newString}
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>`
            })
            let whatSay = `
                <table width="100%" class="ques-option-ul ques-option-ul-3653423">
                    <tr>
                        ${arr[0] + arr[1]}
                    </tr>
                    <tr>
                        ${arr[2] + arr[3]}
                    </tr>
                </table>`
            params.ques_options = whatSay
            this.setState({
                params
            })
            return
        } else {
            const arr = Object.keys(res).map(l1 => {
                const newString = res[l1].toHTML().replace(/(\s+)?<br(\s+)?\/?>(\s+)?/gi, '')
                return `<td  height="40" class="m-bottom">
                <table style="height:100%;width:100%;" cellpadding="4">
                    <tr style="display:flex;align-items: center">
                        <th valign="middle" style="width:30px;margin-left:10px" >${l1}、</th>
                        <td valign="middle">
                            <div class=WordSection1 style=''>
                                <div style="display:flex;align-items: center;">
                                    ${newString}
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>`
            })
            const result = arr.reduce((item, res) => {
                item += res
                return item
            }, '')
            let whatSay = `
                <table width="100%" class="ques-option-ul ques-option-ul-3653423">
                    <tr style="display: flex;
                    flex-wrap: wrap;">
                        ${result}
                    </tr>
                </table>`
            params.ques_options = whatSay
            this.setState({
                params
            })
            return
        }
    }
    save = (e) => {
        const params = { ...this.state.params }
        const saveParams = { ...this.state.saveParams }
        saveParams.selectValue = this.state.selectValue
        saveParams.ques_type_id = params.ques_type_id
        saveParams.ques_grade_id = params.ques_grade_id
        saveParams.ques_year = params.ques_year
        // saveParams.ques_source = params.ques_source
        saveParams.ques_source_type_id = params.ques_source_type_id
        if (e.target.value === '1') {
            if (typeof params.ques_type_id === 'object' || typeof params.ques_grade_id === 'object' || typeof params.ques_year === 'object' || typeof params.ques_source_type_id === 'object') {
                message.warning('请补全下拉框信息')
                return
            } else {
                localStorage.setItem('saveParams', JSON.stringify(saveParams))
                message.success('保存成功')
            }
        } else {
            const save = {
                selectValue: [],//科目
                ques_type_id: [],//问题类型id
                ques_source: '',//试卷来源 
                ques_grade_id: [],//年级id
                ques_subject_id: [],//科目id
                ques_year: [],
            }
            localStorage.setItem('saveParams', JSON.stringify(save))
            message.success('取消保存')
        }
        this.setState({
            saveState: e.target.value
        })
    }
    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            height: document.body.clientHeight,
        });
    }
    get_question = () => {
        const treeParams = { ...this.state.treeParams }
        get_chapter_question(treeParams).then(res => {
            this.setState({
                chapter_questionList: res.data.list
            })
        })
    }
    chapter_question = (e, title) => {
        const treeParams = { ...this.state.treeParams }
        const treeList = this.state.treeList
        let editorBook_id = this.state.editorBook_id
        const params = treeList.reduce((item, res) => {
            res.children.forEach(l1 => {
                if (l1.chapter === title) {
                    item.chapter = l1.chapter
                    item.chapter_id = l1.id
                    item.parent_id = res.id
                }
            })
            return item
        }, {})
        editorBook_id = params.chapter_id
        treeParams.book_chapter_id = e
        get_chapter_question(treeParams).then(res => {
            this.setState({
                chapter_questionList: res.data.list,
                chapter_title: title,
                editorCparams: params,
                editorBook_id,
                treeParams,
                book_chapter_id: e[0]
            })
        })
    }
    drawerModal = (e, type) => {
        console.log(e)
        const params = { ...this.state.params }
        params.ques_analysis = e.ques_analysis
        params.ques_answer = e.ques_answer
        params.ques_content = e.ques_content
        params.ques_options = e.ques_options
        params.book_chapter_id = e.exercise_book_chapter_id
        params.book_question_id = e.id
        params.template_id = e.template_id
        this.setState({
            visible: true,
            btnChange: type,
            editorDParams: e,
            params
        })
    }
    drawerCancel = () => {
        console.log(11)
        this.setState({
            visible: false,
            btnChange: false,
            editorDParams: {
                add_time: "",
                exercise_book_chapter_id: "",
                exercise_book_id: "",
                id: "",
                ques_analysis: "",
                ques_answer: "",
                ques_content: "",
                ques_options: "",
                submit_teacher_id: "",
                template_id: ""
            }
        })
    }
    zjMulu = () => {
        this.setState({
            visible2: true
        })
    }
    cancelAddModal = () => {
        this.setState({
            visible2: false
        })
    }
    okAddModal = () => {
        this.setState({
            visible2: false
        })
    }
    //添加章节目录
    zjMulu = () => {
        this.setState({
            visible2: true
        })
    }
    cancelAddModal = () => {
        this.setState({
            visible2: false
        })
    }
    okAddModal = (e) => {
        create_chapter(e).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                this.setState({
                    visible2: false
                })
            }
        }).then(() => {
            get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
                this.setState({
                    treeList: res.data.list
                })
            })
        })

    }
    //添加章节
    zjZj = () => {
        this.setState({
            visible3: true
        })
    }
    cancelAddModal2 = () => {
        this.setState({
            visible3: false
        })
    }
    okAddModal2 = (e) => {
        create_chapter(e).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                this.setState({
                    visible3: false
                })
            }
        }).then(() => {
            get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
                this.setState({
                    treeList: res.data.list
                })
            })
        })
    }
    //编辑目录
    editorMulu = () => {
        console.log()
        this.setState({
            visible4: true
        })
    }
    cancelAddModal3 = () => {
        this.setState({
            visible4: false
        })
    }
    zhangjiechange = (e) => {
        const editorCparams = this.state.editorCparams
        editorCparams.chapter = e.target.value
        this.setState({
            editorCparams
        })
    }
    okAddModal3 = () => {
        const editorCparams = this.state.editorCparams
        edit_chapter(editorCparams).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
                    this.setState({
                        treeList: res.data.list,
                        visible4: false,
                        chapter_title: editorCparams.chapter
                    })
                })
            } else {
                message.error(res.message)
            }
        })
    }
    //编辑章节
    editorzjZj = () => {
        const chapter = this.state.treeList.reduce((item, res) => {
            item.push(<Option value={res.id} key={res.id}>{res.chapter}</Option>)
            return item
        }, [])
        this.setState({
            visible5: true,
            chapter
        })
    }
    cancelAddModal4 = () => {
        const editorZparams = {
            chapter_id: [],
            chapter: '',
            parent_id: 0
        }
        this.setState({
            visible5: false,
            editorZparams
        })
    }
    zhangjiechangeZ = (e) => {
        const editorZparams = this.state.editorZparams
        editorZparams.chapter = e.target.value
        this.setState({
            editorZparams
        })
    }
    selectChapterZ = (e) => {
        const editorZparams = this.state.editorZparams
        editorZparams.chapter_id = e
        this.setState({
            editorZparams
        })
    }
    okAddModal4 = (e) => {
        const editorZparams = this.state.editorZparams
        edit_chapter(editorZparams).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
                    this.setState({
                        treeList: res.data.list
                    })
                })
                this.setState({
                    visible5: false
                })
            } else {
                message.error(res.message)
            }
        })
    }
    //创建目录试题
    zjMuluQuestion = (e) => {
        if (this.state.editorBook_id === '') {
            message.warning('请选择要添加的目录')
            return
        }
        this.setState({
            visible: true,
            btnChange: true,
            editorDParams: {
                add_time: "",
                exercise_book_chapter_id: "",
                exercise_book_id: "",
                id: "",
                ques_analysis: "",
                ques_answer: "",
                ques_content: "",
                ques_options: "",
                submit_teacher_id: "",
                template_id: ""
            }
        })
    }
    //删除练习册目录题目 
    deleteModal = (e) => {
        const that = this
        confirm({
            title: '是否要删除试题？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                del_question_children({ book_question_id: e }).then(res => {
                    if (res.code === 0) {
                        message.success({
                            content: res.message,
                        })

                        that.get_question()
                    } else {
                        message.error(res.message)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    deltetzZj = () => {
        const that = this
        confirm({
            title: '是否要删除该目录？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                del_chapter({ book_chapter_id: that.state.book_chapter_id }).then(res => {
                    if (res.code === 0) {
                        message.success({
                            content: res.message,
                        })
                        get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
                            that.setState({
                                treeList: res.data.list,
                                chapter_questionList: []
                            })
                        })
                    } else {
                        message.error(res.message)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    sortNauto = (res) => {
        this.setState({
            paixuIndex: res
        })
    }
    //练习册题目录入
    modalCancel = e => {
        this.setState({
            visible6: false
        })
    };
    modalOk = params => {
        const studentString = params.xiaoguanjia_student_ids.reduce((item, res) => {
            item += res + ','
            return item
        }, '')
        params.xiaoguanjia_student_ids = studentString
        submit_wrong_question(params).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                this.modalCancel()
            } else {
                message.error(res.message)
            }
        })
    };
    luru = (res) => {
        const modalParamResult = { ...this.state.modalParamResult }
        modalParamResult.book_question_id = res.id
        this.setState({
            visible6: true,
            modalParamResult
        })
    }
    render() {
        return (
            <div>
                <div className="m-flex">
                    <Button type="primary" onClick={this.zjZj}>创建章节</Button>
                    <ZjAdd visible3={this.state.visible3} okAddModal2={this.okAddModal2} cancelAddModal2={this.cancelAddModal2}></ZjAdd>
                    <div className='m-left'>
                        <Button type="primary" onClick={this.editorzjZj}>编辑章节</Button>
                        <Modal
                            title="编辑章节"
                            visible={this.state.visible5}
                            onOk={this.okAddModal4}
                            onCancel={this.cancelAddModal4}
                            okText="确认"
                            cancelText="取消"
                        >
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                                <span className="m-row" style={{ textAlign: 'right' }}>章节选择：</span>
                                <Select style={{ width: '100%' }} placeholder="请选择章节" onChange={this.selectChapterZ} value={this.state.editorZparams.chapter_id}>
                                    {this.state.chapter}
                                </Select>
                            </div>
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                                <span className="m-row" style={{ textAlign: 'right' }}>名称：</span>
                                <Input style={{ width: '100%' }} placeholder="请填写章节名称" onChange={this.zhangjiechangeZ} value={this.state.editorZparams.chapter}></Input>
                            </div>
                        </Modal>
                    </div>
                    <div className='m-left'>
                        <Button type="primary" onClick={this.zjMulu}>创建章节目录</Button>
                        <Zjmulu visible2={this.state.visible2} okAddModal={this.okAddModal} treeList={this.state.treeList} cancelAddModal={this.cancelAddModal}></Zjmulu>
                    </div>
                    <div className='m-left'>
                        <Button type="primary" onClick={this.zjMuluQuestion}>创建目录试题</Button>
                    </div>
                </div>
                <Drawer
                    title={this.state.btnChange ? '添加练习册试题' : '修改练习册试题'}
                    placement="right"
                    width={720}
                    closable={false}
                    onClose={this.drawerCancel}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    {this.state.btnChange ? <Creat editorDParams={this.state.editorDParams} btnChange={this.state.btnChange} editorBook_id={this.state.editorBook_id} drawerCancel={this.drawerCancel} get_question={this.get_question}></Creat> :
                        <div style={{ position: 'relative' }}>
                            <div >
                                <div className="m-flex m-bottom" style={{ alignItems: 'center' }}>
                                    <span style={{ padding: '8px 0', fontSize: 14, fontWeight: 'bold' }} className="m-row">选择模板</span>
                                    <div className="m-left">
                                        <Radio.Group onChange={this.onchangetemplate} value={this.state.params.template_id} >
                                            <Radio value='1'>填空题模板</Radio>
                                            <Radio value='2'>解答题模板</Radio>
                                            <Radio value='3'>选择题模板</Radio>
                                            <Radio value='4'>判断题模板</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>
                                {this.switchState(this.state.params.template_id, this.state.params)}
                            </div>
                            <div style={{ position: 'absolute', right: 0, bottom: "-60px" }}>
                                <Button type="primary" onClick={this.tijiaoshiti}>修改试题</Button>
                            </div>
                        </div>
                    }

                </Drawer>
                <div className="m-flex" style={{ flexWrap: 'nowrap', marginTop: 20 }}>
                    <div className="tree" style={this.state.height > 638 ? { height: 600, overflowY: 'scroll', width: 370 } : { height: 400, overflowY: 'scroll', width: 370 }}>
                        <ZjTree treeList={this.state.treeList} chapter_question={this.chapter_question}></ZjTree>
                    </div>
                    <div style={this.state.height > 638 ? { height: 600, overflowY: 'scroll', width: '100%' } : { height: 400, overflowY: 'scroll', width: '100%' }}>
                        <div style={{ background: '#fff' }}>
                            <div className='paper-hd-title' style={{ background: '#fff', flex: 1, position: 'absolute', left: '56%', width: 395, display: 'flex' }} >
                                <h3>{this.state.chapter_title}</h3>
                                {this.state.chapter_title ?
                                    <div style={{ position: 'relative', left: 10, top: 7 }}>
                                        <div style={{ display: 'flex' }}>
                                            <Button type='primary' size='small' onClick={this.editorMulu}>编辑</Button>
                                            <div className="m-left"></div>
                                            {this.state.paixuIndex ? <Button type='primary' size='small' onClick={() => this.sortNauto(false)}>取消排序</Button> : <Button type='primary' size='small' onClick={() => this.sortNauto(true)}>手动排序</Button>}

                                            {/* <div className='m-left'><Button type='danger' size='small' onClick={this.deltetzZj}>删除</Button></div> */}
                                        </div>
                                        <Modal
                                            title="编辑章节目录"
                                            visible={this.state.visible4}
                                            onOk={this.okAddModal3}
                                            onCancel={this.cancelAddModal3}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                                                <span className="m-row" style={{ textAlign: 'right' }}>名称：</span>
                                                <Input style={{ width: '100%' }} placeholder="请填写章节目录" onChange={this.zhangjiechange} value={this.state.editorCparams.chapter}></Input>
                                            </div>
                                        </Modal>
                                    </div>
                                    : ''}
                            </div>
                        </div>
                        <div style={{ height: 66 }}></div>

                        {/* <div className="paper-hd-title " style={{ width: '100%', textAlign: 'start', background: '#fff', flex: 1, display: 'flex', justifyContent: 'center' }} >
                            <p>***********</p>
                        </div> */}
                        <div>
                            <div className="m-zijuan-flex" >
                                {this.state.paixuIndex ?
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <center style={{ width: '100%', textAlign: 'start' }}>
                                            <Droppable droppableId='list'>
                                                {(provided, snapshot) => (
                                                    <div
                                                        //provided.droppableProps应用的相同元素.
                                                        {...provided.droppableProps}
                                                        // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                                                        ref={provided.innerRef}
                                                        style={getListStyle(snapshot)}
                                                    >

                                                        {this.state.chapter_questionList.map((item, index) => (
                                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={getItemStyle(
                                                                            snapshot.isDragging,
                                                                            provided.draggableProps.style
                                                                        )}
                                                                    >
                                                                        <div className="know-name-m">
                                                                            <span className="know-ques">
                                                                                <MathJax.Context
                                                                                    key={index}
                                                                                    input='tex'
                                                                                    onError={(MathJax, error) => {
                                                                                        console.warn(error);
                                                                                        MathJax.Hub.Queue(
                                                                                            MathJax.Hub.Typeset()
                                                                                        );
                                                                                    }}
                                                                                    script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"
                                                                                    options={{
                                                                                        messageStyle: 'none',
                                                                                        extensions: ['tex2jax.js'],
                                                                                        jax: ['input/TeX', 'output/HTML-CSS'],
                                                                                        tex2jax: {
                                                                                            inlineMath: [['$', '$'], ['\\(', '\\)']],
                                                                                            displayMath: [['$$', '$$'], ['\\[', '\\]']],
                                                                                            processEscapes: true,
                                                                                        },
                                                                                        TeX: {
                                                                                            extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
                                                                                        }
                                                                                    }}>
                                                                                    <MathJax.Html html={item.ques_content} />
                                                                                </MathJax.Context>
                                                                            </span>
                                                                        </div>
                                                                        {/* <div className="zujuan-m">
                                                                        <span style={{ width: 100, display: 'inline-block' }}>分值：</span>
                                                                        <Input className="zujuan-m-item-input" defaultValue="0571" onChange={(e, index) => changeValue(e, index)} />
                                                                    </div> */}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </center>
                                    </DragDropContext> :
                                    <div style={{ width: '100%', background: '#fff', padding: 8 }}>
                                        {/* <div className="leixing-title" onMouseEnter={() => this.mouseEnter(res.ques_type_id)} onMouseLeave={() => this.mouseOut()}>
                                                {res.show_type_name}
                                                <div className={this.state.appearPaixu === res.ques_type_id ? 'm-shoudongpaixu' : 'm-none'} onClick={() => this.paixuIndex(res.ques_type_id)}>手动排序</div>
                                            </div> */}
                                        <List data={this.state.chapter_questionList} drawerModal={this.drawerModal} deleteModal={this.deleteModal} luru={this.luru}></List>
                                    </div>
                                }
                            </div>
                        </div>
                        <ModalCompent modalParams={this.state.modalParamResult} modalCancel={this.modalCancel} modalOk={this.modalOk} visible2={this.state.visible6} teacherchildren={this.state.teachChildren} subjectchildren={this.state.subjectchildren} gradechildren={this.state.gradechildren}></ModalCompent>
                    </div>
                </div>
            </div >
        );
    }
}
const ZjTree = (props) => {
    const onSelect = (e, funt) => {
        props.chapter_question(e, funt.node.props.title)
    }
    return (
        <div>
            <Tree
                showLine
                switcherIcon={<DownOutlined />}
                defaultExpandedKeys={['0-0-0']}
                onSelect={onSelect}
            >
                {props.treeList.map(res =>
                    <TreeNode title={res.chapter} key={res.id} selectable={false} autoExpandParent={true}>
                        {res.children ? res.children.map(l1 =>
                            <TreeNode title={l1.chapter} key={l1.id}>
                            </TreeNode>
                        ) : ''}
                    </TreeNode>
                )}
            </Tree>
        </div>
    )
}
const ZjAdd = (props) => {
    const params = {
        exercise_book_id: localStorage.getItem('infoId'),
        chapter: '',
        parent_id: 0
    }
    const [paramResult, setparamResult] = useState(params)
    const okAddModal = () => {
        props.okAddModal2(paramResult)
        setparamResult({ ...params })
    }
    const cancelAddModal2 = () => {
        props.cancelAddModal2()
        setparamResult({ ...params })
    }
    const zhangjiechange = (e) => {
        paramResult.chapter = e.target.value
        setparamResult({ ...paramResult })
    }
    return (
        <div>
            <Modal
                title="创建章节目录"
                visible={props.visible3}
                onOk={okAddModal}
                onCancel={cancelAddModal2}
                okText="确认"
                cancelText="取消"
            >
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>名称：</span>
                    <Input style={{ width: '100%' }} placeholder="请填写章节名称" onChange={zhangjiechange} value={paramResult.chapter}></Input>
                </div>
            </Modal>
        </div>
    )
}
const Zjmulu = (props) => {
    const params = {
        exercise_book_id: localStorage.getItem('infoId'),
        chapter: '',
        parent_id: [],
    }
    const chapter = props.treeList.reduce((item, res) => {
        item.push(<Option value={res.id} key={res.id}>{res.chapter}</Option>)
        return item
    }, [])
    const [paramResult, setparamResult] = useState(params)
    const okAddModal = () => {
        props.okAddModal(paramResult)
        setparamResult({ ...params })
    }
    const cancelAddModal = () => {
        props.cancelAddModal(paramResult)
        setparamResult({ ...params })
    }
    const selectChapter = (e) => {
        paramResult.parent_id = e
        setparamResult({ ...paramResult })
    }
    const zhangjiechange = (e) => {
        paramResult.chapter = e.target.value
        setparamResult({ ...paramResult })
    }
    return (
        <div>
            <Modal
                title="创建章节目录"
                visible={props.visible2}
                onOk={okAddModal}
                onCancel={cancelAddModal}
                okText="确认"
                cancelText="取消"
            >
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>章节选择：</span>
                    <Select style={{ width: '100%' }} placeholder="请选择章节" value={paramResult.parent_id} onChange={selectChapter}>
                        {chapter}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>名称：</span>
                    <Input style={{ width: '100%' }} placeholder="请填写练习册名称" onChange={zhangjiechange} value={paramResult.chapter}></Input>
                </div>
            </Modal>
        </div>
    )
}
const ModalCompent = (props) => {
    //录入
    const modalParams = props.modalParams
    const [modalParamResult, setModalParam] = useState(modalParams)
    const [classchildren, setClasschildren] = useState([])
    const [studentchildren, setStudentchildren] = useState([])
    useEffect(() => {
        setModalParam({ ...props.modalParams })
    }, [props.modalParams])
    const teachChange = e => {
        modalParamResult.analysis_teacher_id = e
        setModalParam({ ...modalParamResult })
    }
    //modal选择下拉框科目年级时的操作
    const modalChange = (e, res) => {
        modalParamResult[res] = e
        if (typeof modalParamResult.xiaoguanjia_subject_id !== 'object' && typeof modalParamResult.xiaoguanjia_grade_id !== 'object') {
            get_xiaoguanjia_class(modalParamResult).then(res => {
                const classchildren = res.data.list.map(l1 => {
                    return <Option key={l1.class_id} value={l1.class_id} >{l1.name}</Option>
                })
                setClasschildren([...classchildren])
            })
        }
        setModalParam({ ...modalParamResult })
    }
    //modal选择下拉框班级时的操作
    const modalclassChange = e => {
        get_xiaoguanjia_student({ xiaoguanjia_class_id: e }).then(res => {
            const studentchildren = res.data.list.map(l1 => {
                return <Option key={l1.student_id} value={l1.student_id} >{l1.name}</Option>
            })
            modalParamResult.xiaoguanjia_class_id = e
            setModalParam({ ...modalParamResult })
            setStudentchildren(studentchildren)
        })
    }
    //modal选择下拉框选择学生时的操作
    const modalstudentChange = e => {
        modalParamResult.xiaoguanjia_student_ids = e
        setModalParam({ ...modalParamResult })
    }
    const modalOk = () => {
        props.modalOk(modalParamResult)
    }
    const modalCancel = () => {
        props.modalCancel()
    }
    
    return (
        <div>
            <Modal
                title="错题录入"
                visible={props.visible2}
                onOk={modalOk}
                onCancel={modalCancel}
                okText='确认'
                cancelText='取消'
            >
                
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>老师选择：</span>
                    <Select style={{ width: '100%' }} optionFilterProp="children" showSearch onChange={teachChange} value={modalParamResult.analysis_teacher_id} placeholder="请选择老师">
                        {props.teacherchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学科选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_subject_id')} value={modalParamResult.xiaoguanjia_subject_id} placeholder="请选择学科">
                        {props.subjectchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>年级选择：</span>
                    <Select style={{ width: '100%' }} onChange={(e) => modalChange(e, 'xiaoguanjia_grade_id')} value={modalParamResult.xiaoguanjia_grade_id} placeholder="请选择年级">
                        {props.gradechildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>班级选择：</span>
                    <Select style={{ width: '100%' }} onChange={modalclassChange} value={modalParamResult.xiaoguanjia_class_id} placeholder="请选择班级">
                        {classchildren}
                    </Select>
                </div>
                <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <span className="m-row" style={{ textAlign: 'right' }}>学生选择：</span>
                    <Select style={{ width: '100%' }} mode="multiple" optionFilterProp="children" showSearch onChange={modalstudentChange} value={modalParamResult.xiaoguanjia_student_ids} placeholder="请选择学生姓名(可多选)">
                        {studentchildren}
                    </Select>
                </div>
            </Modal>
        </div>
    )
}
export default ExerciseBookInfo;