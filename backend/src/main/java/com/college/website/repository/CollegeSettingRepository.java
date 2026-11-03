package com.college.website.repository;

import com.college.website.entity.CollegeSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeSettingRepository extends JpaRepository<CollegeSetting, Long> {
    Optional<CollegeSetting> findBySettingKey(String settingKey);
    List<CollegeSetting> findByCategory(String category);
}
