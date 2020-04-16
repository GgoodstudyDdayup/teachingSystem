import React, { Component, useState, useEffect } from 'react';
import { Tree, Drawer, Button, Modal, Input, Select, message } from 'antd'
import { get_chapter_list, get_chapter_question, create_chapter, edit_chapter } from '../../../axios/http'
import { DownOutlined } from '@ant-design/icons';
import List from './chapterList'
import Editor from './editor'
const { TreeNode } = Tree;
const { Option } = Select
class ExerciseBookInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,//drawer
            visible2: false,//目录
            visible3: false,//章节
            visible4: false,//目录修改
            visible5: false,//章节修改
            treeList: [],
            treeParams: {
                exercise_book_id: localStorage.getItem('infoId'),
                book_chapter_id: '',
                ques_content: ''
            },
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
            editorBook_id: ''
        }
    }
    componentDidMount() {
        get_chapter_list({ exercise_book_id: localStorage.getItem('infoId') }).then(res => {
            this.setState({
                treeList: res.data.list
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
                treeParams
            })
        })
    }
    drawerModal = (e, type) => {
        this.setState({
            visible: true,
            btnChange: type,
            editorDParams: e
        })
    }
    drawerCancel = () => {
        this.setState({
            visible: false,
            btnChange: false
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
                this.setState({
                    visible4: false,
                    chapter_title: editorCparams.chapter
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
            btnChange: true
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
                        <Zjmulu visible2={this.state.visible2} okAddModal={this.okAddModal} treeList={this.state.treeList} cancelAddModal={this.cancelAddModal}></Zjmulu>
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
                    <Editor editorDParams={this.state.editorDParams} btnChange={this.state.btnChange} editorBook_id={this.state.editorBook_id} drawerCancel={this.drawerCancel} get_question={this.get_question}></Editor>
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
                                        <Button type='primary' size='small' onClick={this.editorMulu}>编辑</Button>
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
                        <List data={this.state.chapter_questionList} drawerModal={this.drawerModal} ></List>
                    </div>
                </div>
            </div>
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
export default ExerciseBookInfo;