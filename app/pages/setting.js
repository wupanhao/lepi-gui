import React from 'react';
import {
    Component
} from 'react';
import ly1 from '../public/images/ly1.png';
import yy from '../public/images/yy.png';
import sy from '../public/images/yl2.png';
import zt from '../public/images/zt.png';
import czcp from '../public/images/czcp.png';
import bbxx from '../public/images/bbxx.png';
import wifi from '../public/images/wifi2.png';
import Header from './header';
import Footer from './foot';
import {
    navigation
} from '../public/js/history';
import {
    T
} from 'react-toast-mobile';
//T.loading()

// T.notify('hello toast')

import {
    Link
} from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import env from '../env';

class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            s: -1,
            cf: false
        }
        this.listenSetDiv = this.listenSetDiv.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onClick = this.onClick.bind(this);

    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenSetDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenSetDiv)
    }

    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    listenSetDiv = (e) => {
        const _this = this;
        const divs = $('.s-img-l');
        const i = _this.state.s;
        if (i === -1) {
            _this.setState({
                s: 0
            });
        }
        if (e && e.keyCode) {
            console.log('keyCode : ', e.keyCode, _this.state.cf); //81Q  87W
            console.log(this.state)
            if (this.state.cf == true) {
                T.clear()
                this.setState({
                    cf: false
                });
                switch (e.keyCode) {
                    case 72:
                    case 13:
                        axios.get(env.api_base_url + '/clearData').then(result => {
                            console.log(result)
                            T.confirm({
                                // title: '标题',
                                message: '已清除完毕',
                            })
                            setTimeout(() => T.clear(), 1500)
                            console.log('Yes')
                        })
                        break;
                    case 66:
                        console.log('No')
                        break;
                }

            } else {
                this.onKeyDown(e)
                switch (e.keyCode) {
                    case 13: //回车事件
                        const links = $('a[name="set-a"]');
                        if (links.length > 0 && i != -1) {
                            links[this.state.s] ? links[this.state.s].click() : null;
                        }
                        /* if (i === -1) {
                         _this.setState({
                         s: 0
                         });
                         }*/
                        break;
                    case 38:
                        if (i - 2 >= 0 && i - 2 < divs.length) {
                            _this.setState({
                                s: i - 2
                            });
                        }
                        break;
                    case 40:
                        if (i >= 0 && i + 2 < divs.length) {
                            _this.setState({
                                s: i + 2
                            });
                        }
                        break;
                    case 37:
                        if (i >= 1 && i - 1 < divs.length) {
                            _this.setState({
                                s: i - 1
                            });
                        }
                        break;
                    case 39:
                        if (i >= 0 && i + 1 < divs.length) {
                            _this.setState({
                                s: i + 1
                            });
                        }
                        break;
                }
            }
        }
    }
    onClick() {
        const _this = this;
        _this.setState({
            cf: true
        });
        //T.notify('hello toast')
        //T.loading()
        T.confirm({
            title: '清除数据',
            message: '是否要清除数据,这将删除主机上的全部程序和用户设置项',
            option: [{
                text: '确定',
                fn: (e) => {
                    console.log('点击了确定', this);
                }
            }, {
                text: '取消',
                fn: (e) => {
                    console.log('点击了取消', this);
                }
            }]
        });
    }

    render() {
        return (
            <div>
                <Header/>
                <div className="s-body">
                    <div className={`s-img-l ${this.state.s === 0 ? 'active' : ''}`}>
                        <Link to="/ly" name="set-a"><img src={ly1} alt=""/><div>蓝牙</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.s === 1 ? 'active' : ''}`}>
                        <Link to="" name="set-a"><img src={wifi} alt=""/><div>wifi</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.s === 2 ? 'active' : ''}`}>
                        <Link to="/yy" name="set-a"><img src={yy} alt=""/><div>语言</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.s === 3 ? 'active' : ''}`}>
                        <Link to="/yl" name="set-a"><img src={sy} alt=""/><div>声音</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.s === 4 ? 'active' : ''}`}>
                        {/* <Link to="/czcp" name="set-a"><img src={czcp} alt=""/><div>重置磁盘</div></Link>*/}
                        <a name="set-a" onClick={() => this.onClick()} ><img src={czcp} alt=""/><div>重置磁盘</div></a>
                    </div>
                    <div className={`s-img-l ${this.state.s === 5 ? 'active' : ''}`}>
                        <Link to="/bbxx" name="set-a"><img src={bbxx} alt=""/><div>主机信息</div></Link>
                    </div>
                </div>
                <Footer/>
                </div>
        )
    }
}

export default Setting
