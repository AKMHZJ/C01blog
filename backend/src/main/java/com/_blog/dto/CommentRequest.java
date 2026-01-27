package com._blog.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(
    @NotBlank(message = "Comment text cannot be empty")
    String text
) {}