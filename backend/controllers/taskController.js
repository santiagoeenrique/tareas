const Task = require('../models/task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
    }
};

const createTask = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "El título es obligatorio" });
    }
    try {
        const newTask = new Task({
            title,
            user: req.user._id 
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la tarea", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "No autorizado" });
        }
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "No autorizado" });
        }
        await task.deleteOne();
        res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };