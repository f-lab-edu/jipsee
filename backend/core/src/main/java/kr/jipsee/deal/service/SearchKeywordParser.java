package kr.jipsee.deal.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import kr.jipsee.deal.dto.RegionFilter;
import kr.jipsee.deal.dto.SearchCondition;
import kr.jipsee.region.LegalDong;
import kr.jipsee.region.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * 검색어를 단어로 나누고 종류별로 분류해 SearchCondition 생성
 * - 지번, 시군구, 법정동, 이름 순서로 처음 맞는 종류로 분류
 */
@Component
@RequiredArgsConstructor
public class SearchKeywordParser {

    private static final Pattern LOT_WORD = Pattern.compile("^산?[0-9]+(-[0-9]+)?$");
    private static final Pattern NUMERIC_LOT_WORD = Pattern.compile("^[0-9]+(-[0-9]+)?$");
    private static final Pattern LETTER_OR_DIGIT = Pattern.compile("[\\p{L}\\p{N}]");
    private static final String MOUNTAIN = "산";
    private static final int FULLTEXT_MIN_LENGTH = 2;

    private final RegionService regionService;

    /** 검색어를 검색 조건으로 변환 */
    public SearchCondition parse(String keyword) {
        List<String> lotWords = new ArrayList<>();
        List<String> fulltextWords = new ArrayList<>();
        List<String> nameWords = new ArrayList<>();
        List<Set<String>> sigunguCodeSets = new ArrayList<>();
        List<List<LegalDong>> legalDongLists = new ArrayList<>();

        for (String word : splitWords(keyword)) {
            if (LOT_WORD.matcher(word).matches()) {
                lotWords.add(word);
                continue;
            }

            List<String> sigunguCodes = regionService.sigunguCodesByName(word);

            if (!sigunguCodes.isEmpty()) {
                sigunguCodeSets.add(Set.copyOf(sigunguCodes));
                continue;
            }

            List<LegalDong> legalDongs = regionService.legalDongsByName(word);

            if (!legalDongs.isEmpty()) {
                legalDongLists.add(legalDongs);
                continue;
            }

            nameWords.add(word);

            if (word.length() >= FULLTEXT_MIN_LENGTH) {
                fulltextWords.add(word);
            }
        }

        return new SearchCondition(lotWords, toRegionFilter(sigunguCodeSets, legalDongLists), fulltextWords, nameWords);
    }

    /** 공백으로 나누고 큰따옴표와 문자나 숫자가 없는 단어를 제거한 뒤 산과 지번을 합치고 중복을 제거 */
    private List<String> splitWords(String keyword) {
        List<String> cleaned = new ArrayList<>();

        for (String word : keyword.strip().split("\\s+")) {
            String unquoted = word.replace("\"", "");

            if (LETTER_OR_DIGIT.matcher(unquoted).find()) {
                cleaned.add(unquoted);
            }
        }

        List<String> merged = new ArrayList<>();

        for (int i = 0; i < cleaned.size(); i++) {
            String word = cleaned.get(i);
            boolean mountainBeforeLot = MOUNTAIN.equals(word)
                    && i + 1 < cleaned.size()
                    && NUMERIC_LOT_WORD.matcher(cleaned.get(i + 1)).matches();

            if (mountainBeforeLot) {
                merged.add(MOUNTAIN + cleaned.get(i + 1));
                i++;
            } else {
                merged.add(word);
            }
        }

        return merged.stream().distinct().toList();
    }

    /**
     * 지역 단어의 AND 조건 계산
     * - 시군구 단어가 여러 개이면 코드의 교집합
     * - 법정동 단어가 여러 개이면 한 행이 두 법정동 이름을 가질 수 없으므로 NONE
     * - 시군구와 법정동이 함께 있으면 법정동을 그 시군구 코드로 제한
     */
    private RegionFilter toRegionFilter(List<Set<String>> sigunguCodeSets, List<List<LegalDong>> legalDongLists) {
        if (sigunguCodeSets.isEmpty() && legalDongLists.isEmpty()) {
            return RegionFilter.absent();
        }

        Set<String> sigunguCodes = null;

        for (Set<String> codes : sigunguCodeSets) {
            if (sigunguCodes == null) {
                sigunguCodes = new HashSet<>(codes);
            } else {
                sigunguCodes.retainAll(codes);
            }
        }

        if (sigunguCodes != null && sigunguCodes.isEmpty()) {
            return RegionFilter.none();
        }

        if (legalDongLists.isEmpty()) {
            return RegionFilter.sigungu(sigunguCodes);
        }

        if (legalDongLists.size() > 1) {
            return RegionFilter.none();
        }

        Set<String> allowedCodes = sigunguCodes;
        List<LegalDong> legalDongs = legalDongLists.get(0).stream()
                .filter(legalDong -> allowedCodes == null || allowedCodes.contains(legalDong.sigunguCode()))
                .toList();

        return legalDongs.isEmpty() ? RegionFilter.none() : RegionFilter.legalDong(legalDongs);
    }
}
