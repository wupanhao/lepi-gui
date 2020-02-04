import React from 'react';
import {
    Component
} from 'react';
import cgq from '../public/images/cgq.png';
import mkf from '../public/images/mkf.png';
import sxt from '../public/images/sxt.png';
import md from '../public/images/md.png';
import dj from '../public/images/dj.png';
import cpjz from '../public/images/cpjz.png';
import {
    Link
} from 'react-router-dom';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';

class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            t: -1,
        }
        this.listenTestDiv = this.listenTestDiv.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenTestDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenTestDiv)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    listenTestDiv = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.s-img-l');
        const i = _this.state.t;
        if (i === -1) {
            _this.setState({
                t: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    const links = $('a[name="test-a"]');
                    if (links.length > 0 && i != -1) {
                        links[this.state.t] ? links[this.state.t].click() : null;
                    }
                    /*if (i === -1) {
                        _this.setState({
                            t: 0
                        });
                    }*/
                    break;
                case 38:
                    if (i - 2 >= 0 && i - 2 < divs.length) {
                        _this.setState({
                            t: i - 2
                        });
                    }
                    break;
                case 40:
                    if (i >= 0 && i + 2 < divs.length) {
                        _this.setState({
                            t: i + 2
                        });
                    }
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            t: i - 1
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            t: i + 1
                        });
                    }
                    break;
            }
        }
    }
    render() {
        return (
            <div>
                <Header/>
                <div className="s-body">
                    <div className={`s-img-l ${this.state.t === 0 ? 'active' : ''}`}>
                        <Link to="/sensors" name="test-a"><img src={cgq} alt=""/>
                            <div>传感器</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.t === 1 ? 'active' : ''}`}>
                        <Link to="/mkf" name="test-a"><img src={mkf} alt=""/>
                            <div>语音</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.t === 2 ? 'active' : ''}`}>
                        <Link name="test-a"><img src={sxt} alt=""/>
                        <div>摄像头</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.t === 3 ? 'active' : ''}`}>
                        <Link to="/md" name="test-a"><img src={md} alt=""/>
                            <div>电机</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.t === 4 ? 'active' : ''}`}>
                        <Link name="test-a"><img src={dj} alt=""/>
                        <div>舵机</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.t === 5 ? 'active' : ''}`}>
                        <Link name="test-a"><img src={cpjz} alt=""/>
                        <div>触屏矫正</div></Link>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Test
