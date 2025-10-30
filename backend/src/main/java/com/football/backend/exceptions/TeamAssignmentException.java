package com.football.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception to be thrown when a business rule related to
 * team/coach assignment is violated.
 * * Responds with a 409 CONFLICT status.
 */
@ResponseStatus(value = HttpStatus.CONFLICT)
public class TeamAssignmentException extends RuntimeException {

    public TeamAssignmentException(String message) {
        super(message);
    }

    public TeamAssignmentException(String message, Throwable cause) {
        super(message, cause);
    }
}

