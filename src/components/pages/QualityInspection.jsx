import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QualityInspection({ projectId }) {
    const [project, setProject] = useState(null);
    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectResponse, inspectionsResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/quality-inspections/?project_id=${projectId}`)
                ]);
                setProject(projectResponse.data);
                setInspections(inspectionsResponse.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load inspection data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>;
    }

    if (!project) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>未找到项目信息</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', height: '100%' }}>
            {/* 左侧：项目基本信息 */}
            <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                <h2>项目基本信息</h2>
                <div>
                    <p><strong>项目名称：</strong>{project.name}</p>
                    <p><strong>描述：</strong>{project.description}</p>
                    <p><strong>状态：</strong>{project.status}</p>
                    <p><strong>开始时间：</strong>{new Date(project.start_date).toLocaleDateString()}</p>
                    <p><strong>结束时间：</strong>{project.end_date ? new Date(project.end_date).toLocaleDateString() : '未设置'}</p>
                </div>
            </div>

            {/* 中间：质量检测表单 */}
            <div style={{ flex: 2, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                <h2>新增质量检测</h2>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    try {
                        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/quality-inspections/`, {
                            project_id: projectId,
                            inspector: formData.get('inspector'),
                            category: formData.get('category'),
                            result: formData.get('result'),
                            notes: formData.get('notes'),
                            measurements: parseFloat(formData.get('measurements')),
                            is_critical: formData.get('is_critical') === 'true'
                        });
                        setInspections([...inspections, response.data]);
                        e.target.reset();
                    } catch (err) {
                        console.error("Error creating inspection:", err);
                        setError("Failed to create inspection. Please try again.");
                    }
                }}>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label>检验员：</label>
                            <input type="text" name="inspector" required />
                        </div>
                        <div>
                            <label>检测类型：</label>
                            <select name="category" required>
                                <option value="material">材料检测</option>
                                <option value="process">过程检测</option>
                                <option value="final_product">成品检测</option>
                            </select>
                        </div>
                        <div>
                            <label>检测结果：</label>
                            <select name="result" required>
                                <option value="pass">合格</option>
                                <option value="fail">不合格</option>
                                <option value="needs_review">需复检</option>
                            </select>
                        </div>
                        <div>
                            <label>测量值：</label>
                            <input type="number" name="measurements" step="0.01" />
                        </div>
                        <div>
                            <label>备注：</label>
                            <textarea name="notes"></textarea>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" name="is_critical" value="true" />
                                关键检测项
                            </label>
                        </div>
                    </div>
                    <button type="submit" style={{ marginTop: '1rem' }}>提交检测记录</button>
                </form>
            </div>

            {/* 右侧：质量检测信息 */}
            <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                <h2>质量检测记录</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {inspections.map((inspection) => (
                        <div key={inspection.id} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                            <p><strong>检验员：</strong>{inspection.inspector}</p>
                            <p><strong>类型：</strong>{inspection.category}</p>
                            <p><strong>结果：</strong>{inspection.result}</p>
                            {inspection.measurements && (
                                <p><strong>测量值：</strong>{inspection.measurements}</p>
                            )}
                            {inspection.notes && (
                                <p><strong>备注：</strong>{inspection.notes}</p>
                            )}
                            <p><strong>时间：</strong>{new Date(inspection.inspection_date).toLocaleString()}</p>
                            {inspection.is_critical && (
                                <p style={{ color: 'red' }}><strong>关键检测项</strong></p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QualityInspection;
