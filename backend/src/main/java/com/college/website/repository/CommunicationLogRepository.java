package com.college.website.repository;

import com.college.website.entity.CommunicationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {

    List<CommunicationLog> findByReferenceNoOrderByCreatedAtDesc(String referenceNo);

    @Query("SELECT c FROM CommunicationLog c WHERE " +
           "(:recipientType IS NULL OR c.recipientType = :recipientType) AND " +
           "(:channel IS NULL OR c.channel = :channel) AND " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(c.referenceNo) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(c.recipientName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(c.recipientTarget) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    Page<CommunicationLog> findWithFilters(@Param("recipientType") String recipientType,
                                          @Param("channel") String channel,
                                          @Param("search") String search,
                                          Pageable pageable);
}

