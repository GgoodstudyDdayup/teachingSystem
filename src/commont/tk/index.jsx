import React, { Component } from 'react';
import { Tabs, Spin, Badge, Icon, Input, message, BackTop, Pagination, Modal, Tree } from 'antd';
import Select from './selection'
import TreeA from './tree'
import List from './list'
import Searchbtn from './searchbtn'
import {save_file, get_directory, tree, subjectList, tkList, question, add_question_cart, get_ques_ids_cart, remove_question_cart, get_question_cart, remove_question_type } from '../../axios/http'
import store from '../../store/index'
import { XueKeActionCreators } from '../../actions/XueKeList'
const { Search } = Input
const { TabPane } = Tabs;
class tikuguanli extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [

            ],
            params: {
                subject_id: 39,
                knowledge_id: '',
                ques_type_id: '',
                province_id: '',
                year: '',
                difficulty_id: '',
                source_id: '',
                grade_id: '',
                key_words: '',
                is_old: 1,
                page: 1,
                page_size: 10
            },
            collectParams: {
                resources_id: '',
                file_id: '',
                file_name: '',
                type_id: 4
            },
            visible3: false,
            totalCount: 1,
            options: store.getState().XueKeList,
            unsubscribe: store.subscribe(() => {
                this.setState({
                    options: store.getState().XueKeList
                })
            }),
            searchList: [{
                name: '题型',
                h: 13,
                list: [{ id: 13, title: '不限' }, { id: 1, title: '解答' }, { id: 2, title: '判断' }, { id: 3, title: '填空' }]
            }, {
                name: '年份',
                h: 14,
                list: [{ id: 14, title: '不限' }, { id: 4, title: '171' }, { id: 5, title: '4171' }, { id: 6, title: '4141' }]
            }, {
                name: '来源',
                h: 15,
                list: [{ id: 15, title: '不限' }, { id: 7, title: '888' }, { id: 8, title: '888' }, { id: 9, title: '888' }]
            }, {
                name: '难度',
                h: 16,
                list: [{ id: 16, title: '不限' }, { id: 10, title: '999' }, { id: 11, title: '999' }, { id: 12, title: '999' }]
            }],
            tree: [
            ],
            selectValue: [],
            cart_ques_ids: [],
            spin: false,
            clear: 'none',
            cardTotal: 0,
            question_cart: []
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
                list: res.data.list,
                totalCount: Number(res.data.total_count)
            })
        })
    }
    //更改knowlage_id
    changeaitifen_id = (e) => {
        const params = this.state.params
        if (e[0] === undefined) {
            params.knowledge_id = ''
        } else {
            params.knowledge_id = e[0]
        }
        params.page = 1
        question(params).then(res => {
            this.setState({
                params,
                list: res.data.list,
                totalCount: Number(res.data.total_count)
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
        //获取科目的数据
        subjectList().then(res => {
            store.dispatch(XueKeActionCreators.SaveXueKeActionCreator(res.data.subject_list))
        })
        //获取默认tree的数据
        tree({ subject_id: params.subject_id }).then(res => {
            this.setState({
                tree: res.data.list
            })
        })
        tkList({ subject_id: params.subject_id }).then(res => {
            this.shaixuanName(res.data)
        })
        question(this.state.params).then(res => {
            this.setState({
                list: res.data.list,
                totalCount: Number(res.data.total_count),
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
        get_directory().then(res => {
            //处理tree数据结构
            const recursion = (data) => {
                data.forEach(res => {
                    res['title'] = res.name
                    res['key'] = res.id
                    if (res.children) {
                        recursion(res.children)
                    }
                })
            }
            recursion(res.data.list)
            this.setState({
                treeA: res.data.list
            })
        })
        window.addEventListener('resize', this.handleSize);
        this.handleSize()


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
    componentWillUnmount() {
        // 移除监听事件
        this.state.unsubscribe()//移除监听
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
    zujuan = () => {
        this.props.history.push('/main/zujuan')
    }
    selectonChange = (value) => {
        const params = {
            subject_id: value[1],
            knowledge_id: '',
            ques_type_id: '',
            province_id: '',
            year: '',
            difficulty_id: '',
            source_id: '',
            grade_id: '',
            is_old: 1,
            key_words: '',
            page: 1,
            page_size: 10
        }
        question(params).then(res => {
            this.setState({
                list: res.data.list,
                params,
                selectValue: value,
                totalCount: Number(res.data.total_count),
            })
        })
        tree({ subject_id: params.subject_id }).then(res => {
            this.setState({
                tree: res.data.list
            })
        })
        tkList({ subject_id: params.subject_id }).then(res => {
            this.shaixuanName(res.data)
        })
    }
    searchKnowLage = e => {
        const params = { ...this.state.params }
        params.key_words = e
        question(params).then(res => {
            params.key_words = ''
            this.setState({
                list: res.data.list,
                params,
                totalCount: Number(res.data.total_count)
            })
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
    keyWord = e => {
        const params = { ...this.state.params }
        params.key_words = e
        question(params).then(res => {
            this.setState({
                list: res.data.list
            })
        })
    }
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
    collect = (e, res, id) => {
        e.stopPropagation()
        const collectParams = { ...this.state.collectParams }
        collectParams.file_name = res
        collectParams.file_id = id
        this.setState({
            visible3: true,
            collectParams
        })
        console.log(res, id)
    }
    onSelect = e => {
        //我选择某个文件夹的时候给目录id赋值
        const collectParams = { ...this.state.collectParams }
        collectParams.resources_id = e[0]
        this.setState({
            collectParams
        })
    }
    moveFile = () => {
        const collectParams = { ...this.state.collectParams }
        save_file(collectParams).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_directory().then(res => {
                    //处理tree数据结构
                    const recursion = (data) => {
                        data.forEach(res => {
                            res['title'] = res.name
                            res['key'] = res.id
                            if (res.children) {
                                recursion(res.children)
                            }
                        })
                    }
                    recursion(res.data.list)
                    this.setState({
                        treeA: res.data.list
                    })
                })
            }
            this.setState({
                visible3: false
            })
        })
    }
    cancleMoveFile = () => {
        this.setState({
            visible3: false
        })
    }
    render() {
        return (
            <div>
                <Modal
                    title='移动文件'
                    visible={this.state.visible3}
                    onOk={this.moveFile}
                    onCancel={this.cancleMoveFile}
                    okText="确认"
                    cancelText="取消"
                >
                    <Tree
                        onSelect={this.onSelect}
                        treeData={this.state.treeA}
                    />
                </Modal>
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
                <Tabs defaultActiveKey="1" size="Default" onTabClick={this.spin} onChange={this.onTabClick}>
                    <TabPane tab="知识点" key="1" className="m-tk" >
                        <div>
                            <div className="knowlage">
                                <div className="tree" style={this.state.height > 638 ? { maxHeight: 600, overflowY: 'scroll', width: 370 } : { maxHeight: 400, overflowY: 'scroll', width: 370 }}>
                                    <TreeA data={this.state.tree} funt={this.changeaitifen_id} search={this.searchKnowLage} knowLageValue={this.state.params.key_words}></TreeA>
                                </div>
                                <div id='scroll-y' className="list" style={this.state.height > 638 ? { height: 600 } : { height: 400 }}>
                                    <Searchbtn params={this.state.params} list={this.state.searchList} funt={this.changeSearchId}></Searchbtn>
                                    <Search className="m-bottom" placeholder="试题内容搜索" onSearch={this.keyWord} enterButton />
                                    {/* <div className="m-scroll-list"> */}
                                    <List collect={this.collect} data={this.state.list} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} addQuestoin={this.addQuestoin} moveOrAdd={this.moveOrAdd}>
                                    </List>
                                    <BackTop target={() => document.getElementById('scroll-y')} />
                                    {/* </div> */}
                                </div>
                            </div>
                            <Pagination className="m-Pleft" current={this.state.params.page} onChange={this.changePage} total={this.state.totalCount} />
                        </div>
                    </TabPane>
                    <TabPane tab="真题试卷" key="2" >
                    </TabPane>
                    <TabPane tab="机构私库" key="3" >
                    </TabPane>
                    <TabPane tab="我的题目" key="4" >
                    </TabPane>
                </Tabs>
            </div >
        );
    }
}
export default tikuguanli;