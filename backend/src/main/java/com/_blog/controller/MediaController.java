package com._blog.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "http://localhost:4200")
public class MediaController {

    private final Cloudinary cloudinary;

    public MediaController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
        }

        try {
            // Determine resource type based on file content type
            String contentType = file.getContentType();
            String resourceType = "auto";
            
            if (contentType != null) {
                if (contentType.startsWith("image/")) {
                    resourceType = "image";
                } else if (contentType.startsWith("video/")) {
                    resourceType = "video";
                }
            }

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", resourceType
            ));
            
            String url = (String) uploadResult.get("secure_url");
            
            return ResponseEntity.ok(Map.of("url", url));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Could not upload the file: " + e.getMessage()));
        }
    }
}
