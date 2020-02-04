import React from 'react';
import {
    Component
} from 'react';
import file from '../public/images/file.png';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';
import {
    Link
} from 'react-router-dom';
import {
    history,
    navigation
} from '../public/js/history';
class CXGL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            m: -1,
        }
        this.listenCxglDiv = this.listenCxglDiv.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenCxglDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenCxglDiv)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    listenCxglDiv = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.cxgl');
        const i = _this.state.m;
        if (i === -1) {
            _this.setState({
                i: 0
            });
        }
        if (e && e.keyCode) {

            if (navigation(e)) {
                return
            }
            switch (e.keyCode) {
                case 13: //回车事件
                    /* if(i === -1){
                         _this.setState({m: 0});
                     }*/
                    break;
                case 38:
                    if (i - 2 >= 0 && i - 2 < divs.length) {
                        _this.setState({
                            m: i - 2
                        });
                    }
                    break;
                case 40:
                    if (i >= 0 && i + 2 < divs.length) {
                        console.log('');
                        _this.setState({
                            m: i + 2
                        });
                    }
                    break;
                case 37:
                    if (i >= 1 && i - 1 < divs.length) {
                        _this.setState({
                            m: i - 1
                        });
                    }
                    break;
                case 39:
                    if (i >= 0 && i + 1 < divs.length) {
                        _this.setState({
                            m: i + 1
                        });
                    }
                    break;
            }
        }

    }


    render() {
        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className={`cxgl ${this.state.m === 0 ? 'active' : ''}`}><Link to="/projectList"><img src={file} alt=""/><div>我的项目</div></Link></div>
                    <div className={`cxgl ${this.state.m === 1 ? 'active' : ''}`}><img src={file} alt=""/><div>文件2</div></div>
                    <div className={`cxgl ${this.state.m === 2 ? 'active' : ''}`}><img src={file} alt=""/><div>文件3</div></div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default CXGL