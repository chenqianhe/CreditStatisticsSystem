import React, {Props} from 'react';


interface ButtonProp{
    w_current: number,
    pageSize: number,
    w_totalPage:number,
    pageNext_w: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
    }

export class WpageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.w_current,
    }


    //下一页
    setNext = () =>{
        let {w_current, pageSize, w_totalPage, pageNext_w} = this.props
        let {num, pagenum} = this.state
        if(w_current < w_totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext_w(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {pageSize, pageNext_w} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext_w(num)
            })
        }
    }

    render() {
        return (
            <div className="Me_bottom_box">
                <div id={"Me_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}} onClick={ this.setUp } >上一页</div>
                <div id={"Me_bottom_item2"} style={{order:2,userSelect:"none"}}>{  this.props.w_totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.w_totalPage }页</div>
                <div id={"Me_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}