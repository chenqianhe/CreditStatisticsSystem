import React from 'react';

import './PuList.less';

interface ButtonProp {
    idx: string,
    classtype: string,
    courseCode: string,
    courseName: string,
    crs: string,
    hrs: string,
    openObject: string,
    yixiu: boolean,
    yuxuan: boolean,
    changeCourse: Function
}

export class PuList extends React.Component<ButtonProp> {

    Introduce = () => {
        alert("该课程介绍还未完善")
    }

    change = () => {
        this.props.changeCourse(this.props.courseCode, parseFloat(this.props.crs));
    }

    render() {
        let t = this.props
        let st = Number(t["idx"]) + 2
        return (
            <div id={"Pub_course_body"} style={{order: st}}>
                <div className={"Pub_course_body_item"} style={{order: 1}}>{t["classtype"]}</div>
                <div className={"Pub_course_body_item"} style={{order: 2}}>{t["courseCode"]}</div>
                <div className={"Pub_course_body_item"} style={{order: 3}}>{t["courseName"]}</div>
                <div className={"Pub_course_body_item"} style={{order: 4}}>{t["hrs"]}</div>
                <div className={"Pub_course_body_item"} style={{order: 5}}>{t["crs"]}</div>
                <div className={"Pub_course_body_item"} style={{order: 6}}>{t["openObject"]}</div>
                <div className={"Pub_course_body_item"} style={{order: 7}}>
                    <div className={"Pub_course_body_item2"} onClick={this.Introduce}>点击查看</div>
                </div>
                <div className={"Pub_course_body_item"} style={{order: 8}}>
                    {this.props.yuxuan === false ?
                        (
                            this.props.yixiu == false ?
                                <div className={"Pub_course_body_item_1"} onClick={this.change}>未&nbsp;修</div> :
                                <div className={"Pub_course_body_item_2"} onClick={this.change}>已&nbsp;修</div>
                        ) :
                        <div className={"Pub_course_body_item_3"} onClick={this.change}>预&nbsp;选</div>
                    }
                </div>
            </div>
        );
    }
}
