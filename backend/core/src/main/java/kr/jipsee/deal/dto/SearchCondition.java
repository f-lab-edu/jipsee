package kr.jipsee.deal.dto;

import java.util.List;

/**
 * 건물 검색 조건
 * - lotWords는 지번 단어, fulltextWords는 FULLTEXT 대상 이름 단어, nameWords는 locate 대상 이름 단어 전체(FULLTEXT 단어와 1자 단어)
 */
public record SearchCondition(
        List<String> lotWords, RegionFilter region, List<String> fulltextWords, List<String> nameWords) {

    /** 지역 조건이 있거나 FULLTEXT 단어가 있어야 검색 가능. 지역 조건을 만족하는 지역이 없으면 불가 */
    public boolean searchable() {
        RegionFilter.Status status = region.status();

        if (status == RegionFilter.Status.NONE) {
            return false;
        }

        return !fulltextWords.isEmpty()
                || status == RegionFilter.Status.SIGUNGU
                || status == RegionFilter.Status.LEGAL_DONG;
    }
}
