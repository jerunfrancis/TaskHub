package com.example.taskhub.task;

import com.example.taskhub.user.UserEntity;
import jakarta.persistence.*;
import java.time.*;

@Entity @Table(name="tasks")
public class TaskEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private String title;
    @Lob private String description;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;
    public enum Status { OPEN, IN_PROGRESS, COMPLETED, CANCELED }

    private LocalDate dueDate;

    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="created_by_id")
    private UserEntity createdBy;

    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="assignee_id")
    private UserEntity assignee;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    @PreUpdate public void touch(){ updatedAt = Instant.now(); }

    // getters & setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title = title; }
    public String getDescription(){ return description; }
    public void setDescription(String description){ this.description = description; }
    public Status getStatus(){ return status; }
    public void setStatus(Status status){ this.status = status; }
    public LocalDate getDueDate(){ return dueDate; }
    public void setDueDate(LocalDate dueDate){ this.dueDate = dueDate; }
    public UserEntity getCreatedBy(){ return createdBy; }
    public void setCreatedBy(UserEntity createdBy){ this.createdBy = createdBy; }
    public UserEntity getAssignee(){ return assignee; }
    public void setAssignee(UserEntity assignee){ this.assignee = assignee; }
}
