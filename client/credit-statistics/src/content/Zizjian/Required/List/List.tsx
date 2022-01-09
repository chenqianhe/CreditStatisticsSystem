import React from 'react';

import './List.less';
import {Required} from "../Required";

interface ButtonProp{
    idx:string,
    courseCode:string,
    courseName:string,
    crs:string,
    hrs:string,
    "required/elective":string,
    semester:string,
    yixiu: boolean,
    changeCourse:Function,
}
export class List extends React.Component<ButtonProp> {

    change = () => {
        this.props.changeCourse(this.props.courseCode,parseFloat(this.props.crs));
    }

    render() {
        let t = this.props
        let st = Number(t["idx"]) + 2
        return (
            <div id={"Required_course_body"} style={{order:st}}>
                    <div className={"Required_course_body_item"} style={{order:1}}>{t["courseCode"]}</div>
                    <div className={"Required_course_body_item"} style={{order:2}}>{t["courseName"]}</div>
                    <div className={"Required_course_body_item"} style={{order:3}}>{t["hrs"]}</div>
                    <div className={"Required_course_body_item"} style={{order:4}}>{t["crs"]}</div>
                    <div className={"Required_course_body_item"} style={{order:5}}>{t["semester"]}</div>
                    <div className={"Required_course_body_item"} style={{order:6}}>
                        {   this.props.yixiu === false ?
                            <div className={"Required_course_body_item_1"} onClick={this.change}>未&nbsp;修</div> :
                            <div className={"Required_course_body_item_2"} onClick={this.change}>已&nbsp;修</div>
                        }
                    </div>
            </div>
        );
    }
}
