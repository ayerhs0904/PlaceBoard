package com.placeboard.repository;

import com.placeboard.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    boolean existsByUserIdAndCompanyId(Long userId, Long companyId);
    Optional<Application> findByUserIdAndCompanyId(Long userId, Long companyId);
}
