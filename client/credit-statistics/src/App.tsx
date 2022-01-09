import './App.css'
import {Home} from "./home/Home";
import {Content} from "./content/Content";
import React from "react";
import {checkstatus} from "../common/net-service";

export class App extends React.Component {
    state = {
        userid: "",
        showElem:true,
    }

    componentDidMount() {
        if (localStorage.getItem("tag") == null) {
            let showElem = true;
            this.setState({
                showElem:showElem
            })
        } else {
            checkstatus(localStorage.getItem("tag") as string, (res: any) => {
                // console.log(res.data)
                let showElem = res.data.state != 1;
                this.setState({
                        userid: res.data.id,
                        showElem:showElem,
                    },
                    () => {
                        console.log('Log : user id = ' + this.state.userid)
                    });
            })
        }
        console.log(this.state.showElem)
    }


    render() {

        return (
            <div className="App">
                {
                    this.state.showElem == true ? (
                        <Home/>
                    ) : <Content id={this.state.userid}/>
                }
            </div>
        )
    }


}

