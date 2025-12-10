package com.example.taskhub.audit;

import org.springframework.stereotype.Service;

@Service
public class ActivityLogger {
    private final ActivityLogRepository repo;
    public ActivityLogger(ActivityLogRepository repo){ this.repo = repo; }

    public void log(Long taskId, String action, String by, String details){
        var l = new ActivityLog();
        l.setTaskId(taskId); l.setAction(action); l.setPerformedBy(by); l.setDetails(details);
        repo.save(l);
    }

    public java.util.List<ActivityLog> getLogs(Long taskId){
        return repo.findByTaskIdOrderByAtDesc(taskId);
    }
}
