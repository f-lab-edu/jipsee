package kr.jipsee.deal.dto;

import java.util.List;

/** 건물 이력. key는 정렬된 첫 행의 DB 값, houseName은 글자가 있는 가장 늦은 이름 */
public record DealHistory(BuildingKey key, String houseName, List<GroupDeal> deals) {}
