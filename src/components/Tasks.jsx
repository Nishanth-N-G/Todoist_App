import React, { useState, text } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format'
import { addDays, isAfter, isBefore, isToday } from 'date-fns';

const FORMAT = 'dd/MM/yyyy';
function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
}

const AddTask = ({ onCancel, onAddTask }) => {
    const [task, setTask] = useState("");
    const [date, setDate] = useState(null);


    return (
        <div className="add-task-dialog">
            <input value={task} onChange={(event) => setTask(event.target.value)} />
            <div className="add-task-action-container">
                <div className="btns-container">
                    <button disabled={!task}
                        className="add-btn"
                        onClick={() => {
                            onAddTask(task, date);
                            onCancel();
                            setTask("");
                        }}>
                        Add Task </button>
                    <button className="cancel-btn" onClick={() => { onCancel(); setTask("") }}> Cancel </button>
                </div>
                <div className="icon-container">
                    <DayPickerInput
                        onDayChange={(day) => setDate(day)}
                        placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
                        formatDate={formatDate}
                        format={FORMAT}
                        dayPickerProps={{
                            modifiers: {
                                disabled: [{ before: new Date() }],
                            },
                        }}
                    />
                </div>
            </div>
        </div >
    )
}

const TASKS_HEADER_MAPPING = {
    INBOX: "Inbox",
    TODAY: "Today",
    NEXT_7: "Next 7 days",

}

const TaskItems = ({ selectedTab, tasks }) => {
    if (selectedTab === "NEXT_7") {
        return tasks.filter((task) =>
            isAfter(task.date, new Date()) && isBefore(task.date, addDays(new Date(), 7)))
            .map((task) => (<p>{task.text}  {dateFnsFormat(new Date(task.date), FORMAT)} {" "}</p>));
    }

    if (selectedTab === "TODAY") {
        return tasks.filter((task) =>
            isToday(task.date))
            .map((task) => (<p>{task.text}  {dateFnsFormat(new Date(task.date), FORMAT)} {" "}</p>));
    }

    return tasks
        .map((task) => (<p>{task.text}  {dateFnsFormat(new Date(task.date), FORMAT)} {" "}</p>));
}

const Tasks = ({ selectedTab }) => {
    const [tasks, setTasks] = useState([]);
    const [showAddTask, setShowAddTask] = useState(false);

    const addNewTask = (text, date) => {
        const newTaskItem = { text, date: date || new Date() }
        setTasks((prevState => [...prevState, newTaskItem]));
    };

    return (
        <div className="tasks">
            <h1>{TASKS_HEADER_MAPPING[selectedTab]}</h1>
            <div className="add-task-btn"
                onClick={() => setShowAddTask((prevState) => !prevState)}>
                <span className="plus"> + </span>
                <span className="add-task-text" onClick> Add task </span>
            </div>
            {showAddTask && <AddTask onAddTask={addNewTask} onCancel={() => setShowAddTask(false)} />}
            {tasks.length > 0 ? <TaskItems tasks={tasks} selectedTab={selectedTab} /> : (<p>No tasks yet</p>)}
        </div>
    )
}

export default Tasks;
