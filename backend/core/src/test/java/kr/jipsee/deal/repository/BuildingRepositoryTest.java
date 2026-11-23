package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.GroupDeal;
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

    @Nested
    @DisplayName("조회 범위와 정렬")
    class Scope {

        @Test
        @DisplayName("같은 키의 전월세와 매매 행을 모두 반환함")
        void 같은_키의_전월세와_매매_행을_모두_반환함() {
            // given
            insertRent(1, "망원 OO빌라", SEP_15);
            insertSale(2, "망원 OO빌라", SEP_15);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.deals()).extracting(GroupDeal::type).containsExactlyInAnyOrder("jeonse", "sale");
        }

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
            insertRent(3, new BuildingKey("11440", "망원동", "123-4"), null, SEP_15, 0, null);

            // when & then
            assertThat(history(new BuildingKey("11440", "망원동", "12")).deals())
                    .extracting(GroupDeal::id)
                    .containsExactly(1L);
            assertThat(history(new BuildingKey("11440", "망원동", "123")).deals())
                    .extracting(GroupDeal::id)
                    .containsExactly(2L);
            assertThat(history(new BuildingKey("11440", "망원동", "123-4")).deals())
                    .extracting(GroupDeal::id)
                    .containsExactly(3L);
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
        @DisplayName("같은 날이면 rent_deal의 이름을 반환함")
        void 같은_날이면_rent_deal의_이름을_반환함() {
            // given
            insertRent(10, "전월세 이름", SEP_15);
            insertSale(20, "매매 이름", SEP_15);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.houseName()).isEqualTo("전월세 이름");
        }

        @Test
        @DisplayName("같은 날 같은 테이블이면 큰 id의 이름을 반환함")
        void 같은_날_같은_테이블이면_큰_id의_이름을_반환함() {
            // given
            insertRent(10, "작은 id 이름", SEP_15);
            insertRent(11, "큰 id 이름", SEP_15);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.houseName()).isEqualTo("큰 id 이름");
        }

        @Test
        @DisplayName("가장 늦은 거래의 이름이 자리표시면 더 오래된 정상 이름을 반환함")
        void 가장_늦은_거래의_이름이_자리표시면_더_오래된_정상_이름을_반환함() {
            // given
            insertRent(1, "망원 OO빌라", LocalDate.of(2026, 9, 1));
            insertRent(2, "(254-301)", SEP_15);

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

        @Test
        @DisplayName("가장 늦은 거래의 이름이 null이면 더 오래된 정상 이름을 반환함")
        void 가장_늦은_거래의_이름이_null이면_더_오래된_정상_이름을_반환함() {
            // given
            insertRent(1, "망원 OO빌라", LocalDate.of(2026, 9, 1));
            insertRent(2, null, SEP_15);

            // when
            DealHistory history = history(KEY);

            // then
            assertThat(history.houseName()).isEqualTo("망원 OO빌라");
        }

        @Test
        @DisplayName("모든 행의 이름이 null이면 null")
        void 모든_행의_이름이_null이면_null() {
            // given
            insertRent(1, null, LocalDate.of(2026, 9, 1));
            insertSale(2, null, SEP_15);

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
            assertThat(deal.type()).isEqualTo("jeonse");
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
            assertThat(deal.type()).isEqualTo("wolse");
            assertThat(deal.monthlyRent()).isEqualTo(50);
        }

        @ParameterizedTest
        @CsvSource(
                value = {"신규,new", "갱신,renewal", "기타,NULL", "NULL,NULL"},
                nullValues = "NULL")
        @DisplayName("계약 구분을 new, renewal, null로 변환함")
        void 계약_구분을_new_renewal_null로_변환함(String contractType, String expected) {
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
                    .containsExactlyInAnyOrder(tuple(1L, "sale", 90000, true), tuple(2L, "sale", 90000, false));
            assertThat(deals).allSatisfy(deal -> {
                assertThat(deal.contract()).isNull();
                assertThat(deal.monthlyRent()).isNull();
            });
        }

        @Test
        @DisplayName("계약일에서 월을 변환함")
        void 계약일에서_월을_변환함() {
            // given
            insertRent(1, "망원 OO빌라", SEP_15);

            // when
            GroupDeal deal = history(KEY).deals().get(0);

            // then
            assertThat(deal.month()).isEqualTo(YearMonth.of(2026, 9));
        }
    }
}
