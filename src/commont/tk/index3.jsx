import React, { Component } from 'react';
import { message, BackTop, Result, Select, Radio, Icon, Badge, Tabs } from 'antd';
import Know from '../bk/kejianKnowList'
import List from './jigouList'
import { get_own_subject_list, get_grade_list, get_list, get_self_paper_question, add_question_cart, get_ques_ids_cart, remove_question_cart, get_question_cart, remove_question_type } from '../../axios/http'
const { Option } = Select
const { TabPane } = Tabs;
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
                status: 1,
                page: 1,
                page_size: ''
            },
            appear: false,
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
    //放入答题栏的变化
    btnChange = (e) => {
        const list = this.state.list
        list[e].btnc = !list[e].btnc
        this.setState({
            list
        })
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
        const params = {...this.state.params}
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
        get_question_cart().then(res => {
            let cardTotal = null
            res.data.list.forEach(res => {
                cardTotal += Number(res.count)
            })
            this.setState({
                question_cart: res.data.list,
                cardTotal
            })
        })
        get_ques_ids_cart().then(res => {
            this.setState({
                cart_ques_ids: res.data.cart_ques_ids
            })
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
    zujuan = () => {
        this.props.history.push('/main/zujuan')
    }
    moveOrAdd = (id) => {
        let cart_ques_ids = this.state.cart_ques_ids
        let result = ''
        if (typeof (cart_ques_ids) !== 'object') {
            let strArray = cart_ques_ids.split(',')
            strArray.forEach(res => {
                if (res === id) {
                    result = true
                }
            })
        } else {
            result = false
        }
        return result
    }
    addQuestoin = (e, id) => {
        e.stopPropagation()
        add_question_cart({ ques_id: id }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_ques_ids_cart().then(res => {
                    this.setState({
                        cart_ques_ids: res.data.cart_ques_ids
                    })
                })
                get_question_cart().then(res => {
                    let cardTotal = null
                    res.data.list.forEach(res => {
                        cardTotal += Number(res.count)
                    })
                    this.setState({
                        question_cart: res.data.list,
                        cardTotal
                    })
                })
            } else {
                message.error(res.message)
            }
        })
    }
    deleteQuestoin = (e, id) => {
        e.stopPropagation()
        remove_question_cart({ ques_id: id }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_ques_ids_cart().then(res => {
                    this.setState({
                        cart_ques_ids: res.data.cart_ques_ids
                    })
                })
                get_question_cart().then(res => {
                    let cardTotal = null
                    res.data.list.forEach(res => {
                        cardTotal += Number(res.count)
                    })
                    this.setState({
                        question_cart: res.data.list,
                        cardTotal
                    })
                })
            } else {
                message.error(res.message)
            }
        })
    }
    deleteLei = (id) => {
        remove_question_type({ ques_type_id: id }).then(res => {
            message.success(res.message)
            get_ques_ids_cart().then(res => {
                this.setState({
                    cart_ques_ids: res.data.cart_ques_ids
                })
            })
            get_question_cart().then(res => {
                let cardTotal = null
                res.data.list.forEach(res => {
                    cardTotal += Number(res.count)
                })
                this.setState({
                    question_cart: res.data.list,
                    cardTotal
                })
            })
        }).catch((err) => {
            message.error(err)
        })
    }
    onTabClick = (e) => {
        switch (e) {
            case '1':
                this.props.history.push("/main")
                break
            case '2':
                this.props.history.push("/main/tk/system")
                break
            case '3':
                this.props.history.push("/main/tk/own")
                break
            default:
                this.props.history.push("/main/tk/mine")
        }
    }
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
                <div>
                    <div className="m-shopcar" onMouseEnter={() => this.mouse('enter')} onMouseLeave={() => this.mouse()}>
                        <Icon type="container" style={{ margin: `0 15px 0 0` }} />
                    我的试题篮
                    <Badge count={this.state.cardTotal} className="m-shopicon">
                        </Badge>
                    </div>
                    <div className="topic-panel" style={{ display: this.state.clear, zIndex: 9999, top: 146 }} onMouseEnter={() => this.mouse('enter')} onMouseLeave={() => this.mouse()}>
                        <div className="topic-row header">
                            <div className="topic-col">已选题型</div>
                            <div className="topic-col">数量</div>
                            <div className="topic-col">删除</div>
                        </div>
                        {this.state.question_cart.map(res =>
                            <div className="topic-bd" key={res.ques_type_id}>
                                <div className="topic-row">
                                    <div className="topic-col">
                                        {res.ques_type_name}
                                    </div>
                                    <div className="topic-col">
                                        {res.count}
                                    </div>
                                    <div className="topic-col">
                                        <Icon type="close" onClick={() => this.deleteLei(res.ques_type_id)} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="topic-ctrls">
                            {/* <div className="clear-btn" >清空全部</div> */}
                            <div className="see-btn" onClick={this.zujuan}>查看试卷</div>
                        </div>
                    </div>
                </div>
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
                <Tabs defaultActiveKey="3" size="Default" onTabClick={this.spin} onChange={this.onTabClick}>
                    <TabPane tab="知识点" key="1" className="m-tk" >
                    </TabPane>
                    <TabPane tab="真题试卷" key="2" >
                    </TabPane>
                    <TabPane tab="机构私库" key="3" >

                        {this.state.stateAppear ? <div className="knowlage">
                            <div className="tree">
                                <Know params={this.state.params} listView={this.listView} searchKeyWord={this.searchKeyWord}></Know>
                            </div>
                            <div id='scroll-y' className="list" style={this.state.height > 638 ? { height: 660 } : { height: 400 }}>
                                {/* <div className="m-scroll-list"> */}
                                <div style={{ height: 126 }}>
                                    <div >
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
                                    </div>
                                </div>
                                <List data={this.state.list} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} addQuestoin={this.addQuestoin} moveOrAdd={this.moveOrAdd}>
                                </List>
                                {/* </div> */}
                                <BackTop target={() => document.getElementById('scroll-y')} />
                            </div>
                        </div> : <Result
                                status="403"
                                title="暂时没有该学科私库组卷"
                            />}
                    </TabPane>
                    <TabPane tab="我的题目" key="4" >
                    </TabPane>
                </Tabs>
            </div >
        );
    }
}
export default tikuguanli2;