package com.example.taskhub.api;

import com.example.taskhub.audit.ActivityLogger;
import com.example.taskhub.dto.*;
import com.example.taskhub.task.*;
import com.example.taskhub.user.UserEntity;
import com.example.taskhub.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*") // TEMP if you still debug CORS; can remove later
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository tasks;
    private final UserRepository users;
    private final ActivityLogger logger;

    public TaskController(TaskRepository tasks, UserRepository users, ActivityLogger logger){
        this.tasks = tasks; this.users = users; this.logger = logger;
    }

    private String me() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !a.isAuthenticated() || a.getPrincipal() == null
                || "anonymousUser".equals(a.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return a.getPrincipal().toString();
    }

    // Map entity -> slim view DTO to avoid recursion/lazy issues
    private TaskView toView(TaskEntity t) {
        String assigneeUsername = t.getAssignee() != null ? t.getAssignee().getUsername() : null;
        String creatorUsername  = t.getCreatedBy() != null ? t.getCreatedBy().getUsername() : null;
        return new TaskView(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus().name(), t.getDueDate(),
                assigneeUsername, creatorUsername
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public TaskView create(@RequestBody TaskCreateDto dto){
        var creator = users.findByUsername(me()).orElseThrow();
        var assignee = users.findByUsername(dto.assigneeUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignee not found"));
        var t = new TaskEntity();
        t.setTitle(dto.title());
        t.setDescription(dto.description());
        t.setDueDate(dto.dueDate());
        t.setCreatedBy(creator);
        t.setAssignee(assignee);
        t.setStatus(TaskEntity.Status.OPEN);
        var saved = tasks.save(t);
        logger.log(saved.getId(), "CREATED", creator.getUsername(), "{\"assignee\":\""+assignee.getUsername()+"\"}");
        return toView(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public TaskView update(@PathVariable Long id, @RequestBody TaskUpdateDto dto){
        var t = tasks.findById(id).orElseThrow();
        if (dto.title()!=null) t.setTitle(dto.title());
        if (dto.description()!=null) t.setDescription(dto.description());
        if (dto.dueDate()!=null) t.setDueDate(dto.dueDate());
        if (dto.status()!=null) t.setStatus(TaskEntity.Status.valueOf(dto.status()));
        var saved = tasks.save(t);
        logger.log(id, "UPDATED", me(), "{\"title\":\""+saved.getTitle()+"\"}");
        return toView(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public void delete(@PathVariable Long id){
        tasks.deleteById(id);
        logger.log(id, "DELETED", me(), "{}");
    }

    @GetMapping("/assigned")
    public List<TaskView> myAssigned(){
        var username = me();
        return tasks.findByAssignee_Username(username).stream().map(this::toView).toList();
    }

    @GetMapping("/created")
    @PreAuthorize("hasRole('MANAGER')")
    public List<TaskView> myCreated(){
        var username = me();
        return tasks.findByCreatedBy_Username(username).stream().map(this::toView).toList();
    }

    @PatchMapping("/{id}/status")
    public TaskView updateStatus(@PathVariable Long id, @RequestBody StatusDto dto){
        var t = tasks.findById(id).orElseThrow();
        var user = me();
        boolean amManager = users.findByUsername(user)
                .map(UserEntity::getRole).map(r -> r == UserEntity.Role.MANAGER).orElse(false);
        if (!amManager && (t.getAssignee() == null || !user.equals(t.getAssignee().getUsername())))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        t.setStatus(TaskEntity.Status.valueOf(dto.status()));
        var saved = tasks.save(t);
        logger.log(id, "STATUS_CHANGED", user, "{\"status\":\""+dto.status()+"\"}");
        return toView(saved);
    }

    // View DTO
    public record TaskView(
            Long id, String title, String description, String status,
            java.time.LocalDate dueDate, String assigneeUsername, String createdByUsername
    ) {}
}
