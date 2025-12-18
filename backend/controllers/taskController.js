const Task = require('../models/task');

// Obtener todas las tareas del usuario logueado
const getTasks = async (req, res) => {
    try {
        // En tu código anterior buscabas el usuario manualmente. 
        // Aquí usamos req.user._id que viene del middleware 'protect'.
        const tasks = await Task.find({ user: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
    }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
    // IMPORTANTE: Tu frontend debe enviar "title". 
    // Si tu frontend envía "text", cambia 'title' por 'text' aquí abajo.
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: "El título de la tarea es obligatorio" });
    }

    try {
        const newTask = new Task({
            title,
            user: req.user._id // Vinculamos la tarea al ID del usuario que inició sesión
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la tarea", error: error.message });
    }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        // Seguridad: Verificar que la tarea pertenezca al usuario que intenta borrarla
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "No tienes permiso para borrar esta tarea" });
        }

        await task.deleteOne();
        res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
    }
};

module.exports = { getTasks, createTask, deleteTask };