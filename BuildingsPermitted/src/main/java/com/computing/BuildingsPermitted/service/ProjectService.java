package com.computing.BuildingsPermitted.service;

import com.computing.BuildingsPermitted.model.Project;
import com.computing.BuildingsPermitted.model.User;
import com.computing.BuildingsPermitted.repository.ProjectRepository;
import com.computing.BuildingsPermitted.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project createProject(Project project) {
        project.setStatus("pending");
        project.setSubmissionDate(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }



    public List<Project> getProjectsByStatus(String status) {
        return projectRepository.findByStatus(status);
    }

    public Project updateProjectStatus(Long projectId, String newStatus, String notes) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            project.setStatus(newStatus);
            if (notes != null) {
                project.setNotes(notes);
            }
            
            if ("approved".equals(newStatus)) {
                project.setApprovalDate(LocalDateTime.now());
            } else if ("completed".equals(newStatus)) {
                project.setCompletionDate(LocalDateTime.now());
            }
            
            return projectRepository.save(project);
        }
        throw new RuntimeException("Project not found");
    }





    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
