package kr.jipsee.deal.service;

import java.time.LocalDateTime;
import kr.jipsee.deal.repository.CollectStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 출처별 마지막 수집 시각 저장 */
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
}
