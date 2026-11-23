package kr.jipsee.deal.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.DataSourceStatus;
import kr.jipsee.deal.repository.CollectStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 출처별 마지막 수집 시각 저장과 기준 월 조회 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CollectStatusService {

    private final CollectStatusRepository collectStatusRepository;

    /** 출처의 마지막 수집 시각 저장 */
    @Transactional
    public void saveLoadedAt(String source, LocalDateTime loadedAt) {
        collectStatusRepository.saveLoadedAt(source, loadedAt);
    }

    /** 출처별 기준 월 조회. 저장소 순서 유지 */
    public List<DataSourceStatus> findAll() {
        return collectStatusRepository.findAll().stream()
                .map(row -> new DataSourceStatus(row.source(), YearMonth.from(row.loadedAt())))
                .toList();
    }
}
