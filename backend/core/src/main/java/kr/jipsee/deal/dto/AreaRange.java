package kr.jipsee.deal.dto;

import java.math.BigDecimal;

/** 전용면적 범위. 단위 ㎡ */
public record AreaRange(BigDecimal min, BigDecimal max) {}
