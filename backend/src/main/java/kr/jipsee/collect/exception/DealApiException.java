package kr.jipsee.collect.exception;

import lombok.Getter;

@Getter
public class DealApiException extends RuntimeException {
    public DealApiException(String message) {
        super(message);
    }
}
