package kr.jipsee.api.deal.dto;

import static kr.jipsee.api.exception.ValidationPayload.InvalidRequest;
import static kr.jipsee.api.exception.ValidationPayload.KeywordTooShort;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import kr.jipsee.api.deal.validation.MaxWords;

/**
 * 건물 검색 요청
 *
 * - keyword는 앞뒤 공백 제거, page는 없으면 0
 * - 검사 순서는 keyword(KeywordRules), page(Default 그룹)
 */
@GroupSequence({BuildingSearchRequest.KeywordRules.class, BuildingSearchRequest.class})
public record BuildingSearchRequest(
        @Size(min = 2, groups = KeywordRules.class, payload = KeywordTooShort.class)
        @Size(max = 100, groups = KeywordRules.class, payload = InvalidRequest.class)
        @MaxWords(value = 10, groups = KeywordRules.class, payload = InvalidRequest.class)
        String keyword,

        @Min(value = 0, payload = InvalidRequest.class) Integer page) {

    public BuildingSearchRequest {
        keyword = keyword == null ? "" : keyword.strip();
        page = page == null ? 0 : page;
    }

    interface KeywordRules {}
}
