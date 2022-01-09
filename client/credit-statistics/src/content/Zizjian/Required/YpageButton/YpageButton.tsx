import React, {Props} from 'react';


interface ButtonProp{
    y_current: number,
    pageSize: number,
    y_totalPage:number,
    pageNext_y: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
    }

export class YpageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.y_current,
    }


    //下一页
    setNext = () =>{
        let {y_current, pageSize, y_totalPage, pageNext_y} = this.props
        let {num, pagenum} = this.state
        if(y_current < y_totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext_y(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {pageSize, pageNext_y} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext_y(num)
            })
        }
    }

    render() {
        return (
            <div className="Me_bottom_box">
                <div id={"Me_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}} onClick={ this.setUp } >上一页</div>
                <div id={"Me_bottom_item2"} style={{order:2,userSelect:"none"}}>{  this.props.y_totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.y_totalPage }页</div>
                <div id={"Me_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}