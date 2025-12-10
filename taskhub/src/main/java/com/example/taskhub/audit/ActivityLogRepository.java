package com.example.taskhub.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByTaskIdOrderByAtDesc(Long taskId);
}
