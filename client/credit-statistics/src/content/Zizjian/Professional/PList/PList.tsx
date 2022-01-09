import React from 'react';

import './PList.less';
import {Simulate} from "react-dom/test-utils";
import paste = Simulate.paste;

interface ButtonProp{
    idx:string,
    courseCode:string,
    courseName:string,
    crs:string,
    hrs:string,
    others:string,
    "required/elective":string,
    semester:string,
    yixiu:boolean,
    yuxuan:boolean,
    changeCourse:Function,
}
export class PList extends React.Component<ButtonProp> {

    Introduce = () => {
        alert("该课程介绍还未完善")
    }

    change = () => {
        this.props.changeCourse(this.props.courseCode,parseFloat(this.props.crs));
    }

    render() {
        let t = this.props
        let st = Number(t["idx"]) + 2
        return (
            <div id={"Pro_course_body"} style={{order:st}}>
                    <div className={"Pro_course_body_item"} style={{order:1}}>{t["courseCode"]}</div>
                    <div className={"Pro_course_body_item"} style={{order:2}}>{t["courseName"]}</div>
                    <div className={"Pro_course_body_item"} style={{order:3}}>{t["hrs"]}</div>
                    <div className={"Pro_course_body_item"} style={{order:4}}>{t["crs"]}</div>
                    <div className={"Pro_course_body_item"} style={{order:5}}>{t["semester"]}</div>
                    <div className={"Pro_course_body_item"} style={{order:6}}>{t["others"]}</div>
                    <div className={"Pro_course_body_item"} style={{order:7}}>
                        <div className={"Pro_course_body_item2"} onClick={this.Introduce}>点击查看</div>
                    </div>
                    <div className={"Pro_course_body_item"} style={{order:8}}>
                        {   this.props.yuxuan === false ?
                            (
                                this.props.yixiu == false ?
                                <div className={"Pro_course_body_item_1"} onClick={this.change}>未&nbsp;修</div>:
                                <div className={"Pro_course_body_item_2"} onClick={this.change}>已&nbsp;修</div>
                            ):
                            <div className={"Pro_course_body_item_3"} onClick={this.change}>预&nbsp;选</div>
                        }
                    </div>
            </div>
        );
    }
}
