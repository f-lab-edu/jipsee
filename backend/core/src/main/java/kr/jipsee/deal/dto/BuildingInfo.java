package kr.jipsee.deal.dto;

import java.util.List;

/** 건물 상세 조회 결과 */
public record BuildingInfo(BuildingKey key, String name, String address, List<GroupDeal> deals) {}
