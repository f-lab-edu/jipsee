package kr.jipsee.deal.application;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dao.SaleDealDao;
import kr.jipsee.deal.dto.SaleDealRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 매매 거래를 시군구와 계약 월 단위로 교체함 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SaleDealService implements DealReplacer<SaleDealRow> {

    private final SaleDealDao saleDealDao;

    @Override
    public int countByMonth(String sigunguCode, YearMonth dealMonth) {
        return saleDealDao.countByMonth(sigunguCode, dealMonth);
    }

    @Override
    @Transactional
    public void replace(String sigunguCode, YearMonth dealMonth, List<SaleDealRow> rows) {
        saleDealDao.deleteByMonth(sigunguCode, dealMonth);
        saleDealDao.insertAll(rows);
    }
}
