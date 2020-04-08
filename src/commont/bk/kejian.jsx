import React, { Component } from 'react';
import { Input, message, BackTop, Divider, Button, Result, Select, Radio, Modal } from 'antd';
import Know from './kejianKnowList'
import List from './kejianList'
import { check_self_paper, get_own_subject_list, get_grade_list, get_list, get_self_paper_question } from '../../axios/http'
const { TextArea } = Input;
const { Option } = Select
class tikuguanli2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            searchList: [],
            params: {
                own_subject_id: '',
                grade_id: '',
                difficulty_id: '',
                is_open: 1,
                key_words: '',
                is_self: -1,
                status: -1,
                page: 1,
                page_size: ''
            },

            shenghe: {
                status: '',
                self_paper_id: '',
                comment: ''
            },
            stateAppear: '',
            selectValue: [],
            cart_ques_ids: '',
            question_cart: [],
            spin: false,
            clear: 'none',
            cardTotal: 10,
            value2: ''
        }
    }
    //查看答案的伸缩
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

    mouse = (e) => {
        if (e) {
            this.setState({
                clear: 'block'
            })
        } else {
            this.setState({
                clear: 'none'
            })
        }
    }

    componentDidMount() {
        const params = { ...this.state.params }
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
        get_list(params).then(res => {
            if (res.data.list.length >= 1) {
                this.setState({
                    params,
                    stateAppear: true
                })
            } else {
                this.setState({
                    params,
                    stateAppear: false
                })
            }
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
    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            height: document.body.clientHeight,
        });
    }
    listView = (e, time, title, score) => {
        const shenghe = this.state.shenghe
        get_self_paper_question({ self_paper_id: e }).then(res => {
            shenghe.self_paper_id = e
            this.setState({
                list: res.data.ques_list,
                title: title,
                datiTime: time,
                totalNum: score,
                shenghe
            })
        })
    }

    selsectSubject = (e) => {
        const subjectList = this.state.subjectList
        const params = { ...this.state.params }
        subjectList.forEach(item => {
            if (e === item.name) {
                params.own_subject_id = item.id
                get_list(params).then(res => {
                    if (res.data.list.length >= 1) {
                        this.setState({
                            params,
                            stateAppear: true
                        })
                    } else {
                        this.setState({
                            params,
                            stateAppear: false
                        })
                    }
                })
            }
        })
        this.setState({
            params,
            subjectValue: e
        })
    }
    selsectGrand = (e) => {
        const grandList = this.state.grandList
        const params = { ...this.state.params }
        grandList.forEach(item => {
            if (e === item.name) {
                params.grade_id = item.id
                get_list(params).then(res => {
                    if (res.data.list.length >= 1) {
                        this.setState({
                            params,
                            stateAppear: true
                        })
                    } else {
                        this.setState({
                            params,
                            stateAppear: false
                        })
                    }
                })
            }
        })
        this.setState({
            params,
            grandValue: e
        })
    }
    onChangeState = (e, type) => {
        const params = { ...this.state.params }
        if (type === 'difficulty') {
            params.difficulty_id = e.target.value
            get_list(params).then(res => {
                if (res.data.list.length >= 1) {
                    this.setState({
                        params,
                        stateAppear: true
                    })
                } else {
                    this.setState({
                        params,
                        stateAppear: false
                    })
                }
            })

        } else {
            params.is_open = e.target.value
            this.setState({
                params
            })
        }
    }
    searchKeyWord = (e) => {
        const params = { ...this.state.params }
        params.key_words = e
        get_list(params).then(res => {
            this.setState({
                params,
            })
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        const shenghe = this.state.shenghe
        const params = { ...this.state.params }
        check_self_paper(shenghe).then(res => {
            if (res.code === 0) {
                const shenghe = {
                    comment: '',
                    self_paper_id: '',
                    status: ''
                }
                console.log(shenghe)
                message.success(res.message)
                this.setState({
                    visible: false,
                    shenghe,
                    list: [],
                    title: '',
                    datiTime: '',
                    value2: '',
                    totalNum: '',
                });
            } else {
                message.error(res.message)
            }
        }).then(() => {
            get_list(params).then(res => {
                if (res.data.list.length >= 1) {
                    this.setState({
                        params,
                        stateAppear: true,
                    })
                } else {
                    this.setState({
                        params,
                        stateAppear: false,
                    })
                }
            })
        })

    };

    handleCancel = e => {
        console.log(e);
        const shenghe = {
            status: '',
            comment: '',
            self_paper_id: ''
        }
        this.setState({
            visible: false,
            shenghe
        });
    };
    onchangeTuanduiRadio = e => {
        const shenghe = this.state.shenghe
        shenghe.status = e.target.value
        this.setState({
            value2: e.target.value,
            shenghe
        })
    }
    changeTextA = e => {
        const shenghe = this.state.shenghe
        shenghe.comment = e.target.value
        this.setState({
            value2: e.target.value,
            shenghe
        })
    }
    render() {
        return (
            <div>
                <div className="m-flex">
                    <div className="m-left">
                        <Select style={{ width: 120 }} showSearch optionFilterProp="children" onChange={this.selsectSubject} value={this.state.subjectValue} placeholder="请选择学科">
                            {this.state.subjectchildren}
                        </Select>
                    </div>
                    <div className="m-left">
                        <Select style={{ width: 120 }} showSearch optionFilterProp="children" onChange={this.selsectGrand} value={this.state.grandValue} placeholder="请选择年级">
                            {this.state.grandchildren}
                        </Select>
                    </div>
                    <div className="m-flex " style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                        <span className="m-row" style={{ textAlign: 'right' }}>难度：</span>
                        <Radio.Group onChange={(e) => this.onChangeState(e, 'difficulty')} value={this.state.params.difficulty_id}>
                            <Radio value={1}>简单</Radio>
                            <Radio value={2}>中等</Radio>
                            <Radio value={3}>困难</Radio>
                        </Radio.Group>
                    </div>
                </div>

                <Divider />
                {this.state.stateAppear ? <div className="knowlage">
                    <div className="tree">
                        <Know params={this.state.params} listView={this.listView} searchKeyWord={this.searchKeyWord}></Know>
                    </div>
                    <div id='scroll-y' className="list" style={this.state.height > 638 ? { height: 660 } : { height: 400 }}>
                        {/* <div className="m-scroll-list"> */}
                        <div style={{ height: 126 }}>
                            <div style={{ position: 'relative' }}>
                                <div className='paper-hd-title' style={{ background: '#fff', flex: 1 }} >
                                    <h3>{this.state.title}</h3>
                                </div>
                                <div className="paper-hd-title " style={{ width: '100%', textAlign: 'start', background: '#fff', flex: 1, display: 'flex', justifyContent: 'center' }} >
                                    <div className="set-item" >总分：<span>{this.state.totalNum}分</span></div>
                                    <div className="set-item">答题时间：<span>{this.state.datiTime}</span>分钟</div>
                                    <div className="set-item" >日期：<span className="line"></span></div>
                                    <div className="set-item">班级：<span className="line"></span></div>
                                    <div className="set-item">姓名：<span className="line"></span></div>
                                </div>
                                {this.state.title ? <Button onClick={this.showModal} style={{ position: 'absolute', right: 10, top: 10 }} type='primary'>审核组卷</Button> : ''}
                                <Modal
                                    title="审核课件"
                                    visible={this.state.visible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                                        <span className="m-row" style={{ textAlign: 'right' }}>审核状态：</span>
                                        <Radio.Group onChange={this.onchangeTuanduiRadio} value={this.state.value2}>
                                            <Radio value="1">通过</Radio>
                                            <Radio value="2">未通过</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="m-flex" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                        <span style={{ textAlign: 'right', display: 'inline-block', width: 130 }}>审核说明：</span>
                                        <TextArea value={this.state.shenghe.comment} rows={4} onChange={this.changeTextA} />
                                    </div>
                                </Modal>
                            </div>
                        </div>


                        <List data={this.state.list} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} addQuestoin={this.addQuestoin} moveOrAdd={this.moveOrAdd}></List>
                        {/* </div> */}
                        <BackTop target={() => document.getElementById('scroll-y')} />
                    </div>
                </div> : <Result
                        status="403"
                        title="暂时没有该学科公开组卷"
                    />}

            </div >
        );
    }
}
export default tikuguanli2;