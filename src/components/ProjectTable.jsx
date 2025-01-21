import React, { useState } from 'react';
import TaskList from './pages/TaskList';
import HomeContent from './pages/Home'
import QualityInspection from './pages/QualityInspection'
import ProjectInput from './pages/ProjectInput'
import QualityReport from './pages/QualityRßeport'
import StaffInput from './pages/StaffInput'

function ProjectTable({ selectedMenu }) {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    return (
        <div>
            {selectedMenu === 'home' && <HomeContent />}
            {selectedMenu === 'quality-inspection' && <QualityInspection projectId={selectedProjectId} />}
            {selectedMenu === 'project-input' && <ProjectInput onProjectSelect={setSelectedProjectId} />}
            {selectedMenu === 'quality-report' && <QualityReport projectId={selectedProjectId} />}
            {selectedMenu === 'task-list' && <TaskList projectId={selectedProjectId} />}
            {selectedMenu === 'staff-input' && <StaffInput />}
        </div>
    );
}

export default ProjectTable;