import React, { Component } from 'react';
import { login, get_company_list } from '../axios/http'
import { message } from 'antd'
//定义组件内部私有的状态
class Login extends Component {
    constructor(opt) {
        super(opt)
        //只有在构造函数中可以直接给state进行赋值初始化
        this.state = {
            height: null,
            filter: {
                username: '',
                password: ''
            }
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleSize);
        document.addEventListener('keydown', this.keyDownLogin);
    }
    componentWillUnmount() {
        // 移除监听事件
        window.removeEventListener('resize', this.handleSize);
        window.removeEventListener('keydown', this.keyDownLogin);
    }
    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            height: document.body.clientHeight,
        });
    }
    loginChange = (e) => {
        const filter = this.state.filter
        filter[e.target.name] = e.target.value
        this.setState({
            filter
        })
    }
    login = () => {
        const params = this.state.filter
        login(params).then(res => {
            if (res.data.code === 0) {
                message.success({
                    content: `${res.data.message}`,
                    onClose: () => {
                        sessionStorage.setItem("token", res.data.data.user_info.token)
                        sessionStorage.setItem("username", params.username)
                        sessionStorage.setItem("teacher_type", res.data.data.user_info.teacher_type)
                        sessionStorage.setItem("permission", res.data.data.user_info.permission)
                        if (res.data.data.company_list !== null && res.data.data.company_list.length > 0) {
                            sessionStorage.setItem("company_list", JSON.stringify(res.data.data.company_list))
                            sessionStorage.setItem('company', res.data.data.company_list[0].company)
                            sessionStorage.setItem('company_id', res.data.data.company_list[0].company_id || res.data.data.user_info.company_id)
                            this.props.history.push("/main")
                        } else {
                            get_company_list().then(l1 => {
                                if (l1.code === 0) {
                                    const company_list = l1.data.company_list.reduce((item, rsq) => {
                                        if (res.data.data.user_info.company_id === rsq.id) {
                                            item.push(rsq)
                                        }
                                        return item
                                    }, [])
                                    sessionStorage.setItem("company_list", JSON.stringify(company_list))
                                    sessionStorage.setItem('company', company_list[0].company)
                                    sessionStorage.setItem('company_id', company_list[0].id)
                                    this.props.history.push("/main")
                                } else {
                                    message.warning('系统繁忙请重试')
                                }

                            })
                        }
                    },
                    duration: 1
                })
            } else {
                message.error({
                    content: `${res.data.message}`,
                    duration: 1
                })
            }

        }).catch(err => {
            message.error({
                content: `${err.data.message}`,
                onClose: () => {
                },
                duration: 1
            })
        })
    }
    keyDownLogin = (e) => {
        if (e.keyCode === 13) {
            this.login()
        }
    }
    render() {
        return (
            <div className="login-page" style={{ height: `${this.state.height}px` }}>
                <div className="login-index">
                    <div className="login-index-left">
                        <img src={require('../img/3997c1ecc3ff10a23a307e4f23903ce.png')} alt="" />
                    </div>
                    <div className="login-index-right">
                        <p>欢迎登录教学管理平台</p>
                        <div className="input-div">
                            <input type="text" name="username" value={this.state.filter.username} onChange={this.loginChange} placeholder="请输入用户名" />
                            <input type="password" name="password" value={this.state.filter.password} onChange={this.loginChange} placeholder="请输入用密码" />
                        </div>
                        <div className="login-btn" onClick={this.login} onKeyDown={(e) => this.keyDownLogin(e)}>登录</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;