import React, {Props} from 'react';


interface ButtonProp{
    s_current: number,
    pageSize: number,
    s_totalPage:number,
    pageNext2: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
    }

export class SpageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.current,
    }


    //下一页
    setNext = () =>{
        let {s_current, pageSize, s_totalPage, pageNext2} = this.props
        let {num, pagenum} = this.state
        if(s_current < s_totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext2(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {pageSize, pageNext2} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext2(num)
            })
        }
    }

    render() {
        return (
            <div className="Me_bottom_box">
                <div id={"Me_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}} onClick={ this.setUp } >上一页</div>
                <div id={"Me_bottom_item2"} style={{order:2,userSelect:"none"}}>{  this.props.s_totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.s_totalPage }页</div>
                <div id={"Me_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}