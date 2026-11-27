package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.AreaRange;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.ContractType;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.DealType;
import kr.jipsee.deal.dto.GroupDeal;
import kr.jipsee.deal.dto.NearbyDealRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class BuildingRepositoryTest {

    private static final BuildingKey KEY = new BuildingKey("11440", "망원동", "519");
    private static final LocalDate SEP_15 = LocalDate.of(2026, 9, 15);

    @Autowired
    BuildingRepository buildingRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from rent_deal");
        jdbcTemplate.update("delete from sale_deal");
    }

    /** 전세 59.99㎡, 보증금 30000 */
    private void insertRent(
            long id, BuildingKey key, String houseName, LocalDate dealDate, int monthlyRent, String contractType) {
        jdbcTemplate.update(
                "insert into rent_deal (id, sigungu_code, legal_dong_name, lot_number, house_name, exclusive_area,"
                        + " deal_date, deposit, monthly_rent, contract_type) values (?, ?, ?, ?, ?, 59.99, ?, 30000, ?, ?)",
                id,
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber(),
                houseName,
                dealDate,
                monthlyRent,
                contractType);
    }

    private void insertRent(long id, String houseName, LocalDate dealDate) {
        insertRent(id, KEY, houseName, dealDate, 0, null);
    }

    /** 매매 84.50㎡, 거래금액 90000 */
    private void insertSale(long id, BuildingKey key, String houseName, LocalDate dealDate, String cancellationType) {
        jdbcTemplate.update(
                "insert into sale_deal (id, sigungu_code, legal_dong_name, lot_number, house_name, exclusive_area,"
                        + " deal_date, deal_amount, cancellation_type) values (?, ?, ?, ?, ?, 84.50, ?, 90000, ?)",
                id,
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber(),
                houseName,
                dealDate,
                cancellationType);
    }

    private void insertSale(long id, String houseName, LocalDate dealDate) {
        insertSale(id, KEY, houseName, dealDate, null);
    }

    private DealHistory history(BuildingKey key) {
        return buildingRepository.findHistory(key).orElseThrow();
    }

    /** 면적과 월세를 지정한 전월세 행. 보증금 30000 */
    private void insertRentWith(
            long id,
            BuildingKey key,
            String houseName,
            LocalDate dealDate,
            String area,
            int monthlyRent,
            String contractType) {
        jdbcTemplate.update(
                "insert into rent_deal (id, sigungu_code, legal_dong_name, lot_number, house_name, exclusive_area,"
                        + " deal_date, deposit, monthly_rent, contract_type) values (?, ?, ?, ?, ?, ?, ?, 30000, ?, ?)",
                id,
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber(),
                houseName,
                new BigDecimal(area),
                dealDate,
                monthlyRent,
                contractType);
    }

    /** 면적을 지정한 매매 행. 거래금액 90000 */
    private void insertSaleWith(long id, BuildingKey key, LocalDate dealDate, String area, String cancellationType) {
        jdbcTemplate.update(
                "insert into sale_deal (id, sigungu_code, legal_dong_name, lot_number, exclusive_area,"
                        + " deal_date, deal_amount, cancellation_type) values (?, ?, ?, ?, ?, ?, 90000, ?)",
                id,
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber(),
                new BigDecimal(area),
                dealDate,
                cancellationType);
    }

    @Nested
    @DisplayName("조회 범위와 정렬")
    class Scope {

        @Test
        @DisplayName("계약일 내림차순, 같은 날은 rent_deal 먼저, 같은 테이블은 큰 id 먼저 정렬함")
        void 계약일_내림차순_같은_날은_rent_deal_먼저_같은_테이블은_큰_id_먼저_정렬함() {
            // given
            insertRent(1, "망원 OO빌라", LocalDate.of(2026, 9, 10));
            insertRent(10, "망원 OO빌라", SEP_15);
            insertSale(20, "망원 OO빌라", SEP_15);
            insertRent(11, "망원 OO빌라", SEP_15);
            insertSale(21, "망원 OO빌라", SEP_15);
            insertRent(2, "망원 OO빌라", LocalDate.of(2026, 9, 20));

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.deals()).extracting(GroupDeal::id).containsExactly(2L, 11L, 10L, 21L, 20L, 1L);
        }

        @Test
        @DisplayName("지번이 접두로만 일치하는 행은 제외함")
        void 지번이_접두로만_일치하는_행은_제외함() {
            // given
            insertRent(1, new BuildingKey("11440", "망원동", "12"), null, SEP_15, 0, null);
            insertRent(2, new BuildingKey("11440", "망원동", "123"), null, SEP_15, 0, null);
            insertSale(3, new BuildingKey("11440", "망원동", "123"), null, SEP_15, null);

            // when
            DealHistory history = history(new BuildingKey("11440", "망원동", "12"));

            // then
            assertThat(history.deals()).extracting(GroupDeal::id).containsExactly(1L);
        }

        @Test
        @DisplayName("법정동 또는 시군구 하나만 다른 행은 제외함")
        void 법정동_또는_시군구_하나만_다른_행은_제외함() {
            // given
            insertRent(1, "망원 OO빌라", SEP_15);
            insertRent(2, new BuildingKey("11440", "합정동", "519"), null, SEP_15, 0, null);
            insertRent(3, new BuildingKey("11380", "망원동", "519"), null, SEP_15, 0, null);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.deals()).extracting(GroupDeal::id).containsExactly(1L);
        }

        @Test
        @DisplayName("지번이 null인 행은 어느 키에도 나오지 않음")
        void 지번이_null인_행은_어느_키에도_나오지_않음() {
            // given
            insertRent(1, "망원 OO빌라", SEP_15);
            insertRent(2, new BuildingKey("11440", "망원동", null), null, SEP_15, 0, null);

            // when
            Optional<DealHistory> nullLotHistory =
                    buildingRepository.findHistory(new BuildingKey("11440", "망원동", null));

            // then
            assertThat(history(KEY).deals()).extracting(GroupDeal::id).containsExactly(1L);
            assertThat(nullLotHistory).isEmpty();
        }

        @Test
        @DisplayName("이력이 없으면 empty")
        void 이력이_없으면_empty() {
            // when
            Optional<DealHistory> history = buildingRepository.findHistory(KEY);

            // then
            assertThat(history).isEmpty();
        }

        @Test
        @DisplayName("키는 요청 값이 아니라 DB 값임")
        void 키는_요청_값이_아니라_DB_값임() {
            // given
            insertRent(1, "망원 OO빌라", SEP_15);

            // when
            DealHistory history = history(new BuildingKey("11440", "망원동", "５１９"));

            // then
            assertThat(history.key()).isEqualTo(KEY);
        }
    }

    @Nested
    @DisplayName("이름 선택")
    class Name {

        @Test
        @DisplayName("가장 늦은 거래가 매매면 그 매매의 이름을 반환함")
        void 가장_늦은_거래가_매매면_그_매매의_이름을_반환함() {
            // given
            insertRent(1, "옛 이름", LocalDate.of(2026, 9, 1));
            insertSale(2, "새 이름", SEP_15);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.houseName()).isEqualTo("새 이름");
        }

        @Test
        @DisplayName("더 늦은 거래의 이름이 자리표시나 null이면 더 오래된 정상 이름을 반환함")
        void 더_늦은_거래의_이름이_자리표시나_null이면_더_오래된_정상_이름을_반환함() {
            // given
            insertRent(1, "망원 OO빌라", LocalDate.of(2026, 9, 1));
            insertRent(2, "(254-301)", SEP_15);
            insertRent(3, null, LocalDate.of(2026, 9, 20));

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.houseName()).isEqualTo("망원 OO빌라");
        }

        @Test
        @DisplayName("자리표시만 있으면 null")
        void 자리표시만_있으면_null() {
            // given
            insertRent(1, "(254-301)", LocalDate.of(2026, 9, 1));
            insertRent(2, "373-3", SEP_15);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.houseName()).isNull();
        }
    }

    @Nested
    @DisplayName("필드 변환")
    class Conversion {

        @Test
        @DisplayName("월세가 0이면 전세로 변환함")
        void 월세가_0이면_전세로_변환함() {
            // given
            insertRent(1, KEY, null, SEP_15, 0, null);

            // when
            GroupDeal deal = history(KEY).deals().get(0);

            // then
            assertThat(deal.month()).isEqualTo(YearMonth.of(2026, 9));
            assertThat(deal.type()).isEqualTo(DealType.JEONSE);
            assertThat(deal.monthlyRent()).isNull();
            assertThat(deal.amount()).isEqualTo(30000);
            assertThat(deal.cancelled()).isFalse();
            assertThat(deal.exclusiveArea()).isEqualByComparingTo("59.99");
        }

        @Test
        @DisplayName("월세가 0보다 크면 월세로 변환함")
        void 월세가_0보다_크면_월세로_변환함() {
            // given
            insertRent(1, KEY, null, SEP_15, 50, null);

            // when
            GroupDeal deal = history(KEY).deals().get(0);

            // then
            assertThat(deal.type()).isEqualTo(DealType.WOLSE);
            assertThat(deal.monthlyRent()).isEqualTo(50);
        }

        @ParameterizedTest
        @CsvSource(
                value = {"신규,NEW", "갱신,RENEWAL", "기타,NULL"},
                nullValues = "NULL")
        @DisplayName("계약 구분을 new, renewal, null로 변환함")
        void 계약_구분을_new_renewal_null로_변환함(String contractType, ContractType expected) {
            // given
            insertRent(1, KEY, null, SEP_15, 0, contractType);

            // when
            GroupDeal deal = history(KEY).deals().get(0);

            // then
            assertThat(deal.contract()).isEqualTo(expected);
        }

        @Test
        @DisplayName("매매는 sale이고 계약 구분과 월세가 null이며 해제 여부를 변환함")
        void 매매는_sale이고_계약_구분과_월세가_null이며_해제_여부를_변환함() {
            // given
            insertSale(1, KEY, null, LocalDate.of(2026, 9, 10), "O");
            insertSale(2, KEY, null, LocalDate.of(2026, 9, 20), null);

            // when
            List<GroupDeal> deals = history(KEY).deals();

            // then
            assertThat(deals)
                    .extracting(GroupDeal::id, GroupDeal::type, GroupDeal::amount, GroupDeal::cancelled)
                    .containsExactlyInAnyOrder(
                            tuple(1L, DealType.SALE, 90000, true), tuple(2L, DealType.SALE, 90000, false));
            assertThat(deals).allSatisfy(deal -> {
                assertThat(deal.contract()).isNull();
                assertThat(deal.monthlyRent()).isNull();
            });
        }
    }

    @Nested
    @DisplayName("findAreaRange")
    class FindAreaRange {

        @Test
        @DisplayName("전월세 최솟값과 매매 최댓값을 합산함")
        void 전월세_최솟값과_매매_최댓값을_합산함() {
            // given
            insertRentWith(1, KEY, null, SEP_15, "20.00", 0, null);
            insertRentWith(2, KEY, null, SEP_15, "30.00", 0, null);
            insertSaleWith(3, KEY, SEP_15, "60.00", null);

            // when
            AreaRange range = buildingRepository.findAreaRange(KEY).orElseThrow();

            // then
            assertThat(range.min()).isEqualByComparingTo("20.00");
            assertThat(range.max()).isEqualByComparingTo("60.00");
        }

        @Test
        @DisplayName("해제된 매매의 면적도 범위에 포함함")
        void 해제된_매매의_면적도_범위에_포함함() {
            // given
            insertRentWith(1, KEY, null, SEP_15, "20.00", 0, null);
            insertSaleWith(2, KEY, SEP_15, "70.00", "O");

            // when
            AreaRange range = buildingRepository.findAreaRange(KEY).orElseThrow();

            // then
            assertThat(range.max()).isEqualByComparingTo("70.00");
        }

        @Test
        @DisplayName("지번이 접두로만 일치하는 행의 면적은 반영하지 않음")
        void 지번이_접두로만_일치하는_행의_면적은_반영하지_않음() {
            // given
            insertRentWith(1, new BuildingKey("11440", "망원동", "12"), null, SEP_15, "20.00", 0, null);
            insertRentWith(2, new BuildingKey("11440", "망원동", "123"), null, SEP_15, "30.00", 0, null);
            insertSaleWith(3, new BuildingKey("11440", "망원동", "123"), SEP_15, "70.00", null);

            // when
            AreaRange range = buildingRepository
                    .findAreaRange(new BuildingKey("11440", "망원동", "12"))
                    .orElseThrow();

            // then
            assertThat(range.min()).isEqualByComparingTo("20.00");
            assertThat(range.max()).isEqualByComparingTo("20.00");
        }

        @Test
        @DisplayName("거래가 없으면 empty")
        void 거래가_없으면_empty() {
            // when
            Optional<AreaRange> range = buildingRepository.findAreaRange(KEY);

            // then
            assertThat(range).isEmpty();
        }

        @Test
        @DisplayName("면적이 0인 행은 범위에서 제외하고 0인 행만 있으면 empty")
        void 면적이_0인_행은_범위에서_제외하고_0인_행만_있으면_empty() {
            // given
            insertRentWith(1, KEY, null, SEP_15, "0.0000", 0, null);
            insertRentWith(2, KEY, null, SEP_15, "20.00", 0, null);
            BuildingKey zeroOnly = new BuildingKey("11440", "망원동", "700");
            insertRentWith(3, zeroOnly, null, SEP_15, "0.0000", 0, null);

            // when
            AreaRange range = buildingRepository.findAreaRange(KEY).orElseThrow();
            Optional<AreaRange> zeroOnlyRange = buildingRepository.findAreaRange(zeroOnly);

            // then
            assertThat(range.min()).isEqualByComparingTo("20.00");
            assertThat(zeroOnlyRange).isEmpty();
        }
    }

    @Nested
    @DisplayName("findNearbyDeals와 countNearbyDeals")
    class Nearby {

        private static final LocalDate FROM = LocalDate.of(2025, 12, 1);
        private static final LocalDate TO = LocalDate.of(2026, 11, 30);
        private static final AreaRange RANGE = new AreaRange(new BigDecimal("20.0000"), new BigDecimal("60.0000"));

        private List<NearbyDealRow> list(boolean jeonse, long offset) {
            return buildingRepository.findNearbyDeals(KEY, FROM, TO, RANGE, jeonse, offset);
        }

        private long count(boolean jeonse) {
            return buildingRepository.countNearbyDeals(KEY, FROM, TO, RANGE, jeonse);
        }

        private void rent(long id, BuildingKey key, LocalDate dealDate, String area, int monthlyRent) {
            insertRentWith(id, key, null, dealDate, area, monthlyRent, null);
        }

        @Test
        @DisplayName("같은 시군구와 법정동의 다른 지번은 포함하고 다른 법정동과 시군구는 제외함")
        void 같은_시군구와_법정동의_다른_지번은_포함하고_다른_법정동과_시군구는_제외함() {
            // given
            rent(1, KEY, SEP_15, "59.99", 0);
            rent(2, new BuildingKey("11440", "망원동", "520"), SEP_15, "59.99", 0);
            rent(3, new BuildingKey("11440", "합정동", "519"), SEP_15, "59.99", 0);
            rent(4, new BuildingKey("11380", "망원동", "519"), SEP_15, "59.99", 0);

            // when
            List<NearbyDealRow> rows = list(true, 0);

            // then
            assertThat(rows).extracting(NearbyDealRow::id).containsExactlyInAnyOrder(1L, 2L);
            assertThat(count(true)).isEqualTo(2);
        }

        @Test
        @DisplayName("지번이 null인 거래도 목록에 포함함")
        void 지번이_null인_거래도_목록에_포함함() {
            // given
            rent(1, new BuildingKey("11440", "망원동", null), SEP_15, "59.99", 0);

            // when
            List<NearbyDealRow> rows = list(true, 0);

            // then
            assertThat(rows).extracting(NearbyDealRow::id).containsExactly(1L);
            assertThat(rows.get(0).lotNumber()).isNull();
        }

        @Test
        @DisplayName("같은 조건의 매매 거래는 목록과 건수에 나타나지 않음")
        void 같은_조건의_매매_거래는_목록과_건수에_나타나지_않음() {
            // given
            rent(1, KEY, SEP_15, "59.99", 0);
            insertSaleWith(10, KEY, SEP_15, "59.99", null);

            // when
            List<NearbyDealRow> rows = list(true, 0);

            // then
            assertThat(rows).extracting(NearbyDealRow::id).containsExactly(1L);
            assertThat(count(true)).isEqualTo(1);
        }

        @Test
        @DisplayName("전세는 월세가 0인 행만, 월세는 월세가 0보다 큰 행만 목록과 건수에 포함함")
        void 전세는_월세가_0인_행만_월세는_월세가_0보다_큰_행만_목록과_건수에_포함함() {
            // given
            rent(1, KEY, SEP_15, "59.99", 0);
            rent(2, KEY, SEP_15, "59.99", 50);

            // when & then
            assertThat(list(true, 0)).extracting(NearbyDealRow::id).containsExactly(1L);
            assertThat(list(false, 0)).extracting(NearbyDealRow::id).containsExactly(2L);
            assertThat(count(true)).isEqualTo(1);
            assertThat(count(false)).isEqualTo(1);
        }

        @Test
        @DisplayName("from과 to와 같은 날 거래는 포함하고 하루 밖은 제외함")
        void from과_to와_같은_날_거래는_포함하고_하루_밖은_제외함() {
            // given
            rent(1, KEY, FROM, "59.99", 0);
            rent(2, KEY, TO, "59.99", 0);
            rent(3, KEY, FROM.minusDays(1), "59.99", 0);
            rent(4, KEY, TO.plusDays(1), "59.99", 0);

            // when
            List<NearbyDealRow> rows = list(true, 0);

            // then
            assertThat(rows).extracting(NearbyDealRow::id).containsExactlyInAnyOrder(1L, 2L);
            assertThat(count(true)).isEqualTo(2);
        }

        @Test
        @DisplayName("범위 경계와 같은 면적은 포함하고 0.0001 밖은 제외함")
        void 범위_경계와_같은_면적은_포함하고_0_0001_밖은_제외함() {
            // given
            rent(1, KEY, SEP_15, "20.0000", 0);
            rent(2, KEY, SEP_15, "60.0000", 0);
            rent(3, KEY, SEP_15, "19.9999", 0);
            rent(4, KEY, SEP_15, "60.0001", 0);

            // when
            List<NearbyDealRow> rows = list(true, 0);

            // then
            assertThat(rows).extracting(NearbyDealRow::id).containsExactlyInAnyOrder(1L, 2L);
            assertThat(count(true)).isEqualTo(2);
        }

        @Test
        @DisplayName("계약일 내림차순, 같은 날은 id 내림차순으로 정렬함")
        void 계약일_내림차순_같은_날은_id_내림차순으로_정렬함() {
            // given
            rent(1, KEY, LocalDate.of(2026, 9, 10), "59.99", 0);
            rent(2, KEY, LocalDate.of(2026, 9, 20), "59.99", 0);
            rent(3, KEY, LocalDate.of(2026, 9, 20), "59.99", 0);
            rent(4, KEY, LocalDate.of(2026, 9, 15), "59.99", 0);

            // when
            List<NearbyDealRow> rows = list(true, 0);

            // then
            assertThat(rows).extracting(NearbyDealRow::id).containsExactly(3L, 2L, 4L, 1L);
        }

        @Test
        @DisplayName("한 페이지는 20건이고 offset만큼 건너뜀")
        void 한_페이지는_20건이고_offset만큼_건너뜀() {
            // given
            for (long id = 1; id <= 25; id++) {
                rent(id, KEY, SEP_15, "59.99", 0);
            }

            // when & then
            assertThat(list(true, 0)).hasSize(20);
            assertThat(list(true, 20)).hasSize(5);
            assertThat(list(true, 25)).isEmpty();
            assertThat(list(true, 100)).isEmpty();
        }

        @Test
        @DisplayName("전세와 월세의 type과 monthlyRent를 변환함")
        void 전세와_월세의_type과_monthlyRent를_변환함() {
            // given
            rent(1, KEY, SEP_15, "59.99", 0);
            rent(2, KEY, SEP_15, "59.99", 50);

            // when
            NearbyDealRow jeonse = list(true, 0).get(0);
            NearbyDealRow wolse = list(false, 0).get(0);

            // then
            assertThat(jeonse.type()).isEqualTo(DealType.JEONSE);
            assertThat(jeonse.monthlyRent()).isNull();
            assertThat(jeonse.amount()).isEqualTo(30000);
            assertThat(wolse.type()).isEqualTo(DealType.WOLSE);
            assertThat(wolse.monthlyRent()).isEqualTo(50);
        }

        @ParameterizedTest
        @CsvSource(
                value = {"신규,NEW", "갱신,RENEWAL", "기타,NULL"},
                nullValues = "NULL")
        @DisplayName("계약 구분을 new, renewal, null로 변환함")
        void 계약_구분을_new_renewal_null로_변환함(String contractType, ContractType expected) {
            // given
            insertRentWith(1, KEY, null, SEP_15, "59.99", 0, contractType);

            // when
            NearbyDealRow row = list(true, 0).get(0);

            // then
            assertThat(row.contract()).isEqualTo(expected);
        }

        @ParameterizedTest
        @CsvSource(
                value = {"(254-301),NULL", "망원 OO빌라,망원 OO빌라"},
                nullValues = "NULL")
        @DisplayName("건물명은 글자가 없으면 null로 정규화하고 글자가 있으면 그대로 반환함")
        void 건물명은_글자가_없으면_null로_정규화하고_글자가_있으면_그대로_반환함(String houseName, String expected) {
            // given
            insertRentWith(1, KEY, houseName, SEP_15, "59.99", 0, null);

            // when
            NearbyDealRow row = list(true, 0).get(0);

            // then
            assertThat(row.houseName()).isEqualTo(expected);
        }

        @Test
        @DisplayName("월과 시군구 코드, 법정동명, 지번을 행 값 그대로 반환함")
        void 월과_시군구_코드_법정동명_지번을_행_값_그대로_반환함() {
            // given
            rent(1, KEY, SEP_15, "59.99", 0);

            // when
            NearbyDealRow row = list(true, 0).get(0);

            // then
            assertThat(row.month()).isEqualTo(YearMonth.of(2026, 9));
            assertThat(row.sigunguCode()).isEqualTo("11440");
            assertThat(row.legalDongName()).isEqualTo("망원동");
            assertThat(row.lotNumber()).isEqualTo("519");
        }
    }
}
