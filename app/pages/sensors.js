import React from 'react';
import {
    Component
} from 'react';
import cp from '../public/images/cp.png';
import ys from '../public/images/ys.png';
import tly from '../public/images/tly.png';
import csb from '../public/images/csb.png';
import hwx from '../public/images/hwx.png';
import dy from '../public/images/dy.png';
import {
    Link
} from 'react-router-dom';
import $ from 'jquery';

import Header from './header';
import Footer from './foot';
class TLY extends Component {
    constructor(props) {
        super(props)
        this.state = {
            i: -1
        }
        this.listenSensorDiv = this.listenSensorDiv.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenSensorDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenSensorDiv)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    listenSensorDiv = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.s-img-l');
        const i = _this.state.i;
        if (i === -1) {
            _this.setState({
                i: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13: //回车事件
                    const links = $('a[name="sensors-a"]');
                    if (links.length > 0 && i != -1) {
                        links[this.state.i] ? links[this.state.i].click() : null;
                    }
                    /* if(i === -1){
                         _this.setState({i: 0});
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
            }
        }

    }
    render() {
        return (
            <div>
                <Header/>
                <div className="s-body">
                    <div className={`s-img-l ${this.state.i === 0 ? 'active' : ''}`}>
                        <Link to="/cp" name="sensors-a"><img src={cp} alt=""/>
                            <div>触碰</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.i === 1 ? 'active' : ''}`}>
                        <Link to="/ys" name="sensors-a"> <img src={ys} alt=""/>
                            <div>颜色</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.i === 2 ? 'active' : ''}`}>
                        <Link to="/tly" name="sensors-a"><img src={tly} alt=""/><div>九轴</div></Link>
                    </div>
                    <div className={`s-img-l ${this.state.i === 3 ? 'active' : ''}`}>
                        <Link to="/csb" name="sensors-a"><img src={csb} alt=""/>
                            <div>自动识别</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.i === 4 ? 'active' : ''}`}>
                        <Link to="/hw" name="sensors-a"><img src={hwx} alt=""/>
                            <div>红外线</div>
                        </Link>
                    </div>
                    <div className={`s-img-l ${this.state.i === 5 ? 'active' : ''}`}>
                        <Link to="/dygl" name="sensors-a"><img src={dy} alt=""/>
                            <div>电源状态</div>
                        </Link>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default TLY