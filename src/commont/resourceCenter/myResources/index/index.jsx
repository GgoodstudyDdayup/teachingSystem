import React, { Component } from 'react';
import { Tabs, Button, Menu, Dropdown, Icon, Modal, Input, message, Breadcrumb, Tree, Divider } from 'antd';
import { create_directory, get_directory, edit_directory, del_directory, get_directory_file, edit_file, del_directory_file } from '../../../../axios/http'
import Tablelink from './indexlink'
import MathJax from 'react-mathjax3'
const { confirm } = Modal;
const { TabPane } = Tabs;
class Myresources extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indeterminate: false,
            checkAll: false,
            l: '',
            visible: false,
            visible3: false,
            visible4: false,
            ques_list: '',
            title: '',
            value: '',
            reWrite: {
            },
            newWrite: {
            },
            params: {
                name: '',
                parent_id: 0
            },
            params2: {
                resources_file_id: '',
                file_name: '',
            },
            params3: {
                resources_file_id: '',
                file_name: '',
                resources_id: ''
            },
            changeId: '',
            selectedRowKeys: [], // Check here to configure the default column
            Breadcrumb: [],
            tree: []

        }
    }
    onTabClick = (e) => {
        switch (e) {
            case '1':
                this.props.history.push("/main/resourceCenter/myresources/wenjianjia")
                break
            default:
                this.props.history.push("/main/resourceCenter/myresources")
        }
    }
    //初始化数据
    componentDidMount() {
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
            //处理列表数据
            const newData = res.data.list.reduce((item, res) => {
                const ogj = {
                    id: res.id,
                    name: res.name,
                    parent_id: res.parent_id,
                    type_id: res.type_id
                }
                item.push(ogj)
                return item
            }, [])
            this.setState({
                data: newData,
                tree: res.data.list
            })
        })
    }

    searchId = (e) => {
        console.log(e)
        const Breadcrumb = this.state.Breadcrumb
        get_directory_file({ resources_id: e.id }).then(res => {
            Breadcrumb.push(e)
            const newArr = res.data.list.concat(res.data.directory_list)
            this.setState({
                data: newArr,
                visible: false,
                visible2: false,
                changeId: e.id,
                Breadcrumb
            })
        })
    }
    onSelectChange = selectedRowKeys => {
        const data = this.state.data
        //将选择的文件夹汇总(chooseItem)参与和data的id判断
        const chooseItem = selectedRowKeys.reduce((res, item) => {
            data.forEach(element => {
                if (element.key === item) {
                    res.push({ id: element.key, name: element.name })
                }
            });
            return res
        }, [])
        console.log(chooseItem)
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    actionappear = (value, key) => {
        if (key) {
            this.setState({
                l: value
            })
        } else {
            this.setState({
                l: ''
            })
        }
    }

    //删除重命名方法
    showDeleteConfirm = (text) => {
        confirm({
            title: '你确定要删除吗',
            content: `删除数据将会消失`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                del_directory({ resources_id: text.id }).then(res => {
                    if (res.code === 0) {
                        message.success(res.message)
                        get_directory().then(res => {
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
                            const newData = res.data.list.reduce((item, res) => {
                                if (res.children) {
                                    delete res.children
                                }
                                item.push(res)
                                return item
                            }, [])
                            this.setState({
                                data: newData,
                                tree: res.data.list,
                                visible: false,
                                Breadcrumb: []
                            })
                        })
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    showDeleteConfirm2 = (text) => {
        confirm({
            title: '你确定要删除吗',
            content: `删除数据将会消失`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                del_directory_file({ resources_file_id: text.id }).then(res => {
                    if (res.code === 0) {
                        message.success(res.message)
                        get_directory_file({ resources_id: this.state.changeId }).then(res => {
                            const newArr = res.data.list.concat(res.data.directory_list)
                            this.setState({
                                data: newArr,
                                visible: false,
                                visible2: false
                            })
                        })
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    showRwriteConfirm = (type) => {
        if (type === 'file') {
            const params2 = { ...this.state.params2 }
            edit_file(params2).then(res => {
                if (res.code === 0) {
                    message.success(res.message)
                    get_directory_file({ resources_id: this.state.changeId }).then(res => {
                        if (res.data.list.length > 0) {
                            const newArr = res.data.list.concat(res.data.directory_list)
                            this.setState({
                                data: newArr,
                                visible: false,
                                visible2: false
                            })
                        }
                    })
                }
            })
        } else {
            const params = { ...this.state.params }
            if (this.state.title === '新建文件夹') {
                params.parent_id = this.state.changeId
                create_directory(params).then(res => {
                    if (res.code === 0) {
                        message.success(res.message)
                    }
                }).then(() => {
                    get_directory_file({ resources_id: this.state.changeId }).then(res => {
                        const newArr = res.data.list.concat(res.data.directory_list)
                        this.setState({
                            data: newArr,
                            visible: false,
                            visible2: false
                        })
                    })
                })
            } else {
                edit_directory(params).then(res => {
                    if (res.code === 0) {
                        message.success(res.message)
                        get_directory().then(res => {
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
                            const newArr = res.data.list.concat(res.data.directory_list)
                            this.setState({
                                data: newArr,
                                visible: false,
                                visible2: false,
                                tree: res.data.list
                            })
                        })
                    }
                })
            }
        }
    }
    showRwriteCancel = (type) => {
        if (type === 'file') {
            this.setState({
                visible2: false,
            })
            return
        }
        this.setState({
            visible: false,
        })
    }
    showModal = (e) => {
        console.log(e)
        //新建及重命名
        if (e.key) {
            this.setState({
                visible: true,
                value: '',
                title: '新建文件夹',
                titleValue: '请输入新建的文件夹名称',
                params: {
                    parent_id: '',
                    name: ''
                }
            })
        } else {
            this.setState({
                visible: true,
                value: e,
                title: '重命名',
                titleValue: '',
                params: {
                    resources_id: e.id,
                    parent_id: e.parent_id,
                    name: e.name
                }
            })
        }
    }
    showModal2 = (e) => {
        console.log(e)
        this.setState({
            visible2: true,
            params2: {
                resources_file_id: e.id,
                file_name: e.file_name || e.name
            },
            params: {
                resources_id: e.id,
                parent_id: e.parent_id,
                name: e.name
            }
        })
    }
    handleMenuClick = (e) => {
        console.log('click', e);
        switch (e) {
            case 1:
                break
            case 2:
                break
            default:
                this.showModal(e)
                break
        }
    }
    //
    uoloadUrl = () => {
        const props = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text',
            },
            showUploadList: false,//控制上传列表
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传失败`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传成功`);
                }
            },
        }
        return props
    }
    creatfile = (e, type) => {
        const params = { ...this.state.params }
        const params2 = { ...this.state.params2 }
        if (type === 'file') {
            params2.file_name = e.target.value
            this.setState({
                params2
            })
            return
        }
        params.name = e.target.value
        this.setState({
            params
        })
    }
    tabsplic = (e) => {
        const Breadcrumb = this.state.Breadcrumb
        if (e.id === this.state.changeId && Breadcrumb.length > 1) {
            get_directory_file({ resources_id: e.id }).then(res => {
                const newArr = res.data.list.concat(res.data.directory_list)
                this.setState({
                    data: newArr,
                    changeId: e.id
                })
            })
            return
        } else if (e.id === Breadcrumb[0].id) {
            get_directory().then(res => {
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
                const newData = res.data.list.reduce((item, res) => {
                    if (res.children) {
                        delete res.children
                    }
                    item.push(res)
                    return item
                }, [])
                this.setState({
                    data: newData,
                    tree: res.data.list,
                    Breadcrumb: []
                })
            })
        } else {
            get_directory_file({ resources_id: e.id }).then(res => {
                const newBreadCrumb = Breadcrumb.reduce((item, res, index) => {
                    if (e.id === res.id) {
                        item = Breadcrumb.splice(index - 1, Breadcrumb.length - 1)
                    }
                    return item
                }, [])
                const newArr = res.data.list.concat(res.data.directory_list)
                this.setState({
                    data: newArr,
                    visible: false,
                    visible2: false,
                    changeId: e.id,
                    Breadcrumb: newBreadCrumb
                })
            })
        }
    }
    Breadcrumb = (data) => {
        const arr = data.reduce((item, res, index) => {
            item.push(
                <Breadcrumb.Item>
                    <span className="linkTab" onClick={() => this.tabsplic(res)} key={res}>{res.name}</span>
                </Breadcrumb.Item>)
            return item
        }, [])
        return (
            arr
        )
    }
    fileMove = (res) => {
        const params3 = { ...this.state.params3 }
        params3.resources_file_id = res.id
        params3.file_name = res.file_name
        this.setState({
            visible3: true,
            params3
        })
    }
    moveFile = () => {
        const params3 = { ...this.state.params3 }
        edit_file(params3).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                if (this.state.Breadcrumb.length > 0) {
                    get_directory_file({ resources_id: this.state.changeId }).then(res => {
                        const newArr = res.data.list.concat(res.data.directory_list)
                        this.setState({
                            data: newArr,
                        })
                    })
                } else {
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
                        //处理列表数据
                        const newData = res.data.list.reduce((item, res) => {
                            const ogj = {
                                id: res.id,
                                name: res.name,
                                parent_id: res.parent_id,
                                type_id: res.type_id
                            }
                            item.push(ogj)
                            return item
                        }, [])
                        this.setState({
                            data: newData,
                            tree: res.data.list
                        })
                    })
                }
                this.setState({
                    visible3: false
                })
            }
        })
    }
    cancleMoveFile = () => {
        this.setState({
            visible3: false
        })
    }
    onSelect = e => {
        //我选择某个文件夹的时候给目录id赋值
        const params3 = { ...this.state.params3 }
        params3.resources_id = e[0]
        this.setState({
            params3
        })
    }
    questionInfo = (res) => {
        console.log(res)
        const ques_list = (
            <MathJax.Context
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
                <div className="listT" >
                    <div className="know-name-m" >
                        <span className="know-name">{res.paper_name}</span>
                        <MathJax.Html html={res.ques_content + res.ques_options} />
                        <div  >
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
                    <Divider dashed />
                    <div className="shop-btn">
                        <div className="know-title-div">
                            <p className="know-title">
                                知识点:
            <span>{res.ques_knowledge_name}</span>
                            </p>
                            <p className="know-title">
                                难度:
            <span>{res.ques_difficulty_text}</span>
                            </p>
                            <p className="know-title">
                                组卷:
            <span>{res.ques_number}次</span>
                            </p>
                        </div>
                    </div>

                </div>
            </MathJax.Context>
        )
        this.setState({
            ques_list,
            visible4: true
        })
    }
    ques_list = () => {
        this.setState({
            visible4: false
        })
    }
    
    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="3">文件夹</Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    onOk={this.showRwriteConfirm}
                    onCancel={this.showRwriteCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Input value={this.state.params.name} onChange={this.creatfile} placeholder={this.state.titleValue}></Input>
                </Modal>
                <Modal
                    title='重命名'
                    visible={this.state.visible2}
                    onOk={() => this.showRwriteConfirm('file')}
                    onCancel={() => this.showRwriteCancel('file')}
                    okText="确认"
                    cancelText="取消"
                >
                    <Input value={this.state.params2.file_name} onChange={(e) => this.creatfile(e, 'file')} placeholder={this.state.titleValue}></Input>
                </Modal>
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
                        treeData={this.state.tree}
                    />
                </Modal>
                <Modal
                    title='我的试题'
                    visible={this.state.visible4}
                    onOk={this.ques_list}
                    onCancel={this.ques_list}
                    okText="确认"
                    cancelText="取消"
                >
                    {this.state.ques_list}
                </Modal>
                

                <Tabs defaultActiveKey="1" size="Default" onChange={this.onTabClick}>
                    <TabPane tab="文件库" key="1" className="m-tk" >
                        <div style={{ display: 'flex' }}>
                            {/* <Upload {...this.uoloadUrl()}>
                                <Button>
                                    <Icon type="upload" />
                                    上传
                            </Button>
                            </Upload> */}
                            <div style={{ marginLeft: 10 }}>
                                <Dropdown overlay={menu}>
                                    <Button>
                                        新建 <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        <Breadcrumb style={{ marginTop: 10, marginBottom: 10 }} >
                            {this.Breadcrumb(this.state.Breadcrumb)}
                        </Breadcrumb>
                        <Tablelink questionInfo={this.questionInfo} fileMove={this.fileMove} showModal={this.showModal} showModal2={this.showModal2} showDeleteConfirm={this.showDeleteConfirm} showDeleteConfirm2={this.showDeleteConfirm2} actionappear={this.actionappear} l={this.state.l} data={this.state.data} onSelectChange={this.onSelectChange} selectedRowKeys={this.state.selectedRowKeys} searchId={this.searchId}></Tablelink>
                    </TabPane>
                    <TabPane tab="我的题目" key="2" >
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default Myresources;