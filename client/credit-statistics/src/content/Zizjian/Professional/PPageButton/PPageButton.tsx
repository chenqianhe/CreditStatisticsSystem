import React, {Props} from 'react';

import './PPageButton.less';

interface ButtonProp{
    current: number,
    pageSize: number,
    totalPage:number,
    pageNext: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
}

export class PPageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.current,
    }



    //下一页
    setNext = () =>{
        let {current, pageSize, totalPage, pageNext} = this.props
        let {num, pagenum} = this.state
        if(current < totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {current, pageSize, totalPage, pageNext} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext(num)
            })
        }
    }

    render() {
        return (
            <div className="Pro_bottom_box">
                <div id={"Pro_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}} onClick={ this.setUp } >上一页</div>
                <div id={"Pro_bottom_item2"} style={{order:2,userSelect:"none"}}>{  this.props.totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.totalPage }页</div>
                <div id={"Pro_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}