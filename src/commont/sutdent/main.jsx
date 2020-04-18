import React, { Component } from 'react';
import { Route, Link, Switch, withRouter } from 'react-router-dom'
import { Layout, Menu, Icon, Avatar, Dropdown, message, Modal, Input, Select } from 'antd';
import { logout, change_password_byself } from '../../axios/http'
import { LogoutOutlined, EditTwoTone, RadarChartOutlined } from '@ant-design/icons'
import ErrorSet from './errorSet/index'
import Form from './reportForm/index'
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Option } = Select
class main extends Component {
    constructor(opt) {
        super(opt)
        this.state = {
            height: '',
            collapsed: false,
            visible: false,
            newPassword: '',
            oldPassword: '',
            company_list: JSON.parse(localStorage.getItem('company_list')),
            company_name: localStorage.getItem('company')
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
        localStorage.setItem('enter', '')
        const children = this.state.company_list.map((res, index) => {
            return <Option key={res.company} value={res.company} >{res.company}</Option>
        })
        this.setState({
            children
        })
    }
    componentWillUnmount() {
        // 移除监听事件

        window.removeEventListener('resize', this.handleSize);

    }
    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            height: document.body.clientHeight,
        });
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    handleClick = (e) => {
    }
    logOut = () => {
        logout().then(res => {
            console.log(res)
            localStorage.setItem("token", '')
            localStorage.setItem("username", '')
            localStorage.setItem("student_id", '')
            this.props.history.replace("/studentMain")
            localStorage.setItem('enter', '')
            message.success(res.data.message)
        })
    }
    editOwnPassWord = () => {
        const params = {
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword
        }
        change_password_byself(params).then(res => {
            if (res.code === 0) {
                message.success('修改成功')
                this.setState({
                    visible: false,
                    newPassword: '',
                    oldPassword: ''
                })
            } else {
                message.error('修改失败')
            }
        })
    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    cancel = () => {
        this.setState({
            visible: false,
            newPassword: '',
            oldPassword: ''
        })
    }
    changePassword = (e, type) => {
        if (type === 'newPassword') {
            this.setState({
                newPassword: e.target.value
            })
        } else {
            this.setState({
                oldPassword: e.target.value
            })
        }
    }
    selsectCompany = e => {
        const company_list = this.state.company_list
        if (e) {
            company_list.forEach((res) => {
                if (res.company === e) {
                    localStorage.setItem('company_id', res.company_id)
                    localStorage.setItem('company', res.company)
                    window.location.reload()
                }
            })
            this.setState({
                company_name: e
            })
        }
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item onClick={this.showModal}>
                    <EditTwoTone />修改密码
                </Menu.Item>
                <Menu.Item onClick={this.logOut}>
                    <LogoutOutlined twoToneColor='#f40' />退出登录
                </Menu.Item>
            </Menu>
        )
        return (
            <Layout style={{ height: this.state.height }}>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logoicon">
                    </div>
                    <Menu onClick={this.handleClick} mode="vertical" theme="dark">

                        <SubMenu
                            key="sub22"
                            title={
                                <span>
                                    <RadarChartOutlined />
                                    <span>错题管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="226">
                                <Link to='/studentMain/reportForm'>小亚报表</Link>
                            </Menu.Item>
                            <Menu.Item key="225">
                                <Link to='/studentMain'>小亚错题集</Link>
                            </Menu.Item>
                        </SubMenu>

                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            {localStorage.getItem("permission") === '1' || localStorage.getItem("permission") === '2' ?
                                <span>
                                    <Select style={{ width: 170 }} showSearch optionFilterProp="children" onChange={this.selsectCompany} value={this.state.company_name} placeholder="请选择校区" >
                                        {this.state.children}
                                    </Select>
                                    <span style={{ marginLeft: 10 }}>教学系统</span>
                                    <span style={{ fontSize: 8, marginLeft: 10 }}>V 2.1.0</span>
                                </span>
                                :
                                <span>
                                    {this.state.company_name}教学系统
                                    <span style={{ fontSize: 10, marginLeft: 10 }}>V 2.1.0</span>
                                </span>
                            }
                        </div>
                        <div className="m-flex" style={{ alignItems: 'center', justifyContent: 'space-between', marginRight: 50 }}>
                            <Avatar style={{ backgroundColor: '#87d068' }} icon="user"></Avatar>
                            <div style={{ width: 30 }}></div>
                            <Dropdown overlay={menu}>
                                <div>
                                    {localStorage.getItem('username')}
                                </div>
                            </Dropdown>
                            <Modal
                                title="修改密码"
                                cancelText='取消'
                                okText='确认'
                                visible={this.state.visible}
                                onOk={this.editOwnPassWord}
                                onCancel={this.cancel}
                            >
                                <div className="m-flex m-bottom" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="m-row">
                                        老密码：
                                    </div>
                                    <Input value={this.state.oldPassword} placeholder='请输入老密码' onChange={(e) => this.changePassword(e, 'oldPassword')}></Input>
                                </div>
                                <div className="m-flex m-bottom" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="m-row">
                                        新密码：
                                    </div>
                                    <Input value={this.state.newPassword} placeholder='请输入新密码' onChange={(e) => this.changePassword(e, 'newPassword')}></Input>
                                </div>
                            </Modal>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                        className={this.props.location.pathname === '/main/zujuan' || this.props.location.pathname === '/main/wrongQuestion/reportForm' ? 'conntent-none' : ''}
                    >
                        <Switch>
                            {/* 错题管理 */}
                            <Route path="/studentMain" exact component={ErrorSet} />
                            <Route path="/studentMain/reportForm" component={Form} />
                            
                        </Switch>

                    </Content>


                </Layout>

            </Layout >

        );
    }
}
export default withRouter(main) 