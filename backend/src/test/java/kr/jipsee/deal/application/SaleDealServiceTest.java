package kr.jipsee.deal.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.SaleDealRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class SaleDealServiceTest {

    private static final YearMonth OCTOBER = YearMonth.of(2026, 10);

    @Autowired
    SaleDealService service;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from sale_deal");
    }

    private static SaleDealRow row(String sigunguCode, LocalDate dealDate, String legalDongName) {
        return new SaleDealRow(
                sigunguCode,
                legalDongName,
                "745-5",
                "골든빌B",
                2007,
                new BigDecimal("74.89"),
                2,
                dealDate,
                4800,
                null,
                null);
    }

    @Test
    @DisplayName("같은 시군구와 계약 월을 다시 교체해도 행 수가 같음")
    void 같은_시군구와_계약_월을_다시_교체해도_행_수가_같음() {
        // given
        List<SaleDealRow> rows = List.of(
                row("12170", LocalDate.of(2026, 10, 1), "이창동"),
                row("12170", LocalDate.of(2026, 10, 15), "이창동"),
                row("12170", LocalDate.of(2026, 10, 31), "금천면 오강리"));

        // when
        service.replace("12170", OCTOBER, rows);
        service.replace("12170", OCTOBER, rows);

        // then
        assertThat(service.countByMonth("12170", OCTOBER)).isEqualTo(3);
    }

    @Test
    @DisplayName("교체는 다른 시군구와 다른 달의 행을 지우지 않음")
    void 교체는_다른_시군구와_다른_달의_행을_지우지_않음() {
        // given
        service.replace("11110", OCTOBER, List.of(row("11110", LocalDate.of(2026, 10, 5), "동숭동")));
        service.replace("12170", YearMonth.of(2026, 9), List.of(row("12170", LocalDate.of(2026, 9, 30), "이창동")));
        service.replace("12170", YearMonth.of(2026, 11), List.of(row("12170", LocalDate.of(2026, 11, 1), "이창동")));
        service.replace("12170", OCTOBER, List.of(row("12170", LocalDate.of(2026, 10, 31), "이창동")));

        // when
        service.replace("12170", OCTOBER, List.of());

        // then
        assertThat(service.countByMonth("12170", OCTOBER)).isZero();
        assertThat(service.countByMonth("11110", OCTOBER)).isEqualTo(1);
        assertThat(service.countByMonth("12170", YearMonth.of(2026, 9))).isEqualTo(1);
        assertThat(service.countByMonth("12170", YearMonth.of(2026, 11))).isEqualTo(1);
    }

    @Test
    @DisplayName("삽입이 실패하면 삭제도 취소하고 기존 행을 유지함")
    void 삽입이_실패하면_삭제도_취소하고_기존_행을_유지함() {
        // given
        service.replace(
                "12170",
                OCTOBER,
                List.of(
                        row("12170", LocalDate.of(2026, 10, 1), "이창동"),
                        row("12170", LocalDate.of(2026, 10, 2), "이창동")));
        List<SaleDealRow> invalid = List.of(
                row("12170", LocalDate.of(2026, 10, 3), "금천면 오강리"),
                row("12170", LocalDate.of(2026, 10, 4), "가".repeat(51))); // legal_dong_name은 varchar(50)

        // when
        Throwable thrown = catchThrowable(() -> service.replace("12170", OCTOBER, invalid));

        // then
        assertThat(thrown).isInstanceOf(DataAccessException.class);
        assertThat(service.countByMonth("12170", OCTOBER)).isEqualTo(2);
        assertThat(jdbcTemplate.queryForList("select distinct legal_dong_name from sale_deal", String.class))
                .containsExactly("이창동");
    }

    @Test
    @DisplayName("해제된 거래는 해제 구분과 해제일을 저장하고 매칭 상태는 FAILED로 둠")
    void 해제된_거래는_해제_구분과_해제일을_저장하고_매칭_상태는_FAILED로_둠() {
        // given
        SaleDealRow cancelled = new SaleDealRow(
                "12170",
                "이창동",
                "745-5",
                null,
                null,
                new BigDecimal("74.89"),
                null,
                LocalDate.of(2026, 10, 14),
                4800,
                "O",
                LocalDate.of(2026, 11, 2));

        // when
        service.replace("12170", OCTOBER, List.of(cancelled));

        // then
        Map<String, Object> saved = jdbcTemplate.queryForMap("select * from sale_deal");
        assertThat(saved).containsEntry("cancellation_type", "O").containsEntry("match_status", "FAILED");
        assertThat(saved.get("cancellation_date")).isEqualTo(Date.valueOf("2026-11-02"));
        assertThat(saved.get("building_parcel_id")).isNull();
        assertThat(saved.get("deal_amount")).isEqualTo(4800);
    }
}
