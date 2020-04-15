//这个文件默认为我添加题目时判断的模板是属于英语语文数学物理
import React from 'react'
import TianK from '../../tiankong/index'
import JieD from '../../jieda/index'
import Choose from '../../choose/index'
import PanD from '../../panduan/index'
import { tkList, tree, add_question, edit_question_question } from '../../../axios/http'
import { Select, Radio, Modal, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Option } = Select
const { confirm } = Modal;
//通过不用改的题型渲染不同的模板

export default class EditorDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tixingOptions: [],
            difficultyOptions: [],
            grandOptions: [],
            sourceOptions: [],
            yearOptions: [],
            tree: [],
            disabled: true,
            visible: false,
            value: '',
            selectValue: [],
            panduanState: '',
            chooseState: '',
            sourceName: '',
            yearName: '',
            subjectName: '',
            typeName: '',
            gradeName: '',
            know_lageNameList: [],
            ques_knowledge_idList: [],
            sbjArray: [],
            newMsgHandle: [],
            btnChange: props.btnChange,
            params: {
                course_type_id: 1,
                ques_type_id: [],//问题类型id
                ques_knowledge_ids: '',//知识点id
                ques_source: '',//试卷来源 
                ques_grade_id: [],//年级id
                ques_subject_id: [],//科目id
                ques_difficulty: '',//难易程度id
                ques_answer: '',//答案
                ques_content: '',//内容
                ques_analysis: '',//解析
                ques_school: '',
                ques_options: '',
                template_id: '',
                ques_source_type_id: [],
                ques_year: []
            },
            saveParams: JSON.parse(localStorage.getItem('saveParams')) || {
                selectValue: [],//科目
                ques_subject_id: [],//科目id
                ques_type_id: [],//问题类型id
                ques_source: '',//试卷来源 
                ques_grade_id: [],//年级id
                ques_year: [],
                ques_source_type_id: []
            },
            disabledTemplat: false,
            saveState: ''
        }
    }
    componentDidMount() {

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
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    selectonChange = e => {
        const params = {
            course_type_id: 1,
            ques_type_id: [],//问题类型id
            ques_knowledge_ids: '',//知识点id
            ques_source: '',//试卷来源 
            ques_grade_id: [],//年级id
            ques_subject_id: [],//科目id
            ques_difficulty: '',//难易程度id
            ques_answer: '',//答案
            ques_content: '',//内容
            ques_analysis: '',//解析
            ques_options: '',
            ques_school: '',
            template_id: '',
            ques_source_type_id: [],
            ques_year: []
        }
        const saveParams = { ...this.state.saveParams }
        saveParams.ques_subject_id = e[1]
        saveParams.selectValue = e
        tkList({ subject_id: e[1] }).then(res => {
            const tixingOptions = res.data.ques_type_rela_list.map((res, index) => {
                return <Option key={index} value={res.ques_type_id} >{res.name}</Option>
            })
            const grandOptions = res.data.grade_rela_list.map((res, index) => {
                return <Option key={index} value={res.grade_id} >{res.name}</Option>
            })
            const difficultyOptions = res.data.difficulty_rela_list.map((res, index) => {
                return <Radio key={index} value={res.difficulty_id}>{res.name}</Radio>
            })
            const sourceOptions = res.data.source_rela_list.map((res, index) => {
                return <Option key={index} value={res.source_id} >{res.name}</Option>
            })
            const yearOptions = res.data.year_rela_list.map((res, index) => {
                return <Option key={index} value={res.year}>{res.name}</Option>
            })
            const string = this.state.subject_list.reduce((item, res) => {
                if (e[1] === res.subject_id) {
                    item = res.name
                }
                return item
            }, '')
            params.ques_subject_id = e[1]
            if (JSON.parse(localStorage.getItem('saveParams')).selectValue.length > 1) {
                params.ques_type_id = JSON.parse(localStorage.getItem('saveParams')).ques_type_id
                params.ques_grade_id = JSON.parse(localStorage.getItem('saveParams')).ques_grade_id
                params.ques_year = JSON.parse(localStorage.getItem('saveParams')).ques_year
                // params.ques_source = JSON.parse(localStorage.getItem('saveParams')).ques_source
                params.ques_source_type_id = JSON.parse(localStorage.getItem('saveParams')).ques_source_type_id
                const typeName = res.data.ques_type_rela_list.reduce((item, res) => {
                    if (params.ques_type_id === res.ques_type_id) {
                        item = res.name
                    }
                    return item
                }, '')
                const gradeName = res.data.grade_rela_list.reduce((item, res) => {
                    if (params.ques_grade_id === res.grade_id) {
                        item = res.name
                    }
                    return item
                }, '')
                const yearName = res.data.year_rela_list.reduce((item, res) => {
                    if (params.ques_year === res.year) {
                        item = res.name
                    }
                    return item
                }, '')
                const sourceName = res.data.source_rela_list.reduce((item, res) => {
                    if (params.ques_source_type_id === res.source_id) {
                        item = res.name
                    }
                    return item
                }, '')
                this.setState({
                    sourceName,
                    yearName,
                    gradeName,
                    typeName
                })
            }
            tree({ subject_id: params.ques_subject_id }).then(tree => {
                this.setState({
                    tixingOptions,
                    grandOptions,
                    difficultyOptions,
                    sourceOptions,
                    yearOptions,
                    params,
                    sbjArray: e,
                    selectValue: e,
                    tree: tree.data.list,
                    disabled: false,
                    subjectName: string,
                    year_rela_list: res.data.year_rela_list,
                    grade_rela_list: res.data.grade_rela_list,
                    ques_type_rela_list: res.data.ques_type_rela_list,
                    source_rela_list: res.data.source_rela_list,
                    saveParams
                })
            })
        })
    }
    handleChange = e => {
        const params = { ...this.state.params }
        const saveParams = { ...this.state.saveParams }
        const ques_type_rela_list = this.state.ques_type_rela_list
        params.ques_type_id = e
        saveParams.ques_type_id = e
        const string = ques_type_rela_list.reduce((item, res) => {
            if (e === res.ques_type_id) {
                item = res.name
            }
            return item
        }, '')
        this.setState({
            params,
            typeName: string,
            saveParams
        })
    }
    grandhandleChange = e => {
        console.log(e)
        const params = { ...this.state.params }
        const saveParams = { ...this.state.saveParams }
        const grade_rela_list = this.state.grade_rela_list
        params.ques_grade_id = e
        saveParams.ques_grade_id = e
        const string = grade_rela_list.reduce((item, res) => {
            if (e === res.grade_id) {
                item = res.name
            }
            return item
        }, '')
        this.setState({
            params,
            gradeName: string,
            saveParams
        })
    }
    yearhandleChange = e => {
        const params = { ...this.state.params }
        const saveParams = { ...this.state.saveParams }
        const year_rela_list = this.state.year_rela_list
        params.ques_year = e
        saveParams.ques_year = e
        const string = year_rela_list.reduce((item, res) => {
            if (e === res.year) {
                item = res.name
            }
            return item
        }, '')
        this.setState({
            params,
            yearName: string,
            saveParams
        })
    }
    sourcehandleChange = e => {
        const params = { ...this.state.params }
        const source_rela_list = this.state.source_rela_list
        const saveParams = { ...this.state.saveParams }
        saveParams.ques_source_type_id = e
        params.ques_source_type_id = e
        const string = source_rela_list.reduce((item, res) => {
            if (e === res.source_id) {
                item = res.name
            }
            return item
        }, '')
        this.setState({
            params,
            sourceName: string,
            saveParams
        })
    }
    changeaitifen_id = (e) => {
        const params = this.state.params
        params.ques_knowledge_id = e[0]
        this.setState({
            params
        })
    }
    onchangedifficultyRadio = e => {
        const params = this.state.params
        params.ques_difficulty = e.target.value
        this.setState({
            params
        })
    }
    changeQues_source = (e, content) => {
        console.log(content)
        const params = this.state.params
        const saveParams = { ...this.state.saveParams }
        params.ques_source = e.target.value
        saveParams.ques_source = e.target.value
        this.setState({
            params,
            saveParams
        })
    }
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
        switch (value) {
            case 1:
                return <TianK data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} ques_answer={this.quesAnswer}></TianK>
            case 2:
                return <JieD data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} ques_answer={this.quesAnswer}></JieD>
            case 3:
                const list = data.ques_answer.split('')
                return <Choose checkSingle={this.checkSingle} ques_options={this.state.newMsgHandle} data={data} chooseList={list} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} choose={this.choose} panduanState={this.state.chooseState}></Choose>
            case 4:
                return <PanD data={data} ques_content={this.quesContent} ques_analysis={this.quesAnalysis} panduan={this.panduan} panduanState={this.state.panduanState}></PanD>
            default:
                return ''
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
        console.log(params)
        const that = this
        if (this.state.btnChange) {
            if (typeof params.ques_type_id === 'object' || params.ques_knowledge_ids === '' || typeof params.ques_grade_id === 'object' || params.ques_subject_id === '' || params.ques_difficulty === '' || params.ques_answer === '' || params.ques_content === '' || typeof params.ques_year === 'object') {
                message.warning('请填写必填项')
            } else {
                confirm({
                    title: '是否要提交试题？',
                    icon: <ExclamationCircleOutlined />,
                    content: '提交之后的试题请在我的题库中查看',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        add_question(params).then(res => {
                            if (res.code === 0) {
                                message.success({
                                    content: res.message,
                                    onClose: () => {
                                        that.props.history.push({ pathname: "/main/tk/mine", state: { subject_id: that.state.params.ques_subject_id, sbjArray: that.state.sbjArray } })
                                    }
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
        } else {
            confirm({
                title: '是否要修改试题？',
                icon: <ExclamationCircleOutlined />,
                content: '修改之后的试题请在我的题库中查看',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    edit_question_question(params).then(res => {
                        if (res.code === 0) {
                            message.success({
                                content: res.message,
                                onClose: () => {
                                    that.props.history.push({ pathname: "/main/tk/mine", state: { subject_id: that.state.params.ques_subject_id, sbjArray: that.state.sbjArray } })
                                }
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
    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div >
                    <div className="m-flex m-bottom" style={{ alignItems: 'center' }}>
                        <span style={{ padding: '8px 0', fontSize: 14, fontWeight: 'bold' }} className="m-row">选择模板</span>
                        <div className="m-left">
                            <Radio.Group onChange={this.onchangetemplate} value={this.state.params.template_id} disabled={this.state.disabledTemplat}>
                                <Radio value={1}>填空题模板</Radio>
                                <Radio value={2}>解答题模板</Radio>
                                <Radio value={3}>选择题模板</Radio>
                                <Radio value={4}>判断题模板</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    {this.switchState(this.state.params.template_id, this.state.params)}
                </div>
                <div style={{ position: 'absolute', right: 0, bottom: "-60px" }}>
                    {this.state.btnChange ? <Button type="primary" onClick={this.tijiaoshiti}>提交试题</Button> : <Button type="primary" onClick={this.tijiaoshiti}>修改试题</Button>}
                </div>
            </div>

        )
    }
}