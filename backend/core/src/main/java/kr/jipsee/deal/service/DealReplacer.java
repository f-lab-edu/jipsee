package kr.jipsee.deal.service;

import java.time.YearMonth;
import java.util.List;

/** 시군구와 계약 월 단위로 거래 행을 교체함 */
public interface DealReplacer<T> {

    /** 시군구의 해당 계약 월 거래 개수 */
    int countByMonth(String sigunguCode, YearMonth dealMonth);

    /** 시군구의 해당 계약 월 거래를 모두 삭제하고 rows로 교체. rows는 모두 같은 시군구와 계약 월에 속해야 함 */
    void replace(String sigunguCode, YearMonth dealMonth, List<T> rows);
}
