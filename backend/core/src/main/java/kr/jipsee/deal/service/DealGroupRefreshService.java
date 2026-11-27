package kr.jipsee.deal.service;

import kr.jipsee.deal.repository.DealGroupRefreshRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** 건물 검색용 deal_group 갱신 */
@Service
@RequiredArgsConstructor
public class DealGroupRefreshService {

    private final DealGroupRefreshRepository dealGroupRefreshRepository;

    /** MySQL에서 DDL 적용 시 암묵적으로 커밋하기 때문에 트랜잭션 제외 */
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void refresh() {
        dealGroupRefreshRepository.rebuild();
    }
}
