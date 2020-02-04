import React from 'react';
import {
    Component
} from 'react';
import cxgl from '../public/images/cxgl.png';
import nzcs from '../public/images/nzcs.png';
import sjxg from '../public/images/sjxg.png';
import xtsz from '../public/images/xtsz.png';
import Header from './header';
import Footer from './foot';
import {
    Link
} from 'react-router-dom';
import '../public/js/keyboard_control';
import $ from 'jquery';

import {
    T
} from 'react-toast-mobile';

import axios from 'axios';
import env from '../env';

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            i: -1
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.waiteForRos = this.waiteForRos.bind(this)
    }

    componentDidMount() {
        const ros = document.ros

        if (ros && ros.isConnected()) {
            document.addEventListener("keydown", this.onMainKeyDown)
        } else {
            T.loading('服务启动中,请稍等')
            this.waiteForRos()
        }

    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onMainKeyDown)
    }
    waiteForRos() {
        const ros = document.ros
        console.log('waiteForRos')
        console.log(ros.isConnected())
        if (ros && ros.isConnected()) {
            console.log('main ros connected')
            document.addEventListener("keydown", this.onMainKeyDown)
            axios.get(env.api_base_url + '/system/camera_connected').then(result => {
                console.log(result)
                T.confirm({
                    // title: '标题',
                    message: '加载完毕，可以开始你的创作了',
                })
                setTimeout(() => T.clear(), 2000)
            })
        } else {
            setTimeout(this.waiteForRos, 3000)
        }
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }

    onMainKeyDown = (e) => {
        this.onKeyDown(e)
        console.log(e)
        const _this = this;
        const divs = $('.s-main-l');
        const i = _this.state.i;
        if (i === -1) {
            _this.setState({
                i: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    const links = $('a[name="main-a"]');
                    if (links.length > 0 && i != -1) {
                        links[this.state.i] ? links[this.state.i].click() : null;
                    }
                    /*if (i === -1) {
                        _this.setState({
                            i: 0
                        });
                    }*/
                    break;
                case 38:


                    if (i - 2 >= 0 && i - 2 < divs.length) {
                        _this.setState({
                            i: i - 2
                        });
                    }
                    break;
                case 40:
                    if (i >= 0 && i + 2 < divs.length) {
                        _this.setState({
                            i: i + 2
                        });
                    }
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            i: i - 1
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            i: i + 1
                        });
                    }
                    break;
                case 82:
                    axios.get(env.api_base_url + '/show_scratch_window')
                    break;
                case 0x99:
                    axios.get(env.api_base_url + '/system/halt')
                    T.loading('正在关机')
                    break;
            }
        }
    }
    render() {

        return (
            <div>
                <Header />
                <div className="s-body" id="main">
                    <div className={`s-main-l ${this.state.i === 0 ? 'active' : ''}`} name="main">
                        <Link to="/projectList" name="main-a"><img src={cxgl} alt=""/>
                            <div>文件管理</div>
                        </Link>
                    </div>
                    <div className={`s-main-l ${this.state.i === 1 ? 'active' : ''}`} name="main">
                        <Link to="/test" name="main-a"><img src={nzcs} alt=""/>
                            <div>内置测试</div>
                        </Link>
                    </div>
                    <div className={`s-main-l ${this.state.i === 2 ? 'active' : ''}`} name="main">
                        <Link to="/variable" name="main-a"><img src={sjxg} alt=""/>
                            <div>变量设置</div>
                        </Link>
                    </div>
                    <div className={`s-main-l ${this.state.i === 3 ? 'active' : ''}`} name="main">
                        <Link to="/setting" name="main-a"><img src={xtsz} alt=""/>
                            <div>系统设置</div>
                        </Link>
                    </div>
                </div>
                <Footer />
                <script>

                </script>
            </div>
        )
    }
}

export default Main
