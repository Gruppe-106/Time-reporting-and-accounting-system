import React, {Component} from "react";

interface TimeInputProp {
    onChange?: (value: {hours: number, minutes: number}) => void,
    onBlur?: (value: {hours: number, minutes: number}) => void,
    defaultValue?: number,
    managerLogged?: boolean,
    approved?: boolean
}

interface TimeInputState {
    hours: number,
    minutes: number,
    managerLogged: boolean,
    approved: boolean
}

class TimeInput extends Component<TimeInputProp, TimeInputState>{
    onChange: ((value: { hours: number, minutes: number }) => void) | undefined;
    onBlur  : ((value: { hours: number, minutes: number }) => void) | undefined;
    defaultHours: number = 0;
    defaultMinutes: number = 0;

    state = {
        hours: 0,
        minutes: 0,
        managerLogged: false,
        approved: false
    }

    constructor(props: TimeInputProp) {
        super(props);
        this.onChange = props.onChange ? props.onChange : undefined;
        this.onBlur   = props.onBlur   ? props.onBlur   : undefined;
        if (props.defaultValue) {
            let time = this.getMinutesAsHour(this.props.defaultValue);
            this.defaultHours   = time[0];
            this.defaultMinutes = time[1];
        }
        this.state.managerLogged = props.managerLogged ? props.managerLogged : false;
        this.state.approved = props.approved ? props.approved : false;
    }

    getMinutesAsHour(time: number = 0) {
        let hours: number = Math.floor(time / 60);
        let minutes: number = time % 60;
        return [hours, minutes];
    }

    handleHoursBlur(event: any): void {
        let hour = Number.parseInt(event.target.value);
        if (Number.isNaN(hour)) hour = 0;
        event.target.value = this.ensureDoubleDigits(hour);
        this.setState({hours: hour}, () => this.handleBlur());
    }


    getNumberFromString(number: string): number {
        let min = Number.parseInt(number);
        if (Number.isNaN(min)) min = 0;
        return min;
    }

    handleMinutesBlur(event: any) {
        let min = this.getNumberFromString(event.target.value);
        min = Math.min(45, Math.max(0, Math.round(min / 15) * 15));
        event.target.value = this.ensureDoubleDigits(min);
        this.setState({minutes: min}, () => this.handleBlur());
    }

    handleBlur() {
        if (this.onBlur) {
            this.onBlur({hours: this.state.hours, minutes: this.state.minutes})
        }
    }

    handleHoursChange(event: any) {
        let value = this.getNumberFromString(event.target.value);
        if (value > 24) {
            event.target.value = 24;
            event.currentTarget.select();
        }
        if (value < 0) {
            event.target.value = "00";
            event.currentTarget.select();
        }
        this.handleChange(undefined, this.getNumberFromString(event.target.value));
    }

    handleMinutesChange(event: any) {
        let value = event.target.value;
        if (value > 45) {
            event.target.value = 45;
            event.currentTarget.select();
        }
        if (value < 0) {
            event.target.value = "00";
            event.currentTarget.select();
        }
        this.handleChange(this.getNumberFromString(event.target.value));
    }

    handleChange(minutes?: number, hours?: number) {
        if (this.onChange) {
            this.onChange({
                hours: hours ? hours : this.state.hours,
                minutes: minutes ? minutes : this.state.minutes
            })
        }
    }

    inputOnlyNumbers(event: any) {
        if (!/[0-9]/.test(event.key) && event.keyCode !== 9) {
            event.preventDefault();
        }
    }

    ensureDoubleDigits(input: number|string): string {
        if (typeof input === "string") {
            input = parseInt(input);
            if (isNaN(input)) return "00";
        }
        return input < 10 ? "0" + input.toString() : input.toString();
    }

    render() {
        let backgroundColor = this.state.managerLogged && this.state.approved ? "#198754": this.state.managerLogged ? "#dc3545": "rgba(0,0,0,0)";
        return (
            <div className={"form-control"} style={{alignContent: "center", padding: "auto", backgroundColor: backgroundColor, width: "100%"}}>
                <center>
                    <input type={"text"} max={24} style={{border: "none", outline: "none", width: "1.5em", textAlign: "right", backgroundColor: "rgba(0,0,0,0)"}}
                           onBlur={(event) => {this.handleHoursBlur(event)}}
                           onChange={(event) => {this.handleHoursChange(event)}}
                           onKeyDown={this.inputOnlyNumbers}
                           onClick={(event) => {event.currentTarget.setSelectionRange(0, event.currentTarget.value.length)}}
                           defaultValue={this.ensureDoubleDigits(this.defaultHours)}
                           disabled={this.state.managerLogged && this.state.approved}/>
                    :
                    <input type={"text"} max={45} step={15} style={{border: "none", outline: "none", width: "1.5em", backgroundColor: "rgba(0,0,0,0)"}}
                           onBlur={(event) => {this.handleMinutesBlur(event)}}
                           onChange={(event) => {this.handleMinutesChange(event)}}
                           onKeyDown={this.inputOnlyNumbers}
                           onClick={(event) => {event.currentTarget.setSelectionRange(0, event.currentTarget.value.length)}}
                           defaultValue={this.ensureDoubleDigits(this.defaultMinutes)}
                           disabled={this.state.managerLogged && this.state.approved}/>
                </center>
            </div>
        )
    }
}

export default TimeInput;