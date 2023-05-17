import React, {Component, createRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Dropdown, Stack} from "react-bootstrap";
import {faAngleUp} from "@fortawesome/free-solid-svg-icons/faAngleUp";

interface AnonValue {
    hours: number,
    minutes: number
}

interface TimeInputProp {
    onChange      ?: (value: AnonValue) => void,
    onBlur        ?: (value: AnonValue) => void,
    defaultValue  ?: number,
    managerLogged ?: boolean,
    approved      ?: boolean,
    onDelete      ?: (value: AnonValue) => void,
    zeroedOnDelete?: boolean,
    enableDropDown?: boolean
}

interface TimeInputState {
    hours: number,
    minutes: number,
    managerLogged: boolean,
    approved: boolean,
    dropDownOpen: boolean
}

class TimeInput extends Component<TimeInputProp, TimeInputState>{
    onChange: ((value: AnonValue) => void) | undefined;
    onBlur  : ((value: AnonValue) => void) | undefined;
    onDelete: ((value: AnonValue) => void) | undefined;
    enableDelete  : boolean;
    zeroedOnDelete: boolean;

    enableDropDown: boolean;

    locked: boolean = false;

    backgroundColor: string = "rgba(0,0,0,0)";
    foregroundColor: string = "rgba(0,0,0,1)";

    hoursRef:   React.MutableRefObject<any>;
    minutesRef: React.MutableRefObject<any>;

    state: TimeInputState = {
        hours        : 0,
        minutes      : 0,
        managerLogged: false,
        approved     : false,
        dropDownOpen : false
    }

    constructor(props: TimeInputProp) {
        super(props);

        this.onChange       = props.onChange ??  undefined;
        this.onBlur         = props.onBlur   ??  undefined;
        this.onDelete       = props.onDelete ??  undefined;
        this.enableDelete   = props.onDelete !== undefined;
        this.zeroedOnDelete = props.zeroedOnDelete ?? false;

        this.enableDropDown = props.enableDropDown ?? false;

        if (props.defaultValue) {
            let time: number[]  = this.getMinutesAsHour(this.props.defaultValue);
            this.state.hours   = time[0];
            this.state.minutes = time[1];
        }

        this.state.managerLogged = props.managerLogged ? props.managerLogged : false;
        this.state.approved      = props.approved      ? props.approved      : false;

        if (this.state.managerLogged) {
            if (this.state.approved) {
                this.backgroundColor = "#198754";
                this.foregroundColor = "#ffffff";
                this.locked = true;
            } else {
                this.backgroundColor = "#dc3545";
            }
        }

        this.minutesRef = createRef();
        this.hoursRef   = createRef();
    }

    getMinutesAsHour(time: number = 0) {
        let hours  : number = Math.floor(time / 60);
        let minutes: number = time % 60;
        return [hours, minutes];
    }

    handleHoursBlur(): void {
        let hour: number = Number.parseInt(this.hoursRef.current.value);
        if (Number.isNaN(hour)) hour = 0;
        this.hoursRef.current.value = this.ensureDoubleDigits(hour);
        this.setState({hours: hour}, () => this.handleBlur());
    }

    getNumberFromString(number: string): number {
        let min = Number.parseInt(number);
        if (Number.isNaN(min)) min = 0;
        return min;
    }

    handleMinutesBlur(): void {
        let min = this.getNumberFromString(this.minutesRef.current.value);
        min = Math.min(45, Math.max(0, Math.round(min / 15) * 15));
        this.minutesRef.current.value = this.ensureDoubleDigits(min);
        this.setState({minutes: min}, () => this.handleBlur());
    }

    handleBlur(): void {
        if (this.state.hours > 23) {
            this.setState({minutes: 0, hours: 24});
            this.minutesRef.current.value = "00";
        }
        if (this.onBlur) {
            this.onBlur({hours: this.state.hours, minutes: this.state.minutes})
        }
    }

    handleHoursChange(event: any): void {
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

    handleMinutesChange(event: any): void {
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

    handleChange(minutes?: number, hours?: number): void {
        if (this.onChange) {
            this.onChange({
                hours: hours ? hours : this.state.hours,
                minutes: minutes ? minutes : this.state.minutes
            })
        }
    }

    handleDelete(): void {
        if (this.onDelete) {
            this.onDelete({
                hours: this.state.hours,
                minutes: this.state.minutes
            });
        }
        if (this.zeroedOnDelete) {
            this.setState({hours: 0, minutes: 0});
            this.hoursRef.current.value   = this.ensureDoubleDigits("00");
            this.minutesRef.current.value = this.ensureDoubleDigits("00");
        }
    }

    inputOnlyNumbers(event: any): void {
        // Key code 9 is "Tab"
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

    inputRender(align: "right" | "left", onBlur: () => void, onChange: (event: any) => void, handleDropDown: (dir: number) => void, ref: React.MutableRefObject<any>, defaultValue: number): JSX.Element {
        return (
            <input type={"text"} style={{border: "none", outline: "none", width: "1.5em", textAlign: align, backgroundColor: "rgba(0,0,0,0)", color: this.foregroundColor}}
                   onBlur={() => {onBlur.call(this)}}
                   onChange={(event) => {onChange.call(this, event)}}
                   onKeyDown={this.inputOnlyNumbers}
                   onClick={(event) => {event.currentTarget.setSelectionRange(0, event.currentTarget.value.length)}}
                   onWheel={(e) => {this.handleWheelScroll(e, handleDropDown)}}
                   defaultValue={this.ensureDoubleDigits(defaultValue)}
                   disabled={this.locked}
                   ref={ref}
            />
        );
    }

    handleHover(enable: boolean): void {
        this.setState({dropDownOpen: enable});
    }

    /**
     *
     * @param dir 1 or -1
     */
    dropDownHandleHours(dir: number): void {
        let hours: number = this.state.hours + dir;
        if (hours > 24) hours = 0;
        else if (hours < 0) hours = 24;
        this.setState({hours: hours});
        this.hoursRef.current.value = this.ensureDoubleDigits(hours);
        this.handleHoursBlur();
    }

    /**
     *
     * @param dir 1 or -1
     */
    dropDownHandleMinutes(dir: number): void {
        let minutes: number = this.state.minutes + dir * 15;
        if (minutes > 45 || (this.state.hours > 23 && dir !== -1)) {
            minutes = 0;
            this.dropDownHandleHours(1);
        } else if (minutes < 0) {
            minutes = 45;
            this.dropDownHandleHours(-1);
        }
        this.setState({minutes: minutes});
        this.minutesRef.current.value = this.ensureDoubleDigits(minutes);
        this.handleMinutesBlur();
    }

    handleWheelScroll(e: React.WheelEvent<HTMLElement>, handleFunction: (dir: number) => void): void {
        if (e.deltaY > 0) handleFunction.call(this, -1);
        else if (e.deltaY < 0) handleFunction.call(this, 1);
    }

    scrollableSelectorRender(handleFunction: (dir: number) => void, value: number): JSX.Element {
        return (
            <Stack direction={"vertical"} onWheel={(e) => {this.handleWheelScroll(e, handleFunction)}}>
                <FontAwesomeIcon icon={faAngleUp}   size={"2xl"} onClick={() => handleFunction.call(this, 1)}/>
                <center>
                    <h3 style={{userSelect: "none", width: "2rem"}}>
                        {this.ensureDoubleDigits(value)}
                    </h3>
                </center>
                <FontAwesomeIcon icon={faAngleDown} size={"2xl"} onClick={() => handleFunction.call(this, -1)}/>
            </Stack>
        );
    }

    render(): JSX.Element {
        return (
            <>
                <div onMouseLeave={() => {this.handleHover(false)}}
                     onMouseUp={   () => {this.handleHover(false)}}
                     className={"form-control"} style={{alignContent: "center", padding: "auto", backgroundColor: this.backgroundColor, width: "100%", color: this.foregroundColor}}
                >
                    <center>
                        {this.inputRender("right", this.handleHoursBlur, this.handleHoursChange, this.dropDownHandleHours, this.hoursRef, this.state.hours)}
                        :
                        {this.inputRender("left", this.handleMinutesBlur, this.handleMinutesChange, this.dropDownHandleMinutes, this.minutesRef, this.state.minutes)}
                        {
                            this.enableDropDown && !this.locked ? (
                                <FontAwesomeIcon style={{cursor: "pointer"}} icon={faAngleDown} size={"sm"} onClick={() => this.handleHover(true)}/>
                            ) : null
                        }
                    </center>
                </div>
                {!this.locked && this.enableDropDown ? (
                    <Dropdown id={"dropdown-time-selector"}>
                        <Dropdown.Menu show={this.state.dropDownOpen}
                                       style={{width: "6rem", minWidth: "6rem"}}
                                       onMouseOver={ ()=> {this.handleHover(true)}}
                                       onMouseLeave={()=> {this.handleHover(false)}}>
                            <Stack direction={"horizontal"} gap={0}>
                                {this.scrollableSelectorRender(this.dropDownHandleHours, this.state.hours)}
                                {this.scrollableSelectorRender(this.dropDownHandleMinutes, this.state.minutes)}
                            </Stack>
                            { this.enableDelete ?
                                <center>
                                    <FontAwesomeIcon style={{cursor: "pointer"}} icon={faTrash} size={"lg"} onClick={() => this.handleDelete()}/>
                                </center>
                                : null
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                ) : null}
            </>
        )
    }
}

export default TimeInput;