import React from 'react';

import './MList.less';

interface ButtonProp {
    idx: string,
    type: string,
    content: string,
    crs: string,
    //添加了参数课程代码和修改课程的函数
    code: string,
    remove: Function
}

export class MList extends React.Component<ButtonProp> {

    //调用父组件的删除函数
    delete = () => {
        // alert("测试删除功能")
        // console.log(this.props.code);
        // console.log(this.props.crs);
        // console.log(this.props.type);
        this.props.remove(this.props.code, parseInt(this.props.crs), this.props.type);
        location.reload();
    }

    render() {
        let t = this.props
        let st = Number(t["idx"]) + 2
        return (
            <div id={"Me_course_body"} style={{order: st}}>
                <div className={"Me_course_body_item"} style={{order: 1}}>{t["type"]}</div>
                <div className={"Me_course_body_item"} style={{order: 2}}>{t["content"]}</div>
                <div className={"Me_course_body_item"} style={{order: 3}}>{t["crs"]}</div>
                <div className={"Me_course_body_item"} style={{order: 4}}>
                    <div className={"Me_course_body_item2"} onClick={this.delete}>删&nbsp;除</div>
                </div>
            </div>
        );
    }
}
