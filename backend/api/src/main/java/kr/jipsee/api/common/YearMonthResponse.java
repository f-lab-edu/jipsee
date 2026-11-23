package kr.jipsee.api.common;

import java.time.YearMonth;

/** 연월 응답 */
public record YearMonthResponse(int year, int month) {

    /** YearMonth를 연과 월 값으로 변환 */
    public static YearMonthResponse from(YearMonth yearMonth) {
        return new YearMonthResponse(yearMonth.getYear(), yearMonth.getMonthValue());
    }
}
