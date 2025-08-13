package com.computing.BuildingsPermitted.repository;

import com.computing.BuildingsPermitted.model.Project;
import com.computing.BuildingsPermitted.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwner(User owner);
    
    List<Project> findByConsultant(User consultant);
    
    List<Project> findByEngineer(User engineer);
    
    List<Project> findByGovernmentBoard(User governmentBoard);
    
    List<Project> findByStatus(String status);
    
    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId OR p.consultant.id = :userId OR p.engineer.id = :userId OR p.governmentBoard.id = :userId")
    List<Project> findByUserInvolved(@Param("userId") Long userId);
    
    List<Project> findByProjectType(String projectType);
    
    List<Project> findByCity(String city);
    
    List<Project> findByState(String state);
}
