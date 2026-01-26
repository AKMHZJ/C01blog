package com._blog.dto;

import java.util.List;

public record PostRequest(String title, String excerpt, String category, String image, List<String> content) {}
