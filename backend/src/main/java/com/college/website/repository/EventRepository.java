package com.college.website.repository;

import com.college.website.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate date);
    List<Event> findAllByOrderByEventDateDesc();
    Optional<Event> findBySlug(String slug);
}
