package com.example.taskhub.dto;

import java.time.LocalDate;

public record TaskUpdateDto(
        String title,
        String description,
        LocalDate dueDate,
        String status
) {}
