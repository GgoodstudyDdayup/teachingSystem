import React, { Component } from 'react';
import { Tabs, Spin, Badge, Icon, message, BackTop, Button, Modal, Tree } from 'antd';
import Select from './selection'
import Know from './knowlist'
import List from './list'
import Searchbtn from './searchbtn'
import { ztshijuan, save_file, get_directory, tkList, subjectList, question, add_question_cart, get_ques_ids_cart, remove_question_cart, get_question_cart, remove_question_type, get_paper_info } from '../../axios/http'
import store from '../../store/index'
import { XueKeActionCreators } from '../../actions/XueKeList'
import Md5 from 'js-md5'
const { TabPane } = Tabs;
class tikuguanli2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [

            ],
            searchList: [],
            params: {
                subject_id: JSON.parse(localStorage.getItem('default_subject_list'))[0].subject_id,
                province_id: '',
                ques_type_id: '',
                year: '',
                source_id: '',
                grade_id: '',
                difficulty_id: '',
                key_words: '',
                is_old: 1,
                page: 1,
                page_size: 10
            },
            collectParams: {
                resources_id: '',
                file_id: '',
                file_name: '',
                type_id: 2
            },
            selectValue: [JSON.parse(localStorage.getItem('default_subject_list'))[0].subject_id],
            cart_ques_ids: '',
            options: store.getState().XueKeList,
            unsubscribe: store.subscribe(() => {
                this.setState({
                    options: store.getState().XueKeList
                })
            }),
            question_cart: [],
            spin: false,
            clear: 'none',
            cardTotal: 10,
            bck: '',
            paper_id: ''
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
        console.log(params)
        this.setState({
            params
        })
        // question(params).then(res => {
        //     this.setState({
        //         list: res.data.list,
        //         totalCount: Number(res.data.total_count)
        //     })
        // })
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
    componentDidMount() {
        const params = { ...this.state.params }
        //获取科目的数据
        subjectList().then(res => {
            store.dispatch(XueKeActionCreators.SaveXueKeActionCreator(res.data.subject_list))
        })
        tkList({ subject_id: params.subject_id }).then(res => {
            this.shaixuanName(res.data)
        })
        question(this.state.params).then(res => {
            this.setState({
                totalCount: Number(res.data.total_count)
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
        ztshijuan(params).then(res => {
            this.listView2(res.data.list[0].aitifen_id)

        })
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
    }
    shaixuanName = (...e) => {
        const change = {
            province_rela_list: e[0].province_rela_list,
            grade_rela_list: e[0].grade_rela_list,
            source_rela_list: e[0].source_rela_list,
            year_rela_list: e[0].year_rela_list
        }
        const name = []
        Object.keys(change).forEach(function (key, index) {
            switch (key) {
                case 'province_rela_list':
                    change[key].unshift({ province_id: '', name: '不限' })
                    name.push({ name: '地区', h: 'province_id', list: change[key] })
                    break
                // case 'difficulty_rela_list':
                //     e[0][key].unshift({ difficulty_id: '', name: '不限' })
                //     name.push({ name: '难度', h: 'difficulty_id', list: e[0][key] })
                //     break
                case 'year_rela_list':
                    change[key].unshift({ year: '', name: '不限' })
                    name.push({ name: '年份', h: 'year', list: change[key] })
                    break
                // case 'ques_type_rela_list':
                //     e[0][key].unshift({ ques_type_id: '', name: '不限' })
                //     name.push({ name: '题型', h: 'ques_type_id', list: e[0][key] })
                //     break
                case 'source_rela_list':
                    change[key].unshift({ source_id: '', name: '不限' })
                    name.push({ name: '来源', h: 'source_id', list: change[key] })
                    break
                default:
                    change[key].unshift({ grade_id: '', name: '不限' })
                    name.push({ name: '年级', h: 'grade_id', list: change[key] })
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
    selectonChange = (e) => {
        const params = { ...this.state.params }
        params.subject_id = e.length > 1 ? e[1] : e[0]
        params.page = 1
        this.setState({
            params,
            selectValue: e
        })
        question(params).then(res => {
            this.setState({
                list: res.data.list,
                params,
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
    listView = (e, res, page) => {
        const params = { ...this.state.params }
        const collectParams = { ...this.state.collectParams }
        collectParams.file_id = e
        collectParams.file_name = res
        params.page = page
        get_paper_info({ paper_id: e }).then(res => {
            this.setState({
                params,
                list: res.data.ques_list,
                collectParams,
                bck: e,
                paper_id: e
            })
        })
    }
    listView2 = (e) => {
        get_paper_info({ paper_id: e }).then(res => {
            this.setState({
                list: res.data.ques_list,
                bck: e
            })
        })
    }
    changePage = (e) => {
        const params = this.state.params
        params.page = e
        this.setState({ params })
    }
    // keyWord = e => {
    //     const params = { ...this.state.params }
    //     params.key_words = e
    //     question(params).then(res => {
    //         this.setState({
    //             list: res.data.list
    //         })
    //     })
    // }
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
    zujuan = () => {
        this.props.history.push('/main/zujuan')
    }
    preview = (data) => {
        if (this.state.list.length === 0) {
            message.warning('请先选择试卷')
            return
        }
        const date = new Date()
        const ymdh = `${date.getFullYear()}${(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)}${date.getDate()}${date.getHours()}`
        localStorage.setItem('previewData', JSON.stringify(this.state.list))
        window.open(`http://devjiaoxueapi.yanuojiaoyu.com/api/download/show_paperinfo?paper_id=${this.state.paper_id}&token=${Md5(ymdh)}`)
    }
    collect = () => {
        if (this.state.list.length === 0) {
            message.warning('请先选择试卷')
            return
        }
        this.setState({
            visible3: true
        })
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
                    title='添加到我的资源文件夹'
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
                <Select selectonChange={this.selectonChange} data={JSON.parse(localStorage.getItem('default_subject_list'))} value={this.state.selectValue}></Select>
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

                <Tabs defaultActiveKey="2" size="Default" onTabClick={this.spin} onChange={this.onTabClick}>
                    <TabPane tab="知识点" key="1" className="m-tk" >

                    </TabPane>
                    <TabPane tab="真题试卷" key="2" >
                        <div className="knowlage" style={{ justifyContent: 'start' }}>
                            <div className="tree" >
                                <Know bck={this.state.bck} changePage={this.changePage} params={this.state.params} listView={this.listView} listView2={this.listView2}></Know>
                            </div>
                            <div style={{ width: '100%' }}>
                                <div id='scroll-y' className="list" style={this.state.height > 638 ? { height: 600, width: '100%' } : { height: 400, width: '100%' }}>
                                    <div style={{ width: '100%' }}>
                                        <Searchbtn params={this.state.params} list={this.state.searchList} funt={this.changeSearchId}></Searchbtn>
                                        {/* <Search className="m-bottom" placeholder="试题内容搜索" onSearch={this.keyWord} enterButton /> */}
                                        {/* <div className="m-scroll-list"> */}
                                        <div className='m-flex m-bottom'>
                                            <Button onClick={this.preview}>预览试卷</Button>
                                            <div className='m-left'>
                                                <Button type='primary' onClick={this.collect}>收藏试卷</Button>
                                            </div>
                                        </div>
                                        <List data={this.state.list} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} addQuestoin={this.addQuestoin} moveOrAdd={this.moveOrAdd}></List>
                                        {/* </div> */}
                                        <BackTop target={() => document.getElementById('scroll-y')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="机构私库" key="3" >

                    </TabPane>
                    <TabPane tab="我的题目" key="4">

                    </TabPane>
                </Tabs>
            </div >
        );
    }
}
export default tikuguanli2;