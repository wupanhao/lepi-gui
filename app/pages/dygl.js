import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
class DYGL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            i: 70,
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown)
    }
    onKeyDown(e) {
        const navigation = document.navigation
        if (navigation && navigation(e)) {
            return
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="s-body">
                    <div className="d-text">
                        <div><label>电压1：123V</label>&nbsp;&nbsp;<label>电压2：123V</label></div>
                        <div><label>电流1：123V</label>&nbsp;&nbsp;<label>电流2：123V</label></div>
                    </div>
                    <div className="d-center">
                        <span>电源电量</span>
                    </div>
                    <div className="d-bottom">
                        <div id="dy-bar"
                             style={{height: '20px', width: '90%', border:'1px solid #b7ccf9', marginLeft: '20px', borderRadius: '5px', lineHeight: '20px', textAlign: 'center', float: 'left'}}>
                            <div id="dy-title"
                                 style={{background:'#78a8f7', width: `${this.state.i}%`, float: 'left', height: '100%', borderRadius: '5px', textAlign: 'center', lineHeight:'150%'}}>{this.state.i}%
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default DYGL