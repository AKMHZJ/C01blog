package com._blog.controller;

import com._blog.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getCurrentUser(userDetails);
    }

    @PutMapping("/me")
    public Map<String, Object> updateProfile(@RequestBody ProfileUpdateRequest request,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        return userService.updateProfile(request, userDetails);
    }

    @PostMapping("/{id}/follow")
    public Map<String, Object> toggleFollow(@PathVariable("id") Long targetId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return userService.toggleFollow(targetId, userDetails);
    }

    @GetMapping("/me/following")
    public List<String> getMyFollowing(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getMyFollowing(userDetails);
    }

    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return userService.getAllUsers();
    }

    public record ProfileUpdateRequest(String displayName, String bio, String avatar) {}
}