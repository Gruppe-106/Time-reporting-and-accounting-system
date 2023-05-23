import { Component } from "react";
import { Container, Table } from "react-bootstrap";
import BaseNavBar from "../../components/navBar";
import BaseApiHandler from "../../network/baseApiHandler";
import { userInfo } from "../../utility/router";
import { getDayThisWeek, getIndexOfWeek } from "../../utility/timeConverter";

interface ApiResponse 
{
    status: number,
    data: TimesheetRecData[],
}

interface TimesheetRecData 
{
    taskId: number,
    taskName: string,
    projectName: string,
    date: number,
    time: number,
    approved: boolean,
    managerLogged: boolean,
}

interface TaskRegistration 
{
    taskName: string,
    projectName: string,
    registrations: Map<number, TimeRegistration>
}

interface TimeRegistration 
{
    approved: boolean,
    managerLogged: boolean,
    minutes: number,
    hours: number,
}

class TimeRegister extends Component<any> 
{
    tasks: Map<number, TaskRegistration> = new Map<number, TaskRegistration>(); 
    weekOffset: number = 0;
    readonly weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    componentDidMount() 
    {
        let handler: BaseApiHandler = new BaseApiHandler();
        let period: [number, number] = this.getPeriod(-9);
        handler.get(`/api/time/register/get?user=${userInfo.userId}&period=${period[0]},${period[1]}`, {}, (value) => {
            let recData: ApiResponse = JSON.parse(JSON.stringify(value));
            if (recData.status !== 200)
            {
                alert("Server didn't respond correctly...");
                return;
            }

            let timesheetData: TimesheetRecData[] = recData.data;
            for (let index = 0; index < timesheetData.length; index++) 
            {
                let registration: TimeRegistration = {
                    approved: timesheetData[index].approved,
                    managerLogged: timesheetData[index].managerLogged,
                    hours: Math.floor(timesheetData[index].time / 60),
                    minutes: timesheetData[index].time % 60,
                }
                if (this.tasks.has(timesheetData[index].taskId))
                {
                    let task = this.tasks.get(timesheetData[index].taskId);
                    task?.registrations.set(getIndexOfWeek(timesheetData[index].date), registration);
                    if (!task) continue; 
                    this.tasks.set(timesheetData[index].taskId, task);
                    continue;
                }
                let registrationMap = new Map<number, TimeRegistration>();
                registrationMap.set(getIndexOfWeek(timesheetData[index].date), registration);
                this.tasks.set(timesheetData[index].taskId, {
                    projectName: timesheetData[index].projectName,
                    registrations: registrationMap,
                    taskName: timesheetData[index].taskName,
                })
            }
            this.forceUpdate();
        })
    }

    getPeriod(weekOffset: number): [number, number] 
    {
        return [getDayThisWeek(0, weekOffset), getDayThisWeek(0, weekOffset + 1) - 1];
    }

    tableRender(): JSX.Element 
    {
        //if (this.timesheetData.length <= 0) return (<></>);
        
        return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Task</th>
                        {this.weekDays.map((day, key) => (<th key={key}>{day}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from(this.tasks.keys()).map((taskKey, key) => (
                        <tr key={key}>
                            <td>{this.tasks.get(taskKey)?.projectName}</td>
                            <td>{this.tasks.get(taskKey)?.taskName}</td>
                            {[0,1,2,3,4,5,6].map((dayIndex, key) => (
                                <td key={key}>{this.tasks.get(taskKey)?.registrations.get(dayIndex)?.hours} | {this.tasks.get(taskKey)?.registrations.get(dayIndex)?.minutes}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
        )
    }

    render() 
    {
        return (
            <>
                <BaseNavBar />
                <Container className="pt-3">
                    <h1>Time Registration</h1>
                    {this.tableRender()}
                </Container>
            </>
        )
    }
}

export default TimeRegister;