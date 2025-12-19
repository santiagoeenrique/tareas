import { useState, useEffect } from 'react';
import API from '../api';
import './dashboard.css';

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
            console.error(error);
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const taskTitle = newTask;
        const tempId = Date.now().toString();
        const optimisticTask = {
            _id: tempId,
            title: taskTitle,
            isCompleted: false,
            isOptimistic: true 
        };

        setTasks([...tasks, optimisticTask]);
        setNewTask('');

        try {
            const { data } = await API.post('/api/tasks', { title: taskTitle });
            setTasks(prev => prev.map(t => t._id === tempId ? data : t));
        } catch (error) {
            setTasks(prev => prev.filter(t => t._id !== tempId));
            alert("Error al guardar");
        }
    };

    const toggleComplete = async (id, isCompleted) => {
        const originalTasks = [...tasks];
        setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !isCompleted } : t));

        try {
            await API.put(`/api/tasks/${id}`, { isCompleted: !isCompleted });
        } catch (error) {
            setTasks(originalTasks);
            console.error(error);
        }
    };

    const deleteTask = async (id) => {
        const oldTasks = [...tasks];
        setTasks(tasks.filter(t => t._id !== id));

        try {
            await API.delete(`/api/tasks/${id}`);
        } catch (error) {
            setTasks(oldTasks);
            alert("Error al eliminar");
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
                    placeholder="Nueva tarea..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit" className="add-btn">Agregar</button>
            </form>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task._id} className="task-item" style={{ opacity: task.isOptimistic ? 0.5 : 1 }}>
                        <div className="task-left">
                            <button 
                                className="check-btn" 
                                onClick={() => toggleComplete(task._id, task.isCompleted)}
                                disabled={task.isOptimistic}
                                style={{ 
                                    backgroundColor: task.isCompleted ? '#4a4ae2' : 'transparent', 
                                    color: task.isCompleted ? 'white' : '#4a4ae2' 
                                }}
                            >
                                {task.isCompleted ? '●' : '○'}
                            </button>
                            
                            <span 
                                style={{ 
                                    textDecoration: task.isCompleted ? 'line-through' : 'none', 
                                    color: task.isCompleted ? 'grey' : 'black',
                                    fontSize: '18px'
                                }}
                            >
                                {task.title}
                            </span>
                        </div>
                        <button onClick={() => deleteTask(task._id)} className="delete-btn-red" disabled={task.isOptimistic}>
                            Borrar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;