import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Input, Button, message, Modal, Select, Radio, Result } from 'antd';
import SetMain from './tixinSet'
import MathJax from 'react-mathjax3'
import { set_pager_config, get_next_cart, set_ques_type_sort, set_ques_sort, set_show_type_name, remove_question_type, set_pager_score, get_own_subject_list, get_grade_list, set_self_pager, remove_question_cart } from '../../axios/http'
import List from './zujuanList'
const { Option } = Select;
const { TextArea } = Input;
// 重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const grid = 8;
// 设置样式
const getItemStyle = (isDragging, draggableStyle) => {
    const style = {
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // 拖拽的时候背景变化
        background: isDragging ? "lightgreen" : "#fff",
        border: '1px solid #eee',
        // styles we need to apply on draggables
        ...draggableStyle,
        textAlign: 'start',
        justifyContent: 'space-between',
        display: 'flex'
    }
    return (
        style
    )
}
const getListStyle = () => ({
    background: 'white',
    padding: grid,
    width: '100%'
});
export default class ReactBeautifulDnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    //拖拽过后的钩子设置每个类里面题目的排序
    onDragEnd(result) {
        const list = this.state.list
        if (!result.destination) {
            return;
        }
        //告诉钩子是哪一个类里面的列表拖拽
        let newList = ''
        list.forEach(res => {
            if (res.id === result.destination.droppableId) {
                newList = res.ques_list
            }
        })
        const items = reorder(
            newList,
            result.source.index,
            result.destination.index
        )
        //告诉list你需要改变那个ques_list
        let ques_ids_sort = ''
        items.forEach(res => {
            ques_ids_sort += res.ques_id + ','
        })
        set_ques_sort({ ques_type_id: this.state.paixuIndex, ques_ids_sort: ques_ids_sort }).then(res => {
            if (res.code === 0) {
                get_next_cart().then(res => {
                    this.setState({
                        list: res.data.list
                    })
                })
            } else {
                message.warning('系统繁忙请稍后再试~~~')
            }
        })

    }
    //这是设置类型排序的异步请求
    setItem = (data) => {
        let type_sort = ''
        data.forEach(res => {
            type_sort += res.ques_type_id + ','
        })
        set_ques_type_sort({ ques_type_ids_sort: type_sort }).then(res => {
            if (res.code === 0) {
                get_next_cart().then(res => {
                    this.setState({
                        list: res.data.list
                    })
                })
            } else {
                message.warning('系统繁忙请稍后再试~~~')
            }
        })
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
        get_next_cart().then(res => {
            if (res.data.pager_config === null) {
                this.setState({
                    zujuanAppear: true
                })
            }
            const scorePublic = res.data.list.reduce((item, res) => {
                item.push({
                    ques_type_id: res.ques_type_id,
                    total_score: res.ques_score
                })
                return item
            }, [])
            const totalNum = scorePublic.reduce((item, res) => {
                item += Number(res.total_score)
                return item
            }, 0)
            //scorePublic是类型的总分集合
            if (res.data.pager_config) {
                this.setState({
                    biaotiTitle: res.data.pager_config.title ? res.data.pager_config.title : '点击修改试卷标题',
                    datiTime: res.data.pager_config.total_minute
                })
            }
            this.setState({
                list: res.data.list,
                scorePublic,
                totalNum,
                previewData: res.data
            })
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
    actiondatiTime = () => {
        const datiTime = this.state.datiTime
        set_pager_config({ field_name: 'total_minute', field_value: datiTime }).then(res => {
            if (res.code === 0) {
                get_next_cart().then(res => {
                    if (res.data.pager_config === null) {
                        this.setState({
                            zujuanAppear: true
                        })
                    }
                    const scorePublic = res.data.list.reduce((item, res) => {
                        item.push({
                            ques_type_id: res.ques_type_id,
                            total_score: res.ques_score
                        })
                        return item
                    }, [])
                    const totalNum = scorePublic.reduce((item, res) => {
                        item += Number(res.total_score)
                        return item
                    }, 0)
                    //scorePublic是类型的总分集合
                    if (res.data.pager_config) {
                        this.setState({
                            biaotiTitle: res.data.pager_config.title ? res.data.pager_config.title : '点击修改试卷标题',
                            datiTime: res.data.pager_config.total_minute
                        })
                    }
                    this.setState({
                        list: res.data.list,
                        scorePublic,
                        totalNum,
                        previewData: res.data
                    })
                })
            }
        })
    }
    actionbiaotiTitle = () => {
        const biaotiTitle = this.state.biaotiTitle
        set_pager_config({ field_name: 'title', field_value: biaotiTitle }).then(res => {
            console.log(res)
            if (res.code === 0) {
                get_next_cart().then(res => {
                    if (res.data.pager_config === null) {
                        this.setState({
                            zujuanAppear: true
                        })
                    }
                    const scorePublic = res.data.list.reduce((item, res) => {
                        item.push({
                            ques_type_id: res.ques_type_id,
                            total_score: res.ques_score
                        })
                        return item
                    }, [])
                    const totalNum = scorePublic.reduce((item, res) => {
                        item += Number(res.total_score)
                        return item
                    }, 0)
                    //scorePublic是类型的总分集合
                    if (res.data.pager_config) {
                        this.setState({
                            biaotiTitle: res.data.pager_config.title ? res.data.pager_config.title : '点击修改试卷标题',
                            datiTime: res.data.pager_config.total_minute
                        })
                    }
                    this.setState({
                        list: res.data.list,
                        scorePublic,
                        totalNum,
                        previewData: res.data
                    })
                })
            }
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
    //确认的时候修改的名字后我要发送一个请求
    sureInputDefault = (id) => {
        set_show_type_name({ ques_type_id: id, show_type_name: this.state.editInput }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_next_cart().then(res => {
                    this.setState({
                        list: res.data.list
                    })
                })
            } else {
                message.error(res.message)
            }
        })
    }
    //删除一个类
    deleteTlei = (id) => {
        remove_question_type({ ques_type_id: id }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
            } else {
                message.error(res.message)
            }
        }).then(() => {
            get_next_cart().then(res => {
                this.setState({
                    list: res.data.list
                })
            })
        })
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    };
    //用于设置分值
    handleOk = e => {
        const scorePublic = this.state.scorePublic
        if (!this.state.warning) {
            message.warning('分值必须为题目数量的N倍')
            return
        }
        set_pager_score({ score_json: JSON.stringify(scorePublic) }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                //scorePublic是类型的总分集合
                this.setState({
                    visible: false
                })
            } else {
                message.error(res.message)
                this.setState({
                    visible: false,
                });
            }
        }).then(() => {
            get_next_cart().then(res => {
                const scorePublic = res.data.list.reduce((item, res) => {
                    item.push({
                        ques_type_id: res.ques_type_id,
                        total_score: res.ques_score
                    })
                    return item
                }, [])
                const totalNum = scorePublic.reduce((item, res) => {
                    item += Number(res.total_score)
                    return item
                }, 0)
                //scorePublic是类型的总分集合
                this.setState({
                    list: res.data.list,
                    scorePublic,
                    totalNum
                })
            })
        })

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
    deleteQuestoin = (e, id) => {
        e.stopPropagation()
        remove_question_cart({ ques_id: id }).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                get_next_cart().then(res => {
                    const scorePublic = res.data.list.reduce((item, res) => {
                        item.push({
                            ques_type_id: res.ques_type_id,
                            total_score: res.ques_score
                        })
                        return item
                    }, [])
                    const totalNum = scorePublic.reduce((item, res) => {
                        item += Number(res.total_score)
                        return item
                    }, 0)
                    //scorePublic是类型的总分集合
                    this.setState({
                        list: res.data.list,
                        scorePublic,
                        totalNum
                    })
                })
            } else {
                message.error(res.message)
            }
        })
    }
    //试卷提交
    sjAction = () => {
        const biaotiTitle = this.state.biaotiTitle
        const datiTime = this.state.datiTime
        const saveFile = this.state.saveFile
        saveFile.title = biaotiTitle
        saveFile.total_minute = datiTime
        console.log(this.state.totalNum)
        if (biaotiTitle === '点击修改试卷标题' || datiTime === '' || this.state.totalNum === 0) {
            message.warning('请检查标题、考试时间、分值设置')
        } else {
            set_self_pager(saveFile).then(res => {
                if (res.code === 0) {
                    message.success(res.message)
                    this.setState({
                        visible2: false,
                        saveFile: {
                            grade_id: '',
                            title: '',
                            total_minute: '',
                            remark: '',
                            own_subject_id: '',
                            difficulty_id: '',
                            is_open: ''
                        },
                        subjectValue: '',
                        grandValue: ''
                    });
                    setTimeout(() => {
                        this.props.history.push('/main')
                    }, 2000);

                } else {
                    message.error(res.message)
                }
            })
        }

    }
    sjCancel = (e) => {
        this.setState({
            visible2: false,
            saveFile: {
                grade_id: '',
                title: '',
                total_minute: '',
                remark: '',
                own_subject_id: '',
                difficulty_id: '',
                is_open: ''
            },
            subjectValue: '',
            grandValue: ''
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
        sessionStorage.setItem('previewData', JSON.stringify(this.state.previewData))
        window.open('/#/setPreview')
    }
    render() {
        return (
            <div>
                {this.state.zujuanAppear ? <Result
                    title="请先添加试题快去添加吧~~"
                    extra={
                        <Button type="primary" key="console" onClick={() => this.props.history.go(-1)}>
                            添加试题
                        </Button>
                    }
                /> : <div id="m-zujuan" style={{ background: '#F5F5F5', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <Modal
                            title="试卷保存设置"
                            cancelText='取消'
                            okText='确认'
                            visible={this.state.visible2}
                            onOk={this.sjAction}
                            onCancel={this.sjCancel}
                        >
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                <span className="m-row" style={{ textAlign: 'right' }}>学科：</span>
                                <Select style={{ width: '75%' }} showSearch optionFilterProp="children" onChange={this.selsectSubject} value={this.state.subjectValue} placeholder="请选择学科">
                                    {this.state.subjectchildren}
                                </Select>
                            </div>
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                <span className="m-row" style={{ textAlign: 'right' }}>年级：</span>
                                <Select style={{ width: '75%' }} showSearch optionFilterProp="children" onChange={this.selsectGrand} value={this.state.grandValue} placeholder="请选择年级">
                                    {this.state.grandchildren}
                                </Select>
                            </div>
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                <span className="m-row" style={{ textAlign: 'right' }}>难度：</span>
                                <Radio.Group onChange={(e) => this.onChangeState(e, 'difficulty')} value={this.state.saveFile.difficulty_id}>
                                    <Radio value={1}>简单</Radio>
                                    <Radio value={2}>中等</Radio>
                                    <Radio value={3}>困难</Radio>
                                </Radio.Group>
                            </div>
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                <span className="m-row" style={{ textAlign: 'right' }}>公开状态：</span>
                                <Radio.Group onChange={(e) => this.onChangeState(e, 'is_open')} value={this.state.saveFile.is_open}>
                                    <Radio value={1}>公开试卷</Radio>
                                    <Radio value={-1}>我的试卷</Radio>
                                </Radio.Group>
                            </div>
                            <div className="m-flex m-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                                <span style={{ textAlign: 'right', display: 'inline-block', width: 130 }}>备注：</span>
                                <TextArea value={this.state.saveFile.remark} rows={4} onChange={this.changeTextA} />
                            </div>
                        </Modal>
                        <div style={{ width: '80%', marginRight: 20 }}>
                            <div className="paper-hd-ctrl">
                                <Button type="dashed" onClick={() => this.tixinSet(1)}>题型设置</Button>
                                <Button className="m-left" onClick={this.addQuestion}>添加试题</Button>
                                <Button className="m-left" type='primary' onClick={this.preview}>预览试卷</Button>
                                <Button className="m-left" type="primary" onClick={this.next}>下一步</Button>
                            </div>

                            <div className={this.state.setIndex === 3 ? "paper-hd-title paper-hd-title-active " : 'paper-hd-title active'} style={{ background: '#fff', flex: 1 }} onClick={() => this.changeSetIndex(3)}>
                                <h3>{this.state.biaotiTitle}</h3>
                            </div>
                            <div className={this.state.setIndex === 2 ? "paper-hd-title paper-hd-title-active " : 'paper-hd-title active'} style={{ width: '100%', textAlign: 'start', background: '#fff', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => this.changeSetIndex(2)}>
                                <div className="set-item" >总分：<span>{this.state.totalNum}分</span></div>
                                <div className="set-item">答题时间：<span>{this.state.datiTime}</span>分钟</div>
                                <div className="set-item" >日期：<span className="line"></span></div>
                                <div className="set-item">班级：<span className="line"></span></div>
                                <div className="set-item">姓名：<span className="line"></span></div>
                            </div>
                            {this.state.tixinSet === 1 ? <SetMain suerEditInput={this.suerEditInput} editInput={this.state.editInput} tixinSet={this.tixinSet} data={this.state.list} setItem={this.setItem} sureInputDefault={this.sureInputDefault} deleteTlei={this.deleteTlei} changeInputDefault={this.changeInputDefault}></SetMain> : <div>
                                {this.state.list.map((res, index) =>
                                    <div className="m-zijuan-flex" key={index}>
                                        {this.state.paixuIndex === res.ques_type_id ? <DragDropContext onDragEnd={this.onDragEnd}>
                                            <center style={{ width: '100%', textAlign: 'start' }}>
                                                <Droppable droppableId={res.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            //provided.droppableProps应用的相同元素.
                                                            {...provided.droppableProps}
                                                            // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                                                            ref={provided.innerRef}
                                                            style={getListStyle(snapshot)}
                                                        >
                                                            <div className="leixing-title">
                                                                {res.show_type_name}
                                                                <div className='m-shoudongpaixu' onClick={() => this.paixuIndex(0)}>确认</div>
                                                            </div>
                                                            {res.ques_list.map((item, index) => (
                                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}

                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided.draggableProps.style
                                                                            )}
                                                                        >

                                                                            <div className="know-name-m">
                                                                                <span className="know-ques">
                                                                                    <MathJax.Context
                                                                                        key={index}
                                                                                        input='tex'
                                                                                        onError={(MathJax, error) => {
                                                                                            console.warn(error);
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
                                                                                        <MathJax.Html html={item.ques_content} />
                                                                                    </MathJax.Context>
                                                                                </span>
                                                                            </div>
                                                                            {/* <div className="zujuan-m">
                                                                        <span style={{ width: 100, display: 'inline-block' }}>分值：</span>
                                                                        <Input className="zujuan-m-item-input" defaultValue="0571" onChange={(e, index) => changeValue(e, index)} />
                                                                    </div> */}
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </center>
                                        </DragDropContext> :
                                            <div style={{ width: '100%', background: '#fff', padding: 8 }}>
                                                <div className="leixing-title" onMouseEnter={() => this.mouseEnter(res.ques_type_id)} onMouseLeave={() => this.mouseOut()}>
                                                    {res.show_type_name}
                                                    <div className={this.state.appearPaixu === res.ques_type_id ? 'm-shoudongpaixu' : 'm-none'} onClick={() => this.paixuIndex(res.ques_type_id)}>手动排序</div>
                                                </div>
                                                <List data={res.ques_list} fun={this.add} deleteQuestoin={this.deleteQuestoin} appear={this.state.appear} key={index}>
                                                </List>
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>}
                        </div>
                        <div className="m-right-action">
                            <div className="m-zujuanAction">
                                <div className="m-zujuanAction-content" style={{ marginBottom: 20 }}>
                                    <div>
                                        <div className="hd" style={{ cursor: 'pointer' }} onClick={() => this.changeSetIndex(1)}>
                                            <i className="hd-icon iconfont icon-atf-ykt-yincangtixingfenbu"></i>
                                            <span className="hd-title">试卷结构</span>
                                        </div>
                                        {this.state.setIndex === 1 ? <div className="bd">
                                            <div className="structure-header">
                                                <div>总分：{this.state.totalNum}分<span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }} onClick={this.showModal}>设置分值</span></div>
                                                <Modal
                                                    title='分数设置'
                                                    cancelText='取消'
                                                    okText='确认'
                                                    visible={this.state.visible}
                                                    onOk={this.handleOk}
                                                    onCancel={this.handleCancel}
                                                >
                                                    <p style={{ color: '#f40' }}>分值必须为题目数量的N倍~~</p>
                                                    {this.state.list.map((res, index) =>
                                                        <div key={index} className="m-flex m-bottom" style={{ justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dfdfdf', boxSizing: 'border-box', paddingBottom: 5 }}>
                                                            <div className="m-row">
                                                                {res.ques_type_name}
                                                            </div>
                                                            <div>数量:{res.ques_num}</div>
                                                            <Input onBlur={(e) => this.changeonBlur(e, res.ques_num)} value={this.state.scorePublic[index].total_score} style={{ width: 100 }} placeholder={`${res.ques_type_name}分值`} onChange={(e) => this.changeTotalNum(e, res.ques_type_id, res.ques_num)}></Input>
                                                        </div>
                                                    )}
                                                </Modal>
                                            </div>
                                            {this.state.list.map((res, index) =>
                                                <div className="structure-panel" key={index}>
                                                    <div className="structure-hd">
                                                        <span>{res.show_type_name}</span>
                                                    </div>
                                                    <div className="structure-bd">
                                                        {res.ques_list.map((item, index) =>
                                                            <span className="active" key={index}>{index + 1}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div> : ''}
                                        {this.state.setIndex === 2 ? <div className="m-zujuanAction-content" style={{ marginBottom: 20 }}>
                                            <div >
                                                <div className="hd" style={{ cursor: 'pointer' }}>
                                                    <i className="hd-icon iconfont icon-atf-ykt-yincangtixingfenbu"></i>
                                                    <span className="hd-title">卷头设置</span>
                                                </div>
                                                <div className="bd">
                                                    <div className="m-flex">
                                                        <span>答题时间：</span>
                                                        <Input style={{ width: 120 }} size='small' value={this.state.datiTime} onChange={this.datiTime} onBlur={this.actiondatiTime}></Input>
                                                        <span>分钟</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : ''}
                                        {this.state.setIndex === 3 ? <div className="m-zujuanAction-content" style={{ marginBottom: 20 }}>
                                            <div>
                                                <div className="hd" style={{ cursor: 'pointer' }}>
                                                    <i className="hd-icon iconfont icon-atf-ykt-yincangtixingfenbu"></i>
                                                    <span className="hd-title">试卷标题修改</span>
                                                </div>
                                                <div className="bd " >
                                                    <Input value={this.state.biaotiTitle} onChange={this.biaotiTitle} onBlur={this.actionbiaotiTitle}></Input>
                                                </div>
                                            </div>
                                        </div> : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >}
            </div>

        );
    }
}

