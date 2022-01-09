import React from 'react';

import './OuLIist.less';

interface ButtonProp {
    idx: string,
    activityCode: string,
    activityName: string,
    activityCondition: string,
    crs: string,
    tianjia: boolean,
    addCourse: Function,

}

export class OuList extends React.Component<ButtonProp> {

    add = () => {
        if (this.props.tianjia == true){
            alert('该项已添加');
        }else {
            this.props.addCourse(this.props.activityCode, parseInt(this.props.crs));
        }
    }

    render() {
        let t = this.props
        let st = Number(t["idx"]) + 2
        return (
            <div id={"Ou_course_body"} style={{order: st}}>
                <div className={"Ou_course_body_item"} style={{order: 1}}>{t["activityCode"]}</div>
                <div className={"Ou_course_body_item"} style={{order: 2 , userSelect: "none"} }>{t["activityName"]}</div>
                <div className={"Ou_course_body_item_1"} style={{order: 3, userSelect: "none"}}>{t["activityCondition"]}</div>
                <div className={"Ou_course_body_item_2"} style={{order: 4, userSelect: "none"}}>{t["crs"]}</div>
                <div className={"Ou_course_body_item"} style={{order: 5}}>
                    {
                        this.props.tianjia == false ?
                            <div className={"Ou_course_body_item_3"} onClick={this.add}>添&nbsp;加</div> :
                            <div className={"Ou_course_body_item_4"} onClick={this.add}>已添加</div>
                    }
                </div>
            </div>
        );
    }
}
