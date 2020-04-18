import Login from '../commont/login'
import Main from '../commont/main'
import Zujuan from '../commont/zujuan/zujuan'
import Preview from '../commont/preview/index'
import SetPreview from '../commont/preview/index2'
import resourceCenter from '../commont/resourceCenter/recommended/index'
import StudentMain from '../commont/sutdent/main'
import StudentLogin from '../commont/sutdent/login'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import React, { Component } from 'react';
class router extends Component {
    render() {
        return (
            <Router basename="/">
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/main" component={Main} />
                        <Route path='/main/resourceCenter/recommended' component={resourceCenter}></Route>
                        <Route path="/main/zujuan" component={Zujuan} />
                        <Route path="/preview" component={Preview} />
                        <Route path="/setPreview" component={SetPreview} />
                        <Route path="/studentLogin" component={StudentLogin} />
                        <Route path="/studentMain" component={StudentMain} />
                    </Switch>
                </div>
            </Router>
        );
    }
}
export default router;