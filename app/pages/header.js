import React from 'react';
import {
    Component
} from 'react';
import wifi from '../public/images/wifi.png';
import ly from '../public/images/ly.png';


class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ly: true,
            wifi: true,
            i: 40
        }
        this.update = false
        this.updateState = this.updateState.bind(this);
    }
    componentDidMount() {
        this.update = true

        this.updateState()
    }

    componentWillUnmount() {
        this.update = false
    }
    updateState() {
        var ros = document.ros
        if (!(ros && ros.isConnected)) {
            console.log(ros)
            setTimeout(this.updateState, 1000)
            return
        }
        // var that = this
        ros.getPowerState().then(data => {
            // console.log(data)
            if (data.est_power > 0 && data.est_power <= 100) {
                this.setState({
                    i: data.est_power
                })

            }
            if (this.update) {
                setTimeout(this.updateState, 2000)
            }
        })
    }

    render() {
        return (
            <div className="s-header">
                <span>乐派AI-8</span>
                <div
                    style={{height: '13px', width: '45px', border:'1px solid #FFF', float: 'right', borderRadius: '7px', marginTop: '0px', marginRight: '10px'}}>
                    <div style={{float:'left', height:'100%', width: `${this.state.i}%`,borderRadius: '7px', background: `${this.state.i <= 10 ? 'red' : this.state.i <= 20 ? '#e4b827' : '#37c337'}`, textAlign:'center', color: '#fff', fontSize: '10px'}} >{this.state.i}%</div>
                </div>
                {this.state.wifi ? <img src={wifi} alt=""/> : null } {this.state.ly ? <img src={ly} alt=""/> : null}
            </div>
        )
    }
}

export default Header
