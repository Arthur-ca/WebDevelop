import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch project details
  const fetchProjectDetails = async (projectId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`);
      setSelectedProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects/`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update projects list and select project when a new project is added
  const addProject = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
    setSelectedProject(newProject); // Automatically select the new project
    // Store in localStorage for persistence
    localStorage.setItem('selectedProjectId', newProject.id.toString());
  };

  // Load selected project from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem('selectedProjectId');
    if (storedId) {
      const project = projects.find(p => p.id.toString() === storedId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projects]);

  // Initial fetch of projects
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
        setProjects,
        loading,
        fetchProjectDetails,
        fetchProjects,
        addProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
