package kr.jipsee.deal.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.CollectSource;
import kr.jipsee.deal.dto.DealGroupRow;
import kr.jipsee.deal.dto.DealGroupSearchPage;
import kr.jipsee.deal.dto.DealGroupSummary;
import kr.jipsee.deal.dto.SearchCondition;
import kr.jipsee.deal.repository.DealGroupSearchRepository;
import kr.jipsee.region.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 건물 검색 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingSearchService {

    private static final int PAGE_SIZE = 20;
    private static final int JEONSE_WINDOW_MONTHS = 12;

    private final SearchKeywordParser searchKeywordParser;
    private final DealGroupSearchRepository dealGroupSearchRepository;
    private final CollectStatusService collectStatusService;
    private final RegionService regionService;

    /**
     * 검색어와 page(0부터)로 건물 한 페이지 조회
     * - keyword와 page는 컨트롤러가 이미 검사하므로 서비스는 다시 검사하지 않음
     * - 검색할 수 없는 조건이면 조회 없이 빈 결과를 반환함
     * - 21행을 조회해 21번째 행이 있으면 hasNext
     */
    public DealGroupSearchPage search(String keyword, int page) {
        SearchCondition condition = searchKeywordParser.parse(keyword);

        if (!condition.searchable()) {
            return empty();
        }

        List<DealGroupRow> rows = dealGroupSearchRepository.search(condition, (long) page * PAGE_SIZE);

        if (rows.isEmpty()) {
            return empty();
        }

        LocalDate windowStart =
                baseMonth().minusMonths(JEONSE_WINDOW_MONTHS - 1).atDay(1);
        List<DealGroupSummary> buildings = rows.stream()
                .limit(PAGE_SIZE)
                .map(row -> toSummary(row, windowStart))
                .toList();

        return new DealGroupSearchPage(buildings, rows.size() > PAGE_SIZE);
    }

    private DealGroupSearchPage empty() {
        return new DealGroupSearchPage(List.of(), false);
    }

    /** 수집 현황의 RENT_DEAL 기준 월. 행이 없으면 불변 조건 위반으로 IllegalStateException 발생 */
    private YearMonth baseMonth() {
        return collectStatusService.findAll().stream()
                .filter(status -> CollectSource.RENT_DEAL.equals(status.source()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("collect_status에 RENT_DEAL 행이 없습니다."))
                .baseMonth();
    }

    /** 신규 전세 계약일이 기준 월 11개월 전의 1일 이상이면 그 연월, 아니면 null. 시군구명이 없으면 IllegalStateException 발생 */
    private DealGroupSummary toSummary(DealGroupRow row, LocalDate windowStart) {
        LocalDate jeonseDate = row.latestNewJeonseDate();
        YearMonth latestNewJeonseMonth =
                jeonseDate != null && !jeonseDate.isBefore(windowStart) ? YearMonth.from(jeonseDate) : null;
        String sigunguName = regionService.sigunguName(row.sigunguCode());

        if (sigunguName == null) {
            throw new IllegalStateException("시군구명을 찾을 수 없음: " + row.sigunguCode());
        }

        String lotAddress = sigunguName + " " + row.legalDongName() + " " + row.lotNumber();

        return new DealGroupSummary(
                new BuildingKey(row.sigunguCode(), row.legalDongName(), row.lotNumber()),
                row.name(),
                lotAddress,
                latestNewJeonseMonth);
    }
}
