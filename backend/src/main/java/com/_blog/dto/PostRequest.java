package com._blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record PostRequest(
    @NotBlank(message = "Title is required")
    String title, 
    
    String excerpt, 
    
    @NotBlank(message = "Category is required")
    String category, 
    
    String image, 
    
    List<String> mediaUrls,

    @NotEmpty(message = "Content cannot be empty")
    List<String> content
) {}