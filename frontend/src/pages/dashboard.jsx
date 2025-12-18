import { useState, useEffect } from 'react';
import API from '../api';
import './dashboard.css'; // Asegúrate de tener este CSS para los estilos

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/api/tasks');
            setTasks(data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar tareas:", error);
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const { data } = await API.post('/api/tasks', { title: newTask });
            setTasks([...tasks, data]);
            setNewTask('');
        } catch (error) {
            alert("Error al agregar tarea");
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const { data } = await API.put(`/api/tasks/${id}`, { completed: !completed });
            setTasks(tasks.map(t => (t._id === id ? data : t)));
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("¿Eliminar esta tarea?")) return;
        try {
            await API.delete(`/api/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Mis Pendientes</h1>
                <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
            </header>

            <form className="task-form" onSubmit={addTask}>
                <input 
                    type="text" 
                    placeholder="Escribe una nueva tarea..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit">Agregar</button>
            </form>

            {loading ? (
                <p>Cargando tareas...</p>
            ) : (
                <div className="task-list">
                    {tasks.length === 0 ? (
                        <p>No tienes tareas pendientes. ¡Buen trabajo!</p>
                    ) : (
                        tasks.map(task => (
                            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <span onClick={() => toggleComplete(task._id, task.completed)}>
                                    {task.title}
                                </span>
                                <button onClick={() => deleteTask(task._id)} className="delete-btn">🗑️</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
/*
import { useState, useEffect } from 'react';
import API from '../api';
import './dashboard.css';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/api/tasks');
            setTasks(data);
        } catch (error) {
            console.error("Error al cargar tareas", error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            const { data } = await API.post('/api/tasks', { title: newTask });
            setTasks([...tasks, data]);
            setNewTask('');
        } catch (error) {
            alert("Error al agregar");
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const { data } = await API.put(`/api/tasks/${id}`, { completed: !completed });
            setTasks(tasks.map(t => (t._id === id ? data : t)));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await API.delete(`/api/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Mis Pendientes</h1>
                <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
            </header>

            <form className="task-form" onSubmit={addTask}>
                <input 
                    type="text" 
                    placeholder="Escribe una nueva tarea..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit" className="add-btn">Agregar</button>
            </form>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <div className="task-left">
                            <button 
                                className="check-btn" 
                                onClick={() => toggleComplete(task._id, task.completed)}
                            >
                                {task.completed ? '●' : '○'}
                            </button>
                            <span className="task-text">{task.title}</span>
                        </div>
                        <button onClick={() => deleteTask(task._id)} className="delete-btn-red">
                            Borrar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;*/