import React from 'react';
import {
    Component
} from 'react';
import Header from './header';
import Footer from './foot';
import axios from 'axios';
import env from '../env';
class BBXX extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ips: [],
        }
        this.updateNetworks = this.updateNetworks.bind(this);
        // <li><div className="s-label">公司：</div> 京师智创（北京）科技有限公司</li>
    }

    updateNetworks() {
        axios.get(env.api_base_url + '/wifi/ips').then(result => {
            console.log(result)
            if (result && result.data && result.data.length > 0) {
                this.setState({
                    ips: result.data
                })
            }
        })

        if (this.update) {
            setTimeout(this.updateNetworks, 1000)
        }

    }
    componentWillMount() {}
    componentDidMount() {
        this.update = true
        this.updateNetworks()
        document.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount() {
        this.update = false
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
                    <div className="s-czcp">
                        <ul>
                            <li><div className="s-label">型号：</div>乐派AI-8</li>
                            <li><div className="s-label">版本：</div>0019</li>
                            <li><div className="s-label">出厂时间：</div>2020-01</li>
                            {  //console.log(this.state) 
                                this.state.ips.map(dev => {
                                    return <li><div className="s-label">{dev.interface.substr(0,5)}：</div>{dev.ip} </li>
                                })
                            }
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default BBXX
