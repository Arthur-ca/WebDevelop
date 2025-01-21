import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ProjectContext } from '../../components/ProjectContext';

function ProjectInput() {
    const { projects, setProjects, addProject, setSelectedProject } = useContext(ProjectContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects`);
                setProjects(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("加载项目失败，请稍后重试。");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSubmitProject = async (newProject) => {
        try {
            // Format and validate dates
            const createDate = new Date(newProject.createTime);
            const endDate = new Date(newProject.projectTime);

            // Validate dates
            if (isNaN(createDate.getTime()) || isNaN(endDate.getTime())) {
                setError("日期格式无效，请检查输入。");
                return;
            }

            const projectData = {
                name: newProject.name,
                customer: newProject.customer,
                type: newProject.type,
                manager: newProject.manager,
                description: "",  // Empty string as we now store these fields separately
                status: newProject.status || '运行中',
                start_date: createDate.toISOString(),
                end_date: endDate.toISOString()
            };
            console.log('Submitting project data:', projectData);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/projects/`, projectData);

            addProject(response.data);
            setError(null);
            handleCloseModal();
        } catch (err) {
            console.error("Error creating project:", err);
            setError("创建项目失败，请稍后重试。");
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button onClick={handleOpenModal}>创建</button>
            </div>

            {isModalOpen && (
                <ProjectInputModal
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitProject}
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    加载中...
                </div>
            ) : error ? (
                <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
                    {error}
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>项目编号</th>
                            <th>项目名称</th>
                            <th>客户名称</th>
                            <th>项目类型</th>
                            <th>零件数量</th>
                            <th>状态</th>
                            <th>进度</th>
                            <th>创建时间</th>
                            <th>截止日期</th>
                            <th>负责人</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{project.id}</td>
                                <td>{project.name}</td>
                                <td>{project.customer || '-'}</td>
                                <td>{project.type || '-'}</td>
                                <td>{project.quantity || '-'}</td>
                                <td>{project.status}</td>
                                <td>{project.progress || '0%'}</td>
                                <td>{new Date(project.start_date).toLocaleDateString()}</td>
                                <td>{project.end_date ? new Date(project.end_date).toLocaleDateString() : '-'}</td>
                                <td>{project.manager || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function ProjectInputModal({ onClose, onSubmit }) {
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        customer: '',
        type: '',
        quantity: '',
        status: '运行中',
        progress: '0%',
        createTime: today,
        projectTime: today,
        manager: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Ensure dates are properly formatted
        if (name === 'createTime' || name === 'projectTime') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>项目录入</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>项目编号:</label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>项目名称:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>客户名称:</label>
                        <input
                            type="text"
                            name="customer"
                            value={formData.customer}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>项目类型:</label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>零件数量:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>创建时间:</label>
                        <input
                            type="date"
                            name="createTime"
                            value={formData.createTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>项目工程:</label>
                        <input
                            type="date"
                            name="projectTime"
                            value={formData.projectTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>负责人:</label>
                        <input
                            type="text"
                            name="manager"
                            value={formData.manager}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit">提交</button>
                        <button type="button" onClick={onClose}>取消</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectInput;
