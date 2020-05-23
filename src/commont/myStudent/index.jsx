import React, { Component } from 'react';
import MathJax from 'react-mathjax3'
import { Card, Avatar, BackTop, List, Button, Divider, Select } from 'antd';
import { get_student_by_teacher, get_recommend_collect, get_recommend_collect_question, loginUserList } from '../../axios/http'
const { Meta } = Card;
const { Option } = Select;
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studentList: [],
            shijuanList: [],
            list: [],
            teacherList: [],
            cdKey: false
        }
    }
    componentDidMount() {
        if (localStorage.getItem("permission") === '4' || localStorage.getItem("permission") === '3') {
            get_student_by_teacher({ teacher_employee_id: '' }).then(res => {
                this.setState({
                    studentList: res.data.list
                })
            })
        } else {
            loginUserList().then(res => {
                const list = []
                res.data.list.forEach(res => {
                    if (res.xiaoguanjia_employee_id !== null) {
                        list.push(<Option value={res.xiaoguanjia_employee_id} key={res.id}>{res.name}</Option>)
                    }
                })
                this.setState({
                    teacherList: list
                })
            })
        }
    }
    moveOrAdd = (id) => {

    }
    addQuestoin = (e, id) => {

    }
    deleteQuestoin = (e, id) => {

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
    info = e => {
        get_recommend_collect({ xiaoguanjia_student_id: e }).then(res => {
            this.setState({
                shijuanList: res.data.list,
                cdKey: true,
                list: []
            })
        })
    }
    listView = e => {
        get_recommend_collect_question({ wrong_recommend_collection_id: e }).then(res => {
            this.setState({
                list: res.data.list
            })
        })
    }
    back = () => {
        this.setState({
            cdKey: false
        })
    }
    handleChange = e => {
        get_student_by_teacher({ teacher_employee_id: e }).then(res => {
            this.setState({
                studentList: res.data.list
            })
        })
    }
    render() {
        return (
            <div >
                {this.state.cdKey ?
                    <div>
                        <Button onClick={this.back}>返回</Button>
                        <div className="knowlage">
                            <div className="tree" >
                                <div className='m-know-list'>
                                    <List
                                        style={{ height: 534, width: 280 }}
                                        className="list-hover"
                                        itemLayout="vertical"
                                        dataSource={this.state.shijuanList}
                                        size='small'
                                        renderItem={item => (
                                            <List.Item
                                                onClick={() => this.listView(item.id)}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={require('../../img/shijuan.png')} />}
                                                    description={item.title}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                            <div id='scroll-y' className="list" style={this.state.height > 638 ? { height: 600, width: '100%' } : { height: 400, width: '100%' }}>
                                <div>
                                    {/* <div className='m-flex m-bottom'>
                                        <Button onClick={this.preview}>预览试卷</Button>
                                        <div className='m-left'>
                                            <Button type='primary' onClick={this.collect}>收藏试卷</Button>
                                        </div>
                                    </div> */}
                                    <ListT data={this.state.list} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} addQuestoin={this.addQuestoin} moveOrAdd={this.moveOrAdd}></ListT>
                                    {/* </div> */}
                                    <BackTop target={() => document.getElementById('scroll-y')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        {localStorage.getItem("permission") === '4' || localStorage.getItem("permission") === '3' ?
                            ''
                            :
                            <div className="m-flex">
                                <Select placeholder="请选择老师" style={{ width: 180 }} onChange={this.handleChange} optionFilterProp="children" showSearch>
                                    {this.state.teacherList}
                                </Select>
                            </div>
                        }
                        <div className='m-flex' style={{ maxHeight: 600, overflowY: 'scroll' }}>
                            {this.state.studentList.map(res =>
                                <Card style={{ width: 300, marginTop: 16, marginLeft: 16 }} onClick={() => this.info(res.student_id)} key={res.student_id}>
                                    <Meta
                                        avatar={
                                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                        }
                                        title={res.name}
                                    />
                                </Card>
                            )}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
const ListT = (props) => {
    const total = props.data.map((res, index) =>
        <MathJax.Context
            key={index}
            input='tex'
            onError={(MathJax, error) => {
                console.warn(error);
                console.log("Encountered a MathJax error, re-attempting a typeset!");
                MathJax.Hub.Queue(
                    MathJax.Hub.Typeset()
                );
            }}
            script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"
            options={{
                messageStyle: 'none',
                extensions: ['tex2jax.js'],
                jax: ['input/TeX', 'output/HTML-CSS'],
                tex2jax: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    processEscapes: true,
                },
                TeX: {
                    extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
                }
            }}>
            <div className="listT" onClick={() => { props.fun(res.ques_id) }} >
                <div className="know-name-m" >
                    <span className="know-name">{index + 1 + '、' + res.paper_name}</span>
                    <MathJax.Html html={res.ques_content + res.ques_options} />
                </div>
                <Divider dashed />
                <Knowlage collect={props.collect} paper_name={res.paper_name} moveOrAdd={props.moveOrAdd} id={res.ques_id} ques_number={res.ques_number} ques_difficulty_text={res.ques_difficulty_text} index={index} ques_knowledge_name={res.ques_knowledge_name} btn={props.addQuestoin} btn2={props.deleteQuestoin}></Knowlage>
                <div className={props.appear === res.ques_id ? '' : 'question-active'} >
                    <Divider dashed />
                    <div>
                        <p className="line-shu">答案</p>
                        <MathJax.Html html={res.ques_answer} />

                    </div>
                    <div>
                        <p className="line-shu">解析</p>
                        <MathJax.Html html={res.ques_analysis} />
                    </div>
                </div>
            </div>
        </MathJax.Context>
    )
    return (
        <div>
            {total ? total : ''}
        </div>
    )
}
const Knowlage = (props) => {
    return (
        <div className="shop-btn">
            <div className="know-title-div">
                <p className="know-title">
                    知识点:
                <span>{props.ques_knowledge_name}</span>
                </p>
                <p className="know-title">
                    难度:
                <span>{props.ques_difficulty_text}</span>
                </p>
                <p className="know-title">
                    组卷:
                <span>{props.ques_number}次</span>
                </p>
            </div>
            {/* <div className="m-flex">
                <Button className="z-index" type='primary' onClick={(e) => props.collect(e, props.paper_name, props.id)}>收藏</Button>
                <div className="m-left"></div>
                <Button className="z-index" type={props.moveOrAdd(props.id) ? 'danger' : 'primary'} onClick={props.moveOrAdd(props.id) ? (e) => props.btn2(e, props.id) : (e) => props.btn(e, props.id)}>{props.moveOrAdd(props.id) ? '移除试题篮' : '加入试题篮'}</Button>
            </div> */}
        </div>
    )
}
export default index;