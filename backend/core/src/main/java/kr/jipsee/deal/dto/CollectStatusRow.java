package kr.jipsee.deal.dto;

import java.time.LocalDateTime;

/** collect_status 테이블의 한 행 */
public record CollectStatusRow(String source, LocalDateTime loadedAt) {}
