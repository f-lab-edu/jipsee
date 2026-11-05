package kr.jipsee.deal.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.RentDealRow;
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
class RentDealServiceTest {

    private static final YearMonth OCTOBER = YearMonth.of(2026, 10);

    @Autowired
    RentDealService service;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from rent_deal");
    }

    private static RentDealRow row(String sigunguCode, LocalDate dealDate, String legalDongName) {
        return new RentDealRow(
                sigunguCode,
                legalDongName,
                "130-69",
                "광명빌라트",
                2004,
                new BigDecimal("69.99"),
                4,
                dealDate,
                31000,
                0,
                null,
                null,
                null,
                null,
                null);
    }

    @Test
    @DisplayName("같은 시군구와 계약 월을 다시 교체해도 행 수가 같음")
    void 같은_시군구와_계약_월을_다시_교체해도_행_수가_같음() {
        // given
        List<RentDealRow> rows = List.of(
                row("11110", LocalDate.of(2026, 10, 1), "동숭동"),
                row("11110", LocalDate.of(2026, 10, 15), "동숭동"),
                row("11110", LocalDate.of(2026, 10, 31), "숭인동"));

        // when
        service.replace("11110", OCTOBER, rows);
        service.replace("11110", OCTOBER, rows);

        // then
        assertThat(service.countByMonth("11110", OCTOBER)).isEqualTo(3);
    }

    @Test
    @DisplayName("교체는 다른 시군구와 다른 달의 행을 지우지 않음")
    void 교체는_다른_시군구와_다른_달의_행을_지우지_않음() {
        // given
        service.replace("11140", OCTOBER, List.of(row("11140", LocalDate.of(2026, 10, 5), "공덕동")));
        service.replace("11110", YearMonth.of(2026, 9), List.of(row("11110", LocalDate.of(2026, 9, 30), "동숭동")));
        service.replace("11110", YearMonth.of(2026, 11), List.of(row("11110", LocalDate.of(2026, 11, 1), "동숭동")));
        service.replace("11110", OCTOBER, List.of(row("11110", LocalDate.of(2026, 10, 31), "동숭동")));

        // when
        service.replace("11110", OCTOBER, List.of());

        // then
        assertThat(service.countByMonth("11110", OCTOBER)).isZero();
        assertThat(service.countByMonth("11140", OCTOBER)).isEqualTo(1);
        assertThat(service.countByMonth("11110", YearMonth.of(2026, 9))).isEqualTo(1);
        assertThat(service.countByMonth("11110", YearMonth.of(2026, 11))).isEqualTo(1);
    }

    @Test
    @DisplayName("삽입이 실패하면 삭제도 취소하고 기존 행을 유지함")
    void 삽입이_실패하면_삭제도_취소하고_기존_행을_유지함() {
        // given
        service.replace(
                "11110",
                OCTOBER,
                List.of(
                        row("11110", LocalDate.of(2026, 10, 1), "동숭동"),
                        row("11110", LocalDate.of(2026, 10, 2), "동숭동")));
        List<RentDealRow> invalid = List.of(
                row("11110", LocalDate.of(2026, 10, 3), "숭인동"),
                row("11110", LocalDate.of(2026, 10, 4), "가".repeat(51))); // legal_dong_name은 varchar(50)

        // when
        Throwable thrown = catchThrowable(() -> service.replace("11110", OCTOBER, invalid));

        // then
        assertThat(thrown).isInstanceOf(DataAccessException.class);
        assertThat(service.countByMonth("11110", OCTOBER)).isEqualTo(2);
        assertThat(jdbcTemplate.queryForList("select distinct legal_dong_name from rent_deal", String.class))
                .containsExactly("동숭동");
    }

    @Test
    @DisplayName("값이 없는 컬럼은 null로 저장하고 매칭 상태는 FAILED, 필지 ID는 null로 둠")
    void 값이_없는_컬럼은_null로_저장하고_매칭_상태는_FAILED_필지_ID는_null로_둠() {
        // given
        RentDealRow row = new RentDealRow(
                "11110",
                "동숭동",
                "130-69",
                null,
                null,
                new BigDecimal("69.99"),
                null,
                LocalDate.of(2026, 10, 25),
                31000,
                0,
                null,
                null,
                null,
                null,
                null);

        // when
        service.replace("11110", OCTOBER, List.of(row));

        // then
        Map<String, Object> saved = jdbcTemplate.queryForMap("select * from rent_deal");
        assertThat(saved).containsEntry("sigungu_code", "11110").containsEntry("match_status", "FAILED");
        assertThat(saved.get("building_parcel_id")).isNull();
        assertThat(saved.get("house_name")).isNull();
        assertThat(saved.get("previous_deposit")).isNull();
        assertThat((BigDecimal) saved.get("exclusive_area")).isEqualByComparingTo("69.99");
        assertThat(saved.get("deposit")).isEqualTo(31000);
    }
}
