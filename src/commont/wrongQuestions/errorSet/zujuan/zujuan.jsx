import React, { Component } from "react";
import { message, Select, Button, Modal, Input } from 'antd';
import { get_own_subject_list, get_grade_list, submit_wrong_question_cart } from '../../../../axios/http'
import List from './zujuanList'
const { Option } = Select;
// 重新记录数组顺序

export default class ReactBeautifulDnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveparams:{
                title:''
            },
            waring: false,
            items: [],
            zujuanAppear: false,
            paixuIndex: 0,
            list: [
            ],
            scorePublic: [{
                ques_type_id: '',
                total_score: 0
            }],
            totalNum: '',
            visible: false,
            visible2: false,
            editInput: '',
            setIndex: 1,
            tixinSet: 0,
            biaotiTitle: '点击修改试卷标题',
            datiTime: '',
            appear: '',
            saveFile: {
                grade_id: '',
                title: '',
                total_minute: '',
                remark: '',
                own_subject_id: '',
                difficulty_id: '',
                is_open: ''
            },
            subjectchildren: [],
            grandchildren: [],
        };
    }
    paixuIndex = (e) => {
        this.setState({
            paixuIndex: e
        })
    }
    add = (e) => {
        if (this.state.appear === e) {
            this.setState({
                appear: ''
            })
        } else {
            this.setState({
                appear: e
            })
        }
    }
    componentDidMount() {
        get_own_subject_list().then(res => {
            const subjectchildren = res.data.own_subject_list.map((res, index) => {
                return <Option key={res.name} value={res.name} >{res.name}</Option>
            })
            this.setState({
                subjectchildren,
                subjectList: res.data.own_subject_list
            })
        })
        get_grade_list().then(res => {
            const grandchildren = res.data.grade_list.map(res => {
                return <Option key={res.name} value={res.name} >{res.name}</Option>
            })
            this.setState({
                grandchildren,
                grandList: res.data.grade_list
            })
        })
    }
    changeSetIndex(e) {
        this.setState({
            setIndex: e
        })
    }
    biaotiTitle = (e) => {
        this.setState({
            biaotiTitle: e.target.value
        })
    }
    datiTime = (e) => {
        this.setState({
            datiTime: e.target.value
        })
    }

    mouseEnter = (e) => {
        this.setState({
            appearPaixu: e
        })
    }
    mouseOut = () => {
        this.setState({
            appearPaixu: ''
        })
    }
    tixinSet = (e) => {
        this.setState({
            tixinSet: Number(e)
        })
    }
    changeInputDefault = (e) => {
        this.setState({
            editInput: e.target.value
        })
    }
    suerEditInput = (id) => {
        const list = this.state.list
        let newInputData = ''
        list.forEach(element => {
            if (element.id === id) {
                newInputData = element.show_type_name
            }
        });
        this.setState({
            editInput: newInputData,
        })
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false
        });
    };
    next = () => {
        this.setState({
            visible2: true,
        });
    }
    //试卷提交
    sjAction = () => {
        const saveparams = this.state.saveparams
        submit_wrong_question_cart(saveparams).then(res=>{
            if(res.code===0){
                message.success(res.message)
                this.props.history.push('/main/wrongQuestion/errorSet')
            }else{
                message.error(res.message)
            }
        })
    }
    sjCancel = (e) => {
        const saveparams= this.state.saveparams
        saveparams.title = ''
        this.setState({
            visible2: false,
            saveparams
        });
    }
    changeTotalNum = (e, id, num) => {
        const list = this.state.list
        const scorePublic = this.state.scorePublic
        list.forEach((res, index) => {
            if (res.ques_type_id === id) {
                scorePublic[index].total_score = e.target.value
            }
        })
        this.setState({
            scorePublic
        })
    }
    changeonBlur = (e, num) => {
        if (e.target.value % num !== 0) {
            console.log(e.target.value % num)
            this.setState({
                warning: false
            })
        } else {
            console.log(e.target.value % num)
            this.setState({
                warning: true
            })
        }
    }
    onChangeState = (e, type) => {
        const saveFile = { ...this.state.saveFile }
        if (type === 'difficulty') {
            saveFile.difficulty_id = e.target.value
            this.setState({
                saveFile
            })
        } else {
            saveFile.is_open = e.target.value
            this.setState({
                saveFile
            })
        }
        console.log(saveFile)
    }
    selsectSubject = (e) => {
        const subjectList = this.state.subjectList
        const saveFile = { ...this.state.saveFile }
        subjectList.forEach(item => {
            if (e === item.name) {
                saveFile.own_subject_id = item.id
            }
        })
        this.setState({
            saveFile,
            subjectValue: e
        })
    }
    selsectGrand = (e) => {
        const grandList = this.state.grandList
        const saveFile = { ...this.state.saveFile }
        grandList.forEach(item => {
            if (e === item.name) {
                saveFile.grade_id = item.id
            }
        })
        this.setState({
            saveFile,
            grandValue: e
        })
    }
    changeTextA = e => {
        const saveFile = this.state.saveFile
        saveFile.remark = e.target.value
        this.setState({
            saveFile
        })
    }
    addQuestion = e => {
        this.props.history.replace('/main')
    }
    preview = () => {
        localStorage.setItem('previewData', JSON.stringify(this.state.previewData))
        window.open('/#/setPreview')
    }
    aichangename=(e)=>{
        const saveparams = {...this.state.saveparams}
        saveparams.title = e.target.value
        this.setState({
            saveparams
        })
    }
    render() {
        return (
            <div>
                <Modal
                    title="AI组卷提交"
                    visible={this.state.visible2}
                    okText="确认"
                    cancelText="取消"
                    onCancel={this.sjCancel}
                    onOk={this.sjAction}
                >
                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>AI卷名：</span>
                        <Input placeholder="请输入卷名" onChange={this.aichangename} value={this.state.saveparams.title}></Input>
                    </div>
                </Modal>
                <div id="m-zujuan" style={{ background: '#F5F5F5', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ width: '100%' }}>
                        <div>
                            <div>
                                <div className="paper-hd-ctrl">
                                    <Button className="m-left" type='primary' onClick={this.preview}>预览试卷</Button>
                                    <Button className="m-left" type="primary" onClick={this.next}>提交试卷</Button>
                                </div>
                            </div>
                            <div style={{ width: '100%', background: '#fff', padding: 8 }}>
                                <List data={JSON.parse(localStorage.getItem('setquestion_cart'))} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} >
                                </List>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
}

