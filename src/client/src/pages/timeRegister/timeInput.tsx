import React, {Component, createRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Dropdown, Stack} from "react-bootstrap";
import {faAngleUp} from "@fortawesome/free-solid-svg-icons/faAngleUp";

export interface AnonValue {
    hours: number,
    minutes: number
}

interface TimeInputProp {
    // Function to trigger when something changes (Inputs doesn't get sanitized)
    onChange      ?: (value: AnonValue) => void,
    // Function to when selection is blurred (Inputs sanitized)
    onBlur        ?: (value: AnonValue) => void,
    // Default value in minutes
    defaultValue  ?: number,
    managerLogged ?: boolean,
    approved      ?: boolean,
    // Function to trigger on delete clicked
    onDelete      ?: (value: AnonValue) => void,
    // Should the input fields be set to 0 when deleted
    zeroedOnDelete?: boolean,
    // Enable input dropdown (Required for delete button)
    enableDropDown?: boolean,
    // Background color
    backgroundColor?: string
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
            this.backgroundColor = "#dc3545";
            if (this.state.approved) {
                this.backgroundColor = "#198754";
                this.foregroundColor = "#ffffff";
                this.locked = true;
            }
        }

        if (props.backgroundColor !== undefined) this.backgroundColor = props.backgroundColor;

        this.minutesRef = createRef();
        this.hoursRef   = createRef();
    }

    /**
     * Converts minutes to hours with leftover minutes
     * @param {number} time: amount of minutes
     * @return {[number, number]}: Returns [hours, minutes]
     */
    private getMinutesAsHour(time: number = 0): [number, number] {
        return [Math.floor(time / 60), time % 60];
    }

    /**
     * Parses a string to a number
     * @param {string} number string to convert
     * @returns {number} Returns the converted string or 0 if it was NaN
     */
    getNumberFromString(number: string): number {
        let min: number = Number.parseInt(number);
        if (Number.isNaN(min)) min = 0;
        return min;
    }

    /**
     * Verifies keyboard inputs are only numeric or tab
     * @param {any} event The keyboard event
     */
    inputOnlyNumbers(event: any): void {
        // Key code 9 is "Tab"
        if (!/[0-9]/.test(event.key) && event.keyCode !== 9) {
            event.preventDefault();
        }
    }

    /**
     * Converts number or string number to format "nn" (double digits)
     * @param {number | string} input: number or string to convert
     * @return {string} Returns a string with double digits
     */
    ensureDoubleDigits(input: number|string): string {
        if (typeof input === "string") {
            input = parseInt(input);
            if (isNaN(input)) return "00";
        }
        return input < 10 ? "0" + input.toString() : input.toString();
    }

    /**
     * Called when hours input is blurred (Unselected).
     * Ensures proper display
     */
    handleHoursBlur(): void {
        let hour: number = this.getNumberFromString(this.hoursRef.current.value);
        this.hoursRef.current.value = this.ensureDoubleDigits(hour);
        this.setState({hours: hour}, () => this.handleBlur());
    }

    /**
     * Called when minutes input is blurred (Unselected).
     * Ensures proper display & keeps it within threshold (0, 15, 30, 45)
     */
    handleMinutesBlur(): void {
        let min: number = this.getNumberFromString(this.minutesRef.current.value);
        min = Math.min(45, Math.max(0, Math.round(min / 15) * 15));
        this.minutesRef.current.value = this.ensureDoubleDigits(min);
        this.setState({minutes: min}, () => this.handleBlur());
    }

    /**
     * Called after handleMinutesBlur & handleHoursBlur. Ensure total time isn't bigger than 24 hours. Calls if inputted onBlur
     */
    handleBlur(): void {
        if (this.state.hours > 23) {
            this.setState({minutes: 0, hours: 24});
            this.minutesRef.current.value = "00";
        }
        if (this.onBlur) {
            this.onBlur({hours: this.state.hours, minutes: this.state.minutes})
        }
    }

    /**
     * onChange for hours input, makes sure input is within: 0 <= input <= 24
     * @param {React.ChangeEvent<HTMLInputElement>} event: onChange event
     */
    handleHoursChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let value: number = this.getNumberFromString(event.target.value);
        if (value > 24) {
            event.target.value = "24";
            // Selects text in input
            event.currentTarget.select();
        }
        if (value < 0) {
            event.target.value = "00";
            event.currentTarget.select();
        }
        this.handleChange(undefined, this.getNumberFromString(event.target.value));
    }

    /**
     * onChange for minutes input, makes sure input is within: 0 <= input <= 45
     * @param {React.ChangeEvent<HTMLInputElement>} event: onChange event
     */
    handleMinutesChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let value: number = this.getNumberFromString(event.target.value);
        if (value > 45) {
            event.target.value = "45";
            // Selects text in input
            event.currentTarget.select();
        }
        if (value < 0) {
            event.target.value = "00";
            event.currentTarget.select();
        }
        this.handleChange(this.getNumberFromString(event.target.value));
    }

    /**
     * Called from both input on change functions, calls if inputted onChange
     * @param {number} minutes Optional: number of minutes, gets from state otherwise
     * @param {number} hours Optional: number of hours, gets from state otherwise
     */
    handleChange(minutes?: number, hours?: number): void {
        if (this.onChange) {
            this.onChange({
                hours: hours ? hours : this.state.hours,
                minutes: minutes ? minutes : this.state.minutes
            })
        }
    }

    /**
     * Trigger when delete is clicked, calls onDelete if inputted. Zeroes input if zeroedOnDelete prop is true
     */
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

    /**
     * Handles hovering over input and dropdown
     * @param {boolean} enable: enable/disable dropdown menu
     */
    handleHover(enable: boolean): void {
        this.setState({dropDownOpen: enable});
    }

    /**
     * Handle input from dropdown up and down arrows for hours input.
     * Also ensures hours isn't going out of bounds
     * @param dir 1 or -1 (incrementing or decrementing)
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
     * Handle input from dropdown up and down arrows for minutes input.
     * Also ensures hours and minutes isn't going out of bounds
     * @param dir 1 or -1 (incrementing or decrementing)
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

    /**
     * Triggered when wheel scroll over input or dropdown inputs.
     * Calls handleFunction with the given direction
     * @param {React.WheelEvent<HTMLElement>} event: Wheel Event
     * @param {(dir: number) => void} handleFunction: Function to call with direction, 1 or -1 (incrementing or decrementing)
     */
    handleWheelScroll(event: React.WheelEvent<HTMLElement>, handleFunction: (dir: number) => void): void {
        if (event.deltaY > 0) handleFunction.call(this, -1);
        else if (event.deltaY < 0) handleFunction.call(this, 1);
    }

    /**
     * Renders input with minimal styling and adds input events
     * @param {"right" | "left"} align: alignment of text in input ("right" | "left")
     * @param {() => void} onBlur: function to trigger on blur event
     * @param {(event: any) => void} onChange: function to trigger on change event
     * @param {(dir: number) => void} handleDropDown: handler function for on wheel event
     * @param {React.MutableRefObject<HTMLInputElement>} ref: ref object for referencing this input
     * @param {number} defaultValue: The default value for the input in minutes
     * @return {JSX.Element} returns the element of the generated input
     */
    inputRender(align: "right" | "left", onBlur: () => void, onChange: (event: any) => void, handleDropDown: (dir: number) => void, ref: React.MutableRefObject<HTMLInputElement>, defaultValue: number): JSX.Element {
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

    /**
     * Calls input render with the necessary inputs for hours input
     */
    inputHoursRender(): JSX.Element {
        return this.inputRender(
            "right",
            this.handleHoursBlur,
            this.handleHoursChange,
            this.dropDownHandleHours,
            this.hoursRef,
            this.state.hours
        )
    }

    /**
     * Calls input render with the necessary inputs for minutes input
     */
    inputMinutesRender(): JSX.Element {
        return this.inputRender(
            "left",
            this.handleMinutesBlur,
            this.handleMinutesChange,
            this.dropDownHandleMinutes,
            this.minutesRef,
            this.state.minutes
        )
    }

    /**
     * Creates the element for the scrollable selector in the dropdown
     * @param {(dir: number) => void} handleFunction: the handler function for handleWheelScroll
     * @param {number} value: value of the given input (hours or minutes)
     * @return {JSX.Element} Return the element for the created scrollable input
     */
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
                        {this.inputHoursRender()}:{this.inputMinutesRender()}
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
                                       onMouseLeave={()=> {this.handleHover(false)}}
                        >
                            <Stack direction={"horizontal"} gap={0}>
                                {this.scrollableSelectorRender(this.dropDownHandleHours, this.state.hours)}
                                {this.scrollableSelectorRender(this.dropDownHandleMinutes, this.state.minutes)}
                            </Stack>
                            {
                                this.enableDelete ? (
                                    <center>
                                        <FontAwesomeIcon style={{cursor: "pointer"}} icon={faTrash} size={"lg"} onClick={() => this.handleDelete()}/>
                                    </center>
                                ) : null
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                ) : null}
            </>
        )
    }
}

export default TimeInput;