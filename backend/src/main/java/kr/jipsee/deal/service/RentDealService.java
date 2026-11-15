package kr.jipsee.deal.service;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.RentDealRow;
import kr.jipsee.deal.repository.RentDealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 전월세 거래를 시군구와 계약 월 단위로 교체함 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RentDealService implements DealReplacer<RentDealRow> {

    private final RentDealRepository rentDealRepository;

    @Override
    public int countByMonth(String sigunguCode, YearMonth dealMonth) {
        return rentDealRepository.countByMonth(sigunguCode, dealMonth);
    }

    @Override
    @Transactional
    public void replace(String sigunguCode, YearMonth dealMonth, List<RentDealRow> rows) {
        rentDealRepository.deleteByMonth(sigunguCode, dealMonth);
        rentDealRepository.insertAll(rows);
    }
}
