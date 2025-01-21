import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks/?project_id=${projectId}`);
                setTasks(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("Failed to load tasks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tasks/`, {
                project_id: projectId,
                title: formData.get('title'),
                description: formData.get('description'),
                status: formData.get('status'),
                priority: parseInt(formData.get('priority')),
                assigned_to: formData.get('assigned_to'),
                due_date: formData.get('due_date')
            });
            setTasks([...tasks, response.data]);
            setIsModalOpen(false);
            e.target.reset();
        } catch (err) {
            console.error("Error creating task:", err);
            setError("Failed to create task. Please try again.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2>项目任务</h2>
                <button onClick={() => setIsModalOpen(true)}>新增任务</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>新增任务</h3>
                        <form onSubmit={handleCreateTask}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label>任务标题：</label>
                                    <input type="text" name="title" required />
                                </div>
                                <div>
                                    <label>描述：</label>
                                    <textarea name="description"></textarea>
                                </div>
                                <div>
                                    <label>状态：</label>
                                    <select name="status" required>
                                        <option value="todo">待处理</option>
                                        <option value="in_progress">进行中</option>
                                        <option value="completed">已完成</option>
                                    </select>
                                </div>
                                <div>
                                    <label>优先级：</label>
                                    <select name="priority" required>
                                        <option value="1">最高</option>
                                        <option value="2">高</option>
                                        <option value="3">中</option>
                                        <option value="4">低</option>
                                        <option value="5">最低</option>
                                    </select>
                                </div>
                                <div>
                                    <label>负责人：</label>
                                    <input type="text" name="assigned_to" required />
                                </div>
                                <div>
                                    <label>截止日期：</label>
                                    <input type="date" name="due_date" />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit">提交</button>
                                <button type="button" onClick={() => setIsModalOpen(false)}>取消</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {tasks.map((task) => (
                    <div key={task.id} style={{ 
                        backgroundColor: '#fff',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>{task.title}</h3>
                            <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor: task.status === 'completed' ? '#e6ffe6' : 
                                               task.status === 'in_progress' ? '#fff3e6' : '#ffe6e6'
                            }}>
                                {task.status === 'completed' ? '已完成' :
                                 task.status === 'in_progress' ? '进行中' : '待处理'}
                            </span>
                        </div>
                        <p>{task.description}</p>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                            <span>优先级: {task.priority}</span>
                            <span>负责人: {task.assigned_to}</span>
                            {task.due_date && <span>截止日期: {new Date(task.due_date).toLocaleDateString()}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskList;
