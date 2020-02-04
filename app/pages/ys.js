import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import $ from 'jquery';
class YS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            R: 132,
            B: 180,
            G: 120,
            C: 55,
            M: 16,
            Y: 63,
            K: 0,
            i: -1
        }
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.listenCPDiv)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenCPDiv)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }
    listenCPDiv = (e) => {
        this.onKeyDown(e)
        const _this = this;
        const divs = $('.ys_u_s');
        const i = _this.state.i;
        if (i === -1) {
            _this.setState({
                i: 0
            });
        }
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 13:
                    /* const p = $('#p-select').val();
                     _this.setState({R: 132,
                         B: 180,
                         G: 120,
                         C: 55,
                         M: 16,
                         Y: 63,
                         K: 0});*/
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
                <Header />
                <div className="s-body">
                    <div className="ys_main">
                    <div className="ys_u">
                        <div className="ys_d_img"><div className="g-div"></div></div>
                        <div className="ys_d_div">
                            <div className="ys_d_p">
                                <span>R:{this.state.R}</span>
                                <span>B:{this.state.B}</span>
                                <span>G:{this.state.G}</span>
                            </div>
                            <div className="ys_d_p">
                                <span>C:{this.state.C}%</span>
                                <span>M:{this.state.M}%</span>
                                <span>Y:{this.state.Y}%</span>
                                <span>K:{this.state.K}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="ys_d">
                        <span className={`ys_u_s ${this.state.i === 0 ? 's-active' : ''}`}>S1</span>
                        <span className={`ys_u_s ${this.state.i === 1 ? 's-active' : ''}`}>S2</span>
                        <span className={`ys_u_s ${this.state.i === 2 ? 's-active' : ''}`}>S3</span>
                        <span className={`ys_u_s ${this.state.i === 3 ? 's-active' : ''}`}>S4</span>
                        <span className={`ys_u_s ${this.state.i === 4 ? 's-active' : ''}`}>S5</span>
                    </div>
                        </div>
                    {/* <table>
                     <tbody>
                     <tr><td colSpan="1" className="td-r" style={{paddingLeft: '0px'}}><select className="p-select" id="p-select">
                     <option>P1</option>
                     <option>P2</option>
                     <option>P3</option>
                     <option>P4</option>
                     <option>P5</option>
                     </select></td><td className="td-l" colSpan="3"><div className="g-div"></div></td></tr>
                     <tr><td className="td-l">R：{this.state.R}</td><td className="td-r">C：{this.state.C}%</td></tr>
                     <tr><td className="td-l">B：{this.state.B}</td><td className="td-r">M：{this.state.M}%</td></tr>
                     <tr><td className="td-l">G：{this.state.G}</td><td className="td-r">Y：{this.state.Y}%</td></tr>
                     <tr><td className="td-l"><div></div></td><td className="td-r">K：{this.state.K}%</td></tr>
                     </tbody>
                     </table>*/}
                </div>
                <Footer />
            </div>
        )
    }
}

export default YS