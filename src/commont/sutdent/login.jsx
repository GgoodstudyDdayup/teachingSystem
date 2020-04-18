import React, { Component } from 'react';
import { student_login} from '../../axios/http'
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
        localStorage.setItem('enter', 1)
    }
    componentWillUnmount() {
        // 移除监听事件
        window.removeEventListener('resize', this.handleSize);
        window.removeEventListener('keydown', this.keyDownLogin);
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
    loginChange = (e) => {
        const filter = this.state.filter
        filter[e.target.name] = e.target.value
        this.setState({
            filter
        })
    }
    login = () => {
        const params = this.state.filter
        student_login(params).then(res => {
            console.log(res)
            if (res.data.code === 0) {
                message.success({
                    content: `${res.data.message}`,
                    onClose: () => {
                        localStorage.setItem("token", res.data.data.user_info.token)
                        localStorage.setItem("username", res.data.data.user_info.username)
                        localStorage.setItem("student_id", res.data.data.user_info.student_id)
                        this.props.history.push('/studentMain')                        
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
        if (e.keyCode === 13 && localStorage.getItem('enter') === '1') {
            this.login()
        }
    }
    render() {
        return (
            <div className="login-page" style={{ height: `${this.state.height}px` }}>
                <div className="login-index">
                    <div className="login-index-left">
                        <img src={require('../../img/3997c1ecc3ff10a23a307e4f23903ce.png')} alt="" />
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