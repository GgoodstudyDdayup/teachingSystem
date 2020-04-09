import React, { Component } from 'react';
import { Route, Link, Switch, withRouter } from 'react-router-dom'
import { Layout, Menu, Icon, Avatar, Dropdown, message, Modal, Input, Select } from 'antd';
import { logout, change_password_byself } from '../axios/http'
import { LogoutOutlined, EditTwoTone, SlidersOutlined, RadarChartOutlined } from '@ant-design/icons'
import Tk from './tk/index'
import Tksystem from './tk/index2'
import Tkown from './tk/index3'
import Tkmine from './tk/index4'
import Zujuan from './zujuan/zujuan'
import Recommended from './resourceCenter/recommended/index/index'
import RecommendedReal from './resourceCenter/recommended/real/real'
import RecommendedShare from './resourceCenter/recommended/share/share'
import RecommendedJigousiku from './resourceCenter/recommended/jigousiku/jigousiku'
// import Myresources from './resourceCenter/myResources/index/index'
// import MyresourcesWenjianjia from './resourceCenter/myResources/wenjianku/wenjianku'
import Myzujuan from './resourceCenter/myResources/zujuanList/index'
import BK from './bk/bk'
import Prograss from './bk/prograss'
import Kj from './bk/kejian'
import Quanxian from './quanxian/quanxian'
import Jiaoyanzu from './quanxian/jiaoyanzuquanxian'
import CP from './cp'
import ZY from './zy'
import Tkquestion from './tk/braftEditor'
import Test from '../commont/tset/test'
import Zj from './zhangjie'
import ErrorSet from './wrongQuestions/errorSet/index'
import ExerciseBook from './wrongQuestions/exerciseBook/index'
import ReportForm from './wrongQuestions/reportForm/index'
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
            company_list: JSON.parse(sessionStorage.getItem('company_list')),
            company_name: sessionStorage.getItem('company')
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleSize);
        this.handleSize()
        sessionStorage.setItem('enter', '')
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
            sessionStorage.setItem("token", '')
            sessionStorage.setItem("username", '')
            sessionStorage.setItem("teacher_type", '')
            sessionStorage.setItem("permission", '')
            this.props.history.replace("/")
            sessionStorage.setItem('enter', '')
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
                    sessionStorage.setItem('company_id', res.company_id)
                    sessionStorage.setItem('company', res.company)
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
                        {/* <SubMenu
                            key=""
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>测评系统</span>
                                </span>
                            }
                        >
                        </SubMenu> */}
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>题库管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="1">
                                <Link to="/main">知识点</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/main/tk/system">真题试卷</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/main/tk/own">机构私库</Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to="/main/tk/mine">我的题目</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <Icon type="appstore" />
                                    <span>备课管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="5">
                                <Link to="/main/bk">课程表</Link></Menu.Item>
                            <Menu.Item key="6">
                                <Link to="/main/bk/prograss">审核进度</Link>
                            </Menu.Item>
                            {sessionStorage.getItem('teacher_type') === '4' ? '' : <Menu.Item key="7">
                                <Link to="/main/bk/kejian">组卷审核</Link>
                            </Menu.Item>}
                        </SubMenu>
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
                                <Link to='/main/wrongQuestion/reportForm'>小亚报表</Link>
                            </Menu.Item>
                            <Menu.Item key="225">
                                <Link to='/main/wrongQuestion/errorSet'>小亚错题集</Link>
                            </Menu.Item>
                            <Menu.Item key="227">
                                <Link to='/main/wrongQuestion/exerciseBook'>小亚练习册</Link>
                            </Menu.Item>
                        </SubMenu>
                        {/* <SubMenu
                            key="55"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>授课系统</span>
                                </span>
                            }
                        >
                        </SubMenu>
                        <SubMenu
                            key="44"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>课后练习</span>
                                </span>
                            }
                        >
                        </SubMenu>
                        <SubMenu
                            key="33"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>自适应训练</span>
                                </span>
                            }
                        >
                        </SubMenu>
                        <SubMenu
                            key="22"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>资源管理</span>
                                </span>
                            }
                        >
                        </SubMenu>
                        <SubMenu
                            key="ss"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>REP行为</span>
                                </span>
                            }
                        >
                        </SubMenu> */}
                        {/* <SubMenu
                            key="sub4"
                            title={
                                <span>
                                    <Icon type="setting" />
                                    <span>作业管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="7">Option 9</Menu.Item>
                            <Menu.Item key="8">Option 10</Menu.Item>
                            <Menu.Item key="9">Option 11</Menu.Item>
                            <Menu.Item key="10">Option 12</Menu.Item>
                        </SubMenu> */}
                        <SubMenu
                            key="sub6"
                            title={
                                <span>
                                    <SlidersOutlined />
                                    <span>资源管理</span>
                                </span>
                            }
                        >
                            {/* <Menu.Item key="13">
                                <Link to="/main/resourceCenter/recommended">推荐资源</Link>
                            </Menu.Item> */}
                            <Menu.Item key="14">
                                <Link to="/main/resourceCenter/zj">我的资源</Link>
                            </Menu.Item>
                            <Menu.Item key="15">
                                <Link to="/main/zhangjie">章节知识点关联</Link>
                            </Menu.Item>
                        </SubMenu>
                        {sessionStorage.getItem("permission") === '1' || sessionStorage.getItem("permission") === '2' ? <SubMenu
                            key="sub5"
                            title={
                                <span>
                                    <Icon type="setting" />
                                    <span>权限管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="11">
                                <Link to="/main/quanxian">权限分配</Link>
                            </Menu.Item>
                            <Menu.Item key="12">
                                <Link to="/main/jiaoyanzu">教研组</Link>
                            </Menu.Item>
                        </SubMenu> : ''}


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
                            {sessionStorage.getItem("permission") === '1' || sessionStorage.getItem("permission") === '2' ?
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
                                    {sessionStorage.getItem('username')}
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
                            {/* 题库管理 */}
                            <Route path='/main' exact component={Tk} />
                            <Route path="/main/tk/system" component={Tksystem} />
                            <Route path="/main/tk/own" component={Tkown} />
                            <Route path="/main/tk/mine" component={Tkmine} />
                            <Route path="/main/question" component={Tkquestion} />
                            <Route path="/main/test" component={Test} />

                            {/* 资源中心的推荐资源 */}
                            <Route path="/main/resourceCenter/recommended" exact component={Recommended}></Route>
                            <Route path="/main/resourceCenter/recommended/jigousiku" component={RecommendedJigousiku}></Route>
                            <Route path="/main/resourceCenter/recommended/share" component={RecommendedShare}></Route>
                            <Route path="/main/resourceCenter/recommended/real" component={RecommendedReal}></Route>
                            <Route path="/main/zhangjie" component={Zj}></Route>
                            {/* 资源中心的我的资源 */}
                            {/* <Route path="/main/resourceCenter/myresources/wenjianjia" exact component={Myresources}></Route> */}
                            {/* <Route path="/main/resourceCenter/myresources" component={MyresourcesWenjianjia}></Route> */}
                            <Route path="/main/resourceCenter/zj" component={Myzujuan}></Route>

                            <Route path="/main/bk" exact component={BK} />
                            <Route path="/main/bk/prograss" component={Prograss} />
                            <Route path="/main/bk/kejian" component={Kj} />
                            <Route path="/main/quanxian" component={Quanxian} />
                            <Route path="/main/jiaoyanzu" component={Jiaoyanzu} />
                            {/* 错题管理 */}
                            <Route path="/main/wrongQuestion/errorSet" component={ErrorSet} />
                            <Route path="/main/wrongQuestion/exerciseBook" component={ExerciseBook} />



                            <Route path="/main/zy" component={ZY} />
                            <Route path="/main/cp" component={CP} />
                        </Switch>

                    </Content>
                    <div style={{ padding: 24, minHeight: 280 }} className={this.props.location.pathname === '/main/zujuan' ? '' : 'conntent-none'}>
                        <Route path="/main/zujuan" component={Zujuan} />
                    </div>
                    <div style={{ padding: 24, minHeight: 280 }} className={this.props.location.pathname === '/main/wrongQuestion/reportForm' ? '' : 'conntent-none'}>
                        <Route path="/main/wrongQuestion/reportForm" component={ReportForm} />
                        
                    </div>

                </Layout>
                
            </Layout >

        );
    }
}
export default withRouter(main) 