import React, {Props} from 'react';


interface ButtonProp{
    yu_current: number,
    pageSize: number,
    yu_totalPage:number,
    pageNext_yu: Function,
}
interface ButtonState{
    num:number,
    pagenum:number,
    }

export class PYupageButton extends React.Component<ButtonProp,ButtonState> {


    state= {
        num: 0,
        // @ts-ignore
        pagenum: this.props.yu_current,
    }


    //下一页
    setNext = () =>{
        let {yu_current, pageSize, yu_totalPage, pageNext_yu} = this.props
        let {num, pagenum} = this.state
        if(yu_current < yu_totalPage){
            num += pageSize
            pagenum += 1
            this.setState({
                num:num,
                pagenum:pagenum,
            },function () {
                pageNext_yu(num)
            })
        }
    }

    //上一页
    setUp = () =>{
        let {pageSize, pageNext_yu} = this.props
        let {num, pagenum} = this.state
        if(pagenum > 1){
            num -= pageSize
            pagenum -= 1
            this.setState({
                num:num,
                pagenum:pagenum
            },function () {
                pageNext_yu(num)
            })
        }
    }

    render() {
        return (
            <div className="Me_bottom_box">
                <div id={"Me_bottom_item"} style={{order:1,userSelect:"none",cursor:"pointer"}}onClick={ this.setUp } >上一页</div>
                <div id={"Me_bottom_item2"} style={{order:2,userSelect:"none"}}>{  this.props.yu_totalPage > 0 ? this.state.pagenum : 0 }页/ { this.props.yu_totalPage }页</div>
                <div id={"Me_bottom_item"} style={{order:3,userSelect:"none",cursor:"pointer"}} onClick={ this.setNext } >下一页</div>
            </div>
        );
    }
}