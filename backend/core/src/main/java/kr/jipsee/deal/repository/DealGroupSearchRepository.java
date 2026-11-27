package kr.jipsee.deal.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import kr.jipsee.deal.dto.DealGroupRow;
import kr.jipsee.deal.dto.RegionFilter;
import kr.jipsee.deal.dto.SearchCondition;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/** deal_group 검색 조회 (NamedParameterJdbcTemplate) */
@Repository
@RequiredArgsConstructor
public class DealGroupSearchRepository {

    private static final String SELECT_FROM = """
            select sigungu_code, legal_dong_name, lot_number, name, last_deal_date, latest_new_jeonse_date
            from deal_group
            """;
    private static final String ORDER_AND_LIMIT = """

            order by last_deal_date desc, sigungu_code, legal_dong_name, lot_number
            limit 21 offset :offset
            """;
    private static final String SIGUNGU_CONDITION = "sigungu_code in (:codes)";
    private static final String LEGAL_DONG_CONDITION = "(sigungu_code, legal_dong_name) in (:pairs)";
    private static final String LOT_REGEXP = "(^|[^0-9산-])%s([^0-9]|$)";
    private static final String MOUNTAIN_LOT_REGEXP = "(^|[^0-9-])%s([^0-9]|$)";

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    /**
     * 조건에 맞는 건물을 최근 계약일 내림차순, 같으면 키 오름차순으로 최대 21행 조회
     * - 지역 조건이 NONE이거나 시군구 코드, 법정동 쌍 목록이 비어 있으면 IllegalArgumentException 발생
     */
    public List<DealGroupRow> search(SearchCondition condition, long offset) {
        MapSqlParameterSource params = new MapSqlParameterSource("offset", offset);
        List<String> conditions = new ArrayList<>();

        if (!condition.fulltextWords().isEmpty()) {
            conditions.add("match(name) against(:fulltext in boolean mode)");
            params.addValue(
                    "fulltext",
                    condition.fulltextWords().stream()
                            .map(word -> "+\"" + word + "\"")
                            .collect(Collectors.joining(" ")));
        }

        addNameConditions(condition.nameWords(), conditions, params);
        addRegionCondition(condition.region(), conditions, params);
        addLotConditions(condition.lotWords(), conditions, params);

        String sql = SELECT_FROM + "where " + String.join(" and ", conditions) + ORDER_AND_LIMIT;

        return namedParameterJdbcTemplate.query(
                sql,
                params,
                (rs, rowNum) -> new DealGroupRow(
                        rs.getString("sigungu_code"),
                        rs.getString("legal_dong_name"),
                        rs.getString("lot_number"),
                        rs.getString("name"),
                        rs.getObject("last_deal_date", LocalDate.class),
                        rs.getObject("latest_new_jeonse_date", LocalDate.class)));
    }

    private void addNameConditions(List<String> nameWords, List<String> conditions, MapSqlParameterSource params) {
        IntStream.range(0, nameWords.size()).forEach(i -> {
            conditions.add("locate(:name" + i + ", name) > 0");
            params.addValue("name" + i, nameWords.get(i));
        });
    }

    private void addRegionCondition(RegionFilter region, List<String> conditions, MapSqlParameterSource params) {
        switch (region.status()) {
            case ABSENT -> {}
            case SIGUNGU -> {
                requireNotEmpty(region.sigunguCodes().isEmpty());
                conditions.add(SIGUNGU_CONDITION);
                params.addValue("codes", region.sigunguCodes());
            }
            case LEGAL_DONG -> {
                requireNotEmpty(region.legalDongs().isEmpty());
                conditions.add(LEGAL_DONG_CONDITION);
                params.addValue(
                        "pairs",
                        region.legalDongs().stream()
                                .map(legalDong -> new Object[] {legalDong.sigunguCode(), legalDong.name()})
                                .toList());
            }
            case NONE -> throw new IllegalArgumentException("조건을 만족하는 지역이 없어 조회할 수 없음");
        }
    }

    private void addLotConditions(List<String> lotWords, List<String> conditions, MapSqlParameterSource params) {
        IntStream.range(0, lotWords.size()).forEach(i -> {
            String word = lotWords.get(i);
            String format = word.startsWith("산") ? MOUNTAIN_LOT_REGEXP : LOT_REGEXP;

            conditions.add("lot_number regexp :lot" + i);
            params.addValue("lot" + i, format.formatted(word));
        });
    }

    private void requireNotEmpty(boolean empty) {
        if (empty) {
            throw new IllegalArgumentException("지역 조건 목록이 비어 있어 조회할 수 없음");
        }
    }
}
