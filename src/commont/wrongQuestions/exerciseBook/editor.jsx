//这个文件默认为我添加题目时判断的模板是属于英语语文数学物理
import React from 'react'
import TianK from '../../tiankong/index'
import JieD from '../../jieda/index'
import Choose from '../../choose/index'
import PanD from '../../panduan/index'
import { edit_question, create_question } from '../../../axios/http'
import { Radio, Modal, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
//通过不用改的题型渲染不同的模板
export default class EditorDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
            params: {
                exercise_book_id: localStorage.getItem('infoId'),
                book_chapter_id: props.editorBook_id,
                ques_answer: '',//答案
                ques_content: '',//内容
                ques_analysis: '',//解析
                ques_options: '',
                template_id: '',
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
        console.log(this.props.editorDParams.template_id)
        if (this.props.editorDParams.template_id !== '') {
            this.setState({
                params: this.props.editorDParams
            })
            console.log(111)
            this.tableChange(this.props.editorDParams.ques_options)
            this.switchState(this.props.editorDParams.template_id, this.props.editorDParams)
        }
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
            confirm({
                title: '是否要提交试题？',
                icon: <ExclamationCircleOutlined />,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    create_question(params).then(res => {
                        if (res.code === 0) {
                            message.success({
                                content: res.message,
                            })
                            const params = {
                                exercise_book_id: localStorage.getItem('infoId'),
                                book_chapter_id: that.props.editorBook_id,
                                ques_answer: '',//答案
                                ques_content: '',//内容
                                ques_analysis: '',//解析
                                ques_options: '',
                                template_id: '',
                            }
                            that.setState({
                                params
                            })
                            that.props.drawerCancel()
                            that.props.get_question()
                        } else {
                            message.error(res.message)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
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
                                exercise_book_id: localStorage.getItem('infoId'),
                                book_chapter_id: that.props.editorBook_id,
                                ques_answer: '',//答案
                                ques_content: '',//内容
                                ques_analysis: '',//解析
                                ques_options: '',
                                template_id: '',
                            }
                            that.setState({
                                params
                            })
                            that.props.drawerCancel()
                            that.props.get_question()
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
                    {this.props.btnChange ? <Button type="primary" onClick={this.tijiaoshiti}>提交试题</Button> : <Button type="primary" onClick={this.tijiaoshiti}>修改试题</Button>}
                </div>
            </div>

        )
    }
}