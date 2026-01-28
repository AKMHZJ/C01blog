package com._blog.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(com._blog.exception.ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(com._blog.exception.ResourceNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problemDetail.setTitle("Resource Not Found");
        problemDetail.setType(URI.create("https://blog-network.com/errors/not-found"));
        return problemDetail;
    }

    @ExceptionHandler(com._blog.exception.ForbiddenException.class)
    public ProblemDetail handleForbidden(com._blog.exception.ForbiddenException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
        problemDetail.setTitle("Forbidden");
        problemDetail.setType(URI.create("https://blog-network.com/errors/forbidden"));
        return problemDetail;
    }

    @ExceptionHandler(com._blog.exception.BannedUserException.class)
    public ProblemDetail handleBannedUser(com._blog.exception.BannedUserException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
        problemDetail.setTitle("Account Banned");
        problemDetail.setType(URI.create("https://blog-network.com/errors/banned"));
        return problemDetail;
    }

    @ExceptionHandler(com._blog.exception.BadRequestException.class)
    public ProblemDetail handleBadRequest(com._blog.exception.BadRequestException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problemDetail.setTitle("Bad Request");
        problemDetail.setType(URI.create("https://blog-network.com/errors/bad-request"));
        return problemDetail;
    }

    @ExceptionHandler(com._blog.exception.ConflictException.class)
    public ProblemDetail handleConflict(com._blog.exception.ConflictException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problemDetail.setTitle("Conflict");
        problemDetail.setType(URI.create("https://blog-network.com/errors/conflict"));
        return problemDetail;
    }

    @ExceptionHandler(RuntimeException.class)
    public ProblemDetail handleRuntimeException(RuntimeException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problemDetail.setTitle("Runtime Error");
        problemDetail.setType(URI.create("https://blog-network.com/errors/runtime-error"));
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, errorMessage);
        problemDetail.setTitle("Validation Error");
        problemDetail.setType(URI.create("https://blog-network.com/errors/validation-error"));
        return problemDetail;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneralException(Exception ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setType(URI.create("https://blog-network.com/errors/server-error"));
        return problemDetail;
    }
}
