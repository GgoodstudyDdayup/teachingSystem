import React, { Component } from 'react';
import { Tabs, Spin, Badge, Icon, Button, Divider, message, Modal, Result, Pagination } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Select from './selection'
import Searchbtn from './searchbtn'
import List from './mineList'
import store from '../../store/index'
import { XueKeActionCreators } from '../../actions/XueKeList'
import { tkList, subjectList, get_question_cart, question, remove_question_cart, get_ques_ids_cart, add_question_cart, del_question, remove_question_type } from '../../axios/http'
const { confirm } = Modal;
const { TabPane } = Tabs;
class tikuguanli4 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [

            ],

            params: {
                subject_id: '',
                province_id: '',
                ques_type_id: '',
                year: '',
                source_id: '',
                grade_id: '',
                difficulty_id: '',
                key_words: '',
                is_old: -1,
                page: 1,
                page_size: 10
            },
            selectValue: [],
            searchList: [],
            options: store.getState().XueKeList,
            unsubscribe: store.subscribe(() => {
                this.setState({
                    options: store.getState().XueKeList
                })
            }),
            totalCount: 1,
            spin: false,
            clear: 'none',
            question_cart: [],
            cardTotal: 0
        }
    }
    //更改筛选筛选条件查询更改params
    changeSearchId = (e, index) => {
        const params = this.state.params
        const searchList = this.state.searchList
        switch (searchList[index].name) {
            case '地区':
                searchList[index].list.forEach((res) => {
                    if (res.name === e) {
                        params['province_id'] = res.province_id
                        this.setState({
                            params
                        })
                    }
                })
                break
            case '难度':
                searchList[index].list.forEach((res) => {
                    if (res.name === e) {
                        params['difficulty_id'] = res.difficulty_id
                        this.setState({
                            params
                        })
                    }
                })
                break
            case '年份':
                searchList[index].list.forEach((res) => {
                    if (res.name === e) {
                        params['year'] = res.year
                        this.setState({
                            params
                        })
                    }
                })
                break
            case '题型':
                searchList[index].list.forEach((res) => {
                    if (res.name === e) {
                        params['ques_type_id'] = res.ques_type_id
                        this.setState({
                            params
                        })
                    }
                })
                break
            case '来源':
                searchList[index].list.forEach((res) => {
                    if (res.name === e) {
                        params['source_id'] = res.source_id
                        this.setState({
                            params
                        })
                    }
                })
                break
            default:
                searchList[index].list.forEach((res) => {
                    if (res.name === e) {
                        params['grade_id'] = res.grade_id
                        this.setState({
                            params
                        })
                    }
                })
                break
        }
        question(params).then(res => {
            this.setState({
                list: res.data.list
            })
        })
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
        const params = { ...this.state.params }
        if (this.props.location.state) {
            console.log(this.props.location.state)
            params.subject_id = this.props.location.state.subject_id
            //获取科目的数据
            subjectList().then(res => {
                store.dispatch(XueKeActionCreators.SaveXueKeActionCreator(res.data.subject_list))
                let newSelectArray = [this.props.location.state.sbjArray[0].split('')[0] + this.props.location.state.sbjArray[0].split('')[1], this.props.location.state.sbjArray[1]]
                this.setState({
                    selectValue: newSelectArray
                })
            }).then(() => {
                question(params).then(res => {
                    this.setState({
                        list: res.data.list,
                        totalCount: Number(res.data.total_count),
                    })
                })
            }).then(() => {
                get_ques_ids_cart().then(res => {
                    this.setState({
                        cart_ques_ids: res.data.cart_ques_ids
                    })
                })
            })


            tkList({ subject_id: params.subject_id }).then(res => {
                this.shaixuanName(res.data)
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
            //获取科目的数据
            subjectList().then(res => {
                store.dispatch(XueKeActionCreators.SaveXueKeActionCreator(res.data.subject_list))
            })
            tkList({ subject_id: params.subject_id }).then(res => {
                this.shaixuanName(res.data)
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
        }

    }
    componentWillUnmount() {
        // 移除监听事件
        this.state.unsubscribe()//移除监听
        window.removeEventListener('resize', this.handleSize);
        this.setState = (state, callback) => {
            return
        }
    }
    shaixuanName = (...e) => {
        const name = []
        Object.keys(e[0]).forEach(function (key, index) {
            switch (key) {
                case 'province_rela_list':
                    e[0][key].unshift({ province_id: '', name: '不限' })
                    name.push({ name: '地区', h: 'province_id', list: e[0][key] })
                    break
                case 'difficulty_rela_list':
                    e[0][key].unshift({ difficulty_id: '', name: '不限' })
                    name.push({ name: '难度', h: 'difficulty_id', list: e[0][key] })
                    break
                case 'year_rela_list':
                    e[0][key].unshift({ year: '', name: '不限' })
                    name.push({ name: '年份', h: 'year', list: e[0][key] })
                    break
                case 'ques_type_rela_list':
                    e[0][key].unshift({ ques_type_id: '', name: '不限' })
                    name.push({ name: '题型', h: 'ques_type_id', list: e[0][key] })
                    break
                case 'source_rela_list':
                    e[0][key].unshift({ source_id: '', name: '不限' })
                    name.push({ name: '来源', h: 'source_id', list: e[0][key] })
                    break
                default:
                    e[0][key].unshift({ grade_id: '', name: '不限' })
                    name.push({ name: '年级', h: 'grade_id', list: e[0][key] })
                    break
            }
        });
        this.setState({
            searchList: name
        })
        return name
    }
    selectonChange = (e) => {
        const params = { ...this.state.params }
        params.subject_id = Number(e[1])
        params.page = 1
        question(params).then(res => {
            this.setState({
                list: res.data.list,
                params,
                selectValue: e,
                totalCount: Number(res.data.total_count),
            })
        })
        tkList({ subject_id: params.subject_id }).then(res => {
            this.shaixuanName(res.data)
        })
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
    creatT = () => {
        this.props.history.push('/main/question')
    }
    del_question = (e, id) => {
        e.stopPropagation()
        const params = { ...this.state.params }
        const that = this
        confirm({
            title: '确定要删除这道试题吗？',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该数据会消失需要重新创建',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                del_question({ ques_id: id }).then(res => {
                    if (res.code === 0) {
                        question(params).then(res => {
                            that.setState({
                                list: res.data.list,
                            })
                        })
                        message.success(res.message)
                    } else {
                        message.error(res.error)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    edit = (e, id, sbjArray) => {
        e.stopPropagation()
        this.props.history.push({ pathname: '/main/question', state: { ques_id: id, sbjArray } })
    }
    deleteLei = (id) => {
        const params = {...this.state.params}
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
            question(params).then(res => {
                this.setState({
                    list: res.data.list,
                    totalCount: Number(res.data.total_count),
                })
            })
        }).catch((err) => {
            message.error(err)
        })
    }
    zujuan = () => {
        this.props.history.push('/main/zujuan')
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    changePage = page => {
        const params = { ...this.state.params }
        params.page = page
        question(params).then(res => {
            this.setState({
                list: res.data.list,
                totalCount: Number(res.data.total_count),
                params
            })
        })
    };
    render() {
        return (
            <div>
                <Spin tip="加载中..." size="large" className={this.state.spin ? 'm-spin' : 'm-spin-dis'} />
                <Select selectonChange={this.selectonChange} data={this.state.options} value={this.state.selectValue}></Select>
                <div className="m-shopcar" onMouseEnter={() => this.mouse('enter')} onMouseLeave={() => this.mouse()}>
                    <Icon type="container" style={{ margin: `0 15px 0 0` }} />
                    我的试题篮
                    <Badge count={this.state.cardTotal} className="m-shopicon">
                    </Badge>
                </div>
                <div className="topic-panel" style={{ display: this.state.clear, zIndex: 9999 }} onMouseEnter={() => this.mouse('enter')} onMouseLeave={() => this.mouse()}>
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

                <Tabs defaultActiveKey="4" size="Default" onTabClick={this.spin} onChange={this.onTabClick}>
                    <TabPane tab="知识点" key="1" className="m-tk" >

                    </TabPane>
                    <TabPane tab="真题试卷" key="2" >

                    </TabPane>
                    <TabPane tab="机构私库" key="3" >

                    </TabPane>
                    <TabPane tab="我的题目" key="4">
                        {this.state.selectValue.length > 0 ?
                            <div>
                                <Button type="primary" onClick={this.creatT}>创建试题</Button>
                                <Button className="m-left" type="primary" onClick={this.showModal}>筛选试题</Button>
                                <Divider dashed />
                            </div>
                            : ''}
                        <div >
                            {this.state.selectValue.length > 0 ?
                                <Modal
                                    title="筛选我的试题"
                                    visible={this.state.visible}
                                    okText="确定"
                                    cancelText="取消"
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                >
                                    <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                                        <Searchbtn params={this.state.params} list={this.state.searchList} funt={this.changeSearchId}></Searchbtn>
                                    </div>
                                </Modal>
                                : ""}
                            <div style={{ maxHeight: 500, overflowY: 'scroll' }} className="m-left">
                                <List data={this.state.list} fun={this.add} edit={this.edit} del_question={this.del_question} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} addQuestoin={this.addQuestoin} moveOrAdd={this.moveOrAdd}></List>
                            </div>
                            {this.state.selectValue.length > 0 ?
                                <Pagination current={this.state.params.page} className="m-Pleft" onChange={this.changePage} total={this.state.totalCount} />
                                : ""}
                        </div>
                        {this.state.selectValue.length > 0 ? '' : <Result
                            status="403"
                            title="暂时没有试题,请检查是否选择了学科再进行创建"
                            extra={<Button type="primary" onClick={this.creatT}>创建试题</Button>}
                        />}
                    </TabPane>
                </Tabs>
            </div >
        );
    }
}
export default tikuguanli4;