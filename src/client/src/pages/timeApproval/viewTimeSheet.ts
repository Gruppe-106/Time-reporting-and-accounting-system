import {Component} from "react";

interface ViewTimeSheetProp {
    id:number;
}

class ViewTimeSheet extends Component<ViewTimeSheetProp> {
    constructor(props:ViewTimeSheetProp) {
        super(props);
    }
}

export default ViewTimeSheet;