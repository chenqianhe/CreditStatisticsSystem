import React, {Props} from 'react';


interface ButtonProp{
    tmp_current: number,
    pageSize: number,
    tmp_totalPage:number,
    pageNext_tmp: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
    }

export class LipageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.tmp_current,
    }


    //下一页
    setNext = () =>{
        let {tmp_current, pageSize, tmp_totalPage, pageNext_tmp} = this.props
        let {num, pagenum} = this.state
        if(tmp_current < tmp_totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext_tmp(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {pageSize, pageNext_tmp} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext_tmp(num)
            })
        }
    }

    render() {
        return (
            <div className="Me_bottom_box">
                <div id={"Me_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}} onClick={ this.setUp } >上一页</div>
                <div id={"Me_bottom_item2"} style={{order:2,userSelect:"none"}}>{ this.props.tmp_totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.tmp_totalPage }页</div>
                <div id={"Me_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}