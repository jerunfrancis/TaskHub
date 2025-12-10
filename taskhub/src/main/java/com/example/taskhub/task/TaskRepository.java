package com.example.taskhub.task;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    // ✅ navigate nested props with underscore
    List<TaskEntity> findByAssignee_Username(String username);
    List<TaskEntity> findByCreatedBy_Username(String username);
}
