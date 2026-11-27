package kr.jipsee.deal.dto;

import java.util.List;
import java.util.Set;
import kr.jipsee.region.LegalDong;

/**
 * 검색어의 지역 조건
 * - ABSENT는 지역 단어 없음, SIGUNGU는 시군구 코드 조건, LEGAL_DONG은 법정동 쌍 조건
 * - NONE은 지역 단어가 있으나 조건을 만족하는 지역이 없음
 */
public record RegionFilter(Status status, Set<String> sigunguCodes, List<LegalDong> legalDongs) {

    public enum Status {
        ABSENT,
        SIGUNGU,
        LEGAL_DONG,
        NONE
    }

    public static RegionFilter absent() {
        return new RegionFilter(Status.ABSENT, Set.of(), List.of());
    }

    public static RegionFilter none() {
        return new RegionFilter(Status.NONE, Set.of(), List.of());
    }

    public static RegionFilter sigungu(Set<String> sigunguCodes) {
        return new RegionFilter(Status.SIGUNGU, sigunguCodes, List.of());
    }

    public static RegionFilter legalDong(List<LegalDong> legalDongs) {
        return new RegionFilter(Status.LEGAL_DONG, Set.of(), legalDongs);
    }
}
