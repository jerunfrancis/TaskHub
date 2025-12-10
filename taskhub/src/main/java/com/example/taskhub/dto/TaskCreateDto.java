package com.example.taskhub.dto;

import java.time.LocalDate;

public record TaskCreateDto(
        String title,
        String description,
        String assigneeUsername,
        LocalDate dueDate
) {}
