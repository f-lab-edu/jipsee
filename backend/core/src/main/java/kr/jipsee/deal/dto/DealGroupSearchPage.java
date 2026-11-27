package kr.jipsee.deal.dto;

import java.util.List;

/** 건물 검색 결과 한 페이지 */
public record DealGroupSearchPage(List<DealGroupSummary> buildings, boolean hasNext) {}
