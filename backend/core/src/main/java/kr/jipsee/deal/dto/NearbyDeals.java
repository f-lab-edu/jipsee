package kr.jipsee.deal.dto;

import java.util.List;

/** 주변 거래 조회 결과 한 페이지 */
public record NearbyDeals(List<NearbyDealItem> deals, boolean hasNext, long totalCount) {}
