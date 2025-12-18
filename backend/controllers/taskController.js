const Task = require('../models/task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
    }
};

const createTask = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'El campo "title" es obligatorio' });
    }
    try {
        const task = new Task({
            title,
            user: req.user._id,
        });
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        
        task.title = req.body.title || task.title;
        task.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : task.isCompleted;
        
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        await Task.deleteOne({ _id: task._id });
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };