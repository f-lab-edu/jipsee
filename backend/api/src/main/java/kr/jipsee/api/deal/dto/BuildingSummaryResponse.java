package kr.jipsee.api.deal.dto;

import kr.jipsee.api.common.YearMonthResponse;
import kr.jipsee.deal.dto.DealGroupSummary;

/** 건물 검색 결과 한 건 응답. name과 latestNewJeonseMonth는 null일 수 있음 */
public record BuildingSummaryResponse(
        String id, String name, String lotAddress, YearMonthResponse latestNewJeonseMonth) {

    /** 서비스 결과를 응답으로 변환. id는 summary.key().id() */
    public static BuildingSummaryResponse from(DealGroupSummary summary) {
        return new BuildingSummaryResponse(
                summary.key().id(),
                summary.name(),
                summary.lotAddress(),
                summary.latestNewJeonseMonth() == null ? null : YearMonthResponse.from(summary.latestNewJeonseMonth()));
    }
}
