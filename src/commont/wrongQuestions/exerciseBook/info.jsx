import React, { Component, useState, useEffect } from 'react';
import { Tree } from 'antd'
import { get_chapter_list, get_chapter_question } from '../../../axios/http'
import { DownOutlined } from '@ant-design/icons';
import List from './chapterList'
const { TreeNode } = Tree;
class ExerciseBookInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,//新增练习册modal
            treeList: [],
            treeParams: {
                exercise_book_id: localStorage.getItem('infoId'),
                book_chapter_id: '',
                ques_content: ''
            },
            chapter_questionList: [],
            chapter_title: ''
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
            console.log(res)
            this.setState({
                chapter_questionList: res.data.list,
                chapter_title: title
            })
        })
    }
    render() {
        return (
            <div>
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
                        <List data={this.state.chapter_questionList}></List>
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