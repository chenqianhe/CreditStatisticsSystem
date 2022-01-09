import React, {Props} from 'react';


interface ButtonProp{
    k_current: number,
    pageSize: number,
    k_totalPage:number,
    pageNext_k: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
    }

export class KpageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.k_current,
    }


    //下一页
    setNext = () =>{
        let {k_current, pageSize, k_totalPage, pageNext_k} = this.props
        let {num, pagenum} = this.state
        if(k_current < k_totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext_k(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {pageSize, pageNext_k} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext_k(num)
            })
        }
    }

    render() {
        return (
            <div className="Me_bottom_box">
                <div id={"Me_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}} onClick={ this.setUp } >上一页</div>
                <div id={"Me_bottom_item2"} style={{order:2,userSelect:"none"}}>{  this.props.k_totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.k_totalPage }页</div>
                <div id={"Me_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}