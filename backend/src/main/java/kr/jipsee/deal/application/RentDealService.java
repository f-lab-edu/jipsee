package kr.jipsee.deal.application;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dao.RentDealDao;
import kr.jipsee.deal.dto.RentDealRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 전월세 거래를 시군구와 계약 월 단위로 교체함 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RentDealService implements DealReplacer<RentDealRow> {

    private final RentDealDao rentDealDao;

    @Override
    public int countByMonth(String sigunguCode, YearMonth dealMonth) {
        return rentDealDao.countByMonth(sigunguCode, dealMonth);
    }

    @Override
    @Transactional
    public void replace(String sigunguCode, YearMonth dealMonth, List<RentDealRow> rows) {
        rentDealDao.deleteByMonth(sigunguCode, dealMonth);
        rentDealDao.insertAll(rows);
    }
}
