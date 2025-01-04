import React, { useState } from 'react';

function ProjectInput() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([
        {
            id: 1270,
            name: '湖南工作管理费.1210-2024142121200331',
            customer: '石炭市直',
            type: '轧机轴承油',
            quantity: 114,
            status: '运行中',
            progress: '0%',
            createTime: '2024-12-12',
            projectTime: '2025-02-18',
            manager: '用页（用页）',
        },
        // 其他初始项目数据...
    ]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSubmitProject = (newProject) => {
        setProjects([...projects, newProject]);
        handleCloseModal();
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
                        <th>项目工程</th>
                        <th>负责人</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td>{project.customer}</td>
                            <td>{project.type}</td>
                            <td>{project.quantity}</td>
                            <td>{project.status}</td>
                            <td>{project.progress}</td>
                            <td>{project.createTime}</td>
                            <td>{project.projectTime}</td>
                            <td>{project.manager}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ProjectInputModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        customer: '',
        type: '',
        quantity: '',
        status: '运行中',
        progress: '0%',
        createTime: '',
        projectTime: '',
        manager: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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