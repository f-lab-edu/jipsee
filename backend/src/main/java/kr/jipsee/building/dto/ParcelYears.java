package kr.jipsee.building.dto;

import java.util.Set;

/** 필지 ID, 동 행 유무, 사용승인 연도 집합 */
public record ParcelYears(long parcelId, boolean hasRegisters, Set<Integer> years) {}
