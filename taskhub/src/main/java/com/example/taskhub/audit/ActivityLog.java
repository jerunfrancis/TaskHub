package com.example.taskhub.audit;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="activity_logs")
public class ActivityLog {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private Long taskId;
    private String action;       // CREATED, UPDATED, STATUS_CHANGED, DELETED
    private String performedBy;  // username
    @Lob private String details; // e.g., JSON or text
    private Instant at = Instant.now();

    // getters & setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public Long getTaskId(){ return taskId; }
    public void setTaskId(Long taskId){ this.taskId = taskId; }
    public String getAction(){ return action; }
    public void setAction(String action){ this.action = action; }
    public String getPerformedBy(){ return performedBy; }
    public void setPerformedBy(String performedBy){ this.performedBy = performedBy; }
    public String getDetails(){ return details; }
    public void setDetails(String details){ this.details = details; }
    public Instant getAt(){ return at; }
    public void setAt(Instant at){ this.at = at; }
}
