package kr.jipsee.deal.dao;

import java.time.YearMonth;
import java.util.List;
import java.util.Objects;
import kr.jipsee.deal.dto.SaleDealRow;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** sale_deal DAO (JdbcTemplate) */
@Repository
@RequiredArgsConstructor
public class SaleDealDao {
    private final JdbcTemplate jdbcTemplate;

    /** 시군구의 해당 계약 월 거래의 개수 반환 */
    public int countByMonth(String sigunguCode, YearMonth dealMonth) {
        String sql = "select count(*) from sale_deal where sigungu_code = ? and deal_date >= ? and deal_date < ?";
        Integer countByMonth = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                sigunguCode,
                dealMonth.atDay(1),
                dealMonth.plusMonths(1).atDay(1));

        return Objects.requireNonNull(countByMonth);
    }

    /** 시군구의 해당 계약 월 거래를 모두 삭제함 */
    public void deleteByMonth(String sigunguCode, YearMonth dealMonth) {
        String sql = "delete from sale_deal where sigungu_code = ? and deal_date >= ? and deal_date < ?";
        jdbcTemplate.update(
                sql, sigunguCode, dealMonth.atDay(1), dealMonth.plusMonths(1).atDay(1));
    }

    /** 행을 한 번의 배치로 삽입함. 매칭 상태는 FAILED로 둠 */
    public void insertAll(List<SaleDealRow> rows) {
        String sql = "insert into sale_deal (sigungu_code, legal_dong_name, lot_number, house_name, build_year,"
                + " exclusive_area, floor, deal_date, deal_amount, cancellation_type, cancellation_date, match_status)"
                + " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'FAILED')";
        jdbcTemplate.batchUpdate(sql, rows.stream().map(SaleDealRow::toArray).toList());
    }
}
