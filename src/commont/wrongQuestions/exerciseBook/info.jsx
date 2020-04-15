import React, { Component } from 'react';
import { Tree, Drawer } from 'antd'
import { get_chapter_list, get_chapter_question } from '../../../axios/http'
import { DownOutlined } from '@ant-design/icons';
import List from './chapterList'
import Editor from './editor'
const { TreeNode } = Tree;
class ExerciseBookInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,//drawer
            treeList: [],
            treeParams: {
                exercise_book_id: localStorage.getItem('infoId'),
                book_chapter_id: '',
                ques_content: ''
            },
            chapter_questionList: [],
            chapter_title: '',
            btnChange:false//修改和添加的判断
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
    }
    chapter_question = (e, title) => {
        const treeParams = { ...this.state.treeParams }
        treeParams.book_chapter_id = e
        get_chapter_question(treeParams).then(res => {
            this.setState({
                chapter_questionList: res.data.list,
                chapter_title: title
            })
        })
    }
    drawerModal = (...e) => {
        this.setState({
            visible: true,
            btnChange:e[4]
        })
    }
    drawerCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        return (
            <div>
                <Drawer
                    title={this.state.btnChange?'添加练习册试题':'修改练习册试题'}
                    placement="right"
                    width={720}
                    closable={false}
                    onClose={this.drawerCancel}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Editor btnChange={this.state.btnChange}></Editor>
                </Drawer>
                <div className="m-flex" style={{ flexWrap: 'nowrap', marginTop: 20 }}>
                    <div className="tree" style={this.state.height > 638 ? { maxHeight: 600, overflowY: 'scroll', width: 370 } : { maxHeight: 400, overflowY: 'scroll', width: 370 }}>
                        <ZjTree treeList={this.state.treeList} chapter_question={this.chapter_question}></ZjTree>
                    </div>
                    <div style={{ width: '100%' }}>
                        <div className='paper-hd-title' style={{ background: '#fff', flex: 1 }} >
                            <h3>{this.state.chapter_title}</h3>
                        </div>
                        {/* <div className="paper-hd-title " style={{ width: '100%', textAlign: 'start', background: '#fff', flex: 1, display: 'flex', justifyContent: 'center' }} >
                            <p>***********</p>
                        </div> */}
                        <List data={this.state.chapter_questionList} drawerModal={this.drawerModal}></List>
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
                        {res.children.map(l1 =>
                            <TreeNode title={l1.chapter} key={l1.id}>
                            </TreeNode>
                        )}
                    </TreeNode>
                )}
            </Tree>
        </div>
    )
}
export default ExerciseBookInfo;