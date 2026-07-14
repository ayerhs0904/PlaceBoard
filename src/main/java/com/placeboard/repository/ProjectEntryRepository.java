package com.placeboard.repository;

import com.placeboard.entity.ProjectEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectEntryRepository extends JpaRepository<ProjectEntry, Long> {
    List<ProjectEntry> findByUserId(Long userId);
}
