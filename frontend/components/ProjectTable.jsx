import React from 'react';
import TaskList from './pages/TaskList';
import HomeContent from './pages/Home'
import QualityInspection from './pages/QualityInspection'
import ProjectInput from './pages/ProjectInput'
import QualityReport from './pages/QualityReport'
import StaffInput from './pages/StaffInput'

function ProjectTable({ selectedMenu }) {
    return (
        <div>
            {selectedMenu === 'home' && <HomeContent />}
            {selectedMenu === 'quality-inspection' && <QualityInspection />}
            {selectedMenu === 'project-input' && <ProjectInput />}
            {selectedMenu === 'quality-report' && <QualityReport />}
            {selectedMenu === 'task-list' && <TaskList />}
            {selectedMenu === 'staff-input' && <StaffInput />}
        </div>
    );
}

export default ProjectTable;
