package kr.jipsee.deal.application;

import java.time.YearMonth;
import java.util.List;

/** 시군구와 계약 월 단위로 거래 행을 교체함 */
public interface DealReplacer<T> {

    /** 해당 월의 데이터 개수 */
    int countByMonth(String sigunguCode, YearMonth dealMonth);

    /** 기존의 (시군구, 월) row 데이터를 제거하고 rows로 채워넣음*/
    void replace(String sigunguCode, YearMonth dealMonth, List<T> rows);
}
