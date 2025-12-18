import { useEffect, useState } from 'react';
import API from '../api';
import './Dashboard.css';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error("Error al obtener tareas");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        fetchTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tasks', { title });
            setTitle('');
            fetchTasks();
        } catch (error) {
            alert("Error al añadir tarea");
        }
    };

    const toggleTask = async (id, completed) => {
        try {
            await API.put(`/tasks/${id}`, { isCompleted: !completed });
            fetchTasks();
        } catch (error) {
            alert("Error al actualizar tarea");
        }
    };

    const deleteTask = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>📑 Mis Tareas</h1>
                <button onClick={handleLogout} className="btn-logout">Salir</button>
            </div>

            <form onSubmit={addTask} className="task-form">
                <input 
                    type="text" 
                    placeholder="¿Qué hay que hacer hoy?" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <button type="submit">Agregar</button>
            </form>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task._id} className="task-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} 
                             onClick={() => toggleTask(task._id, task.isCompleted)}>
                            <input 
                                type="checkbox" 
                                checked={task.isCompleted} 
                                readOnly 
                            />
                            <span style={{ 
                                textDecoration: task.isCompleted ? 'line-through' : 'none',
                                color: task.isCompleted ? '#999' : '#000'
                            }}>
                                {task.title}
                            </span>
                        </div>
                        <button 
                            className="btn-delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task._id);
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;