package kr.jipsee.api.deal.dto;

import kr.jipsee.api.common.YearMonthResponse;
import kr.jipsee.deal.dto.DataSourceStatus;

/** 데이터 출처별 기준 월 응답 */
public record DataSourceResponse(String source, YearMonthResponse baseMonth) {

    /** 출처 상태를 응답으로 변환 */
    public static DataSourceResponse from(DataSourceStatus status) {
        return new DataSourceResponse(status.source(), YearMonthResponse.from(status.baseMonth()));
    }
}
