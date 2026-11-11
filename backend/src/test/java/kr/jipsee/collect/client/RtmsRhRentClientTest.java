package kr.jipsee.collect.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.collect.exception.DealApiException;
import kr.jipsee.deal.dto.RentDealRow;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.json.JsonMapper;

@ExtendWith(MockitoExtension.class)
class RtmsRhRentClientTest {

    private static final JsonMapper JSON = JsonMapper.builder().build();
    private static final YearMonth OCTOBER = YearMonth.of(2025, 10);

    @Mock
    DealApiCaller caller;

    @InjectMocks
    RtmsRhRentClient client;

    private static RtmsItem item(String json) {
        return RtmsItem.of(JSON.readTree(json));
    }

    @Test
    @DisplayName("전월세 응답을 rent_deal 컬럼에 맞는 행으로 바꾸고 값이 없는 필드는 null로 둠")
    void 전월세_응답을_rent_deal_컬럼에_맞는_행으로_바꾸고_값이_없는_필드는_null로_둠() {
        // given
        RtmsItem plain = item("""
                {"buildYear":2004,"contractTerm":" ","contractType":" ","dealDay":25,"dealMonth":10,"dealYear":2025,
                 "deposit":"31,000","excluUseAr":69.99,"floor":4,"houseType":"다세대","jibun":"130-69",
                 "mhouseNm":"광명빌라트","monthlyRent":0,"preDeposit":" ","preMonthlyRent":" ","sggCd":11110,
                 "umdNm":"동숭동","useRRRight":" "}""");
        RtmsItem renewed = item("""
                {"buildYear":2019,"contractTerm":"26.10~28.09","contractType":"갱신","dealDay":17,"dealMonth":10,
                 "dealYear":2025,"deposit":"4,406","excluUseAr":17.14,"floor":8,"houseType":"다세대","jibun":"193-1",
                 "mhouseNm":"주함해븐타워(2동)","monthlyRent":17,"preDeposit":66,"preMonthlyRent":38,"sggCd":11110,
                 "umdNm":"연지동","useRRRight":" "}""");
        given(caller.call(RtmsRhRentClient.PATH, "11110", OCTOBER, 1))
                .willReturn(new RtmsPage<>("000", 2, List.of(plain, renewed)));

        // when
        RtmsPage<RentDealRow> page = client.fetch("11110", OCTOBER, 1);

        // then
        assertThat(page.resultCode()).isEqualTo("000");
        assertThat(page.totalCount()).isEqualTo(2);
        assertThat(page.items())
                .containsExactly(
                        new RentDealRow(
                                "11110",
                                "동숭동",
                                "130-69",
                                "광명빌라트",
                                2004,
                                new BigDecimal("69.99"),
                                4,
                                LocalDate.of(2025, 10, 25),
                                31000,
                                0,
                                null,
                                null,
                                null,
                                null,
                                null),
                        new RentDealRow(
                                "11110",
                                "연지동",
                                "193-1",
                                "주함해븐타워(2동)",
                                2019,
                                new BigDecimal("17.14"),
                                8,
                                LocalDate.of(2025, 10, 17),
                                4406,
                                17,
                                66,
                                38,
                                "26.10~28.09",
                                "갱신",
                                null));
    }

    @Test
    @DisplayName("숫자로 온 지번과 건물명, 콤마가 있는 월세도 행으로 바꿈")
    void 숫자로_온_지번과_건물명_콤마가_있는_월세도_행으로_바꿈() {
        // given
        RtmsItem numeric = item("""
                {"buildYear":1990,"contractTerm":" ","contractType":" ","dealDay":3,"dealMonth":10,"dealYear":2025,
                 "deposit":5000,"excluUseAr":64,"floor":-1,"jibun":130,"mhouseNm":12,"monthlyRent":"1,070",
                 "preDeposit":" ","preMonthlyRent":" ","sggCd":11110,"umdNm":"동숭동","useRRRight":" "}""");

        // when
        RentDealRow row = RtmsRhRentClient.toRow(numeric);

        // then
        assertThat(row.lotNumber()).isEqualTo("130");
        assertThat(row.houseName()).isEqualTo("12");
        assertThat(row.monthlyRent()).isEqualTo(1070);
        assertThat(row.deposit()).isEqualTo(5000);
        assertThat(row.floor()).isEqualTo(-1);
        assertThat(row.exclusiveArea()).isEqualByComparingTo("64");
    }

    @Test
    @DisplayName("응답 행의 계약 월이 요청과 다르면 DealApiException을 던짐")
    void 응답_행의_계약_월이_요청과_다르면_DealApiException을_던짐() {
        // given
        RtmsItem otherMonth = item("""
                {"dealDay":3,"dealMonth":9,"dealYear":2025,"deposit":5000,"excluUseAr":64,"jibun":130,"monthlyRent":0,
                 "sggCd":11110,"umdNm":"동숭동"}""");
        given(caller.call(RtmsRhRentClient.PATH, "11110", OCTOBER, 1))
                .willReturn(new RtmsPage<>("000", 1, List.of(otherMonth)));

        // when
        Throwable thrown = catchThrowable(() -> client.fetch("11110", OCTOBER, 1));

        // then
        assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("2025-09");
    }

    @Test
    @DisplayName("응답 행의 시군구가 요청과 다르면 DealApiException을 던짐")
    void 응답_행의_시군구가_요청과_다르면_DealApiException을_던짐() {
        // given
        RtmsItem otherSigungu = item("""
                {"dealDay":3,"dealMonth":10,"dealYear":2025,"deposit":5000,"excluUseAr":64,"jibun":130,"monthlyRent":0,
                 "sggCd":11140,"umdNm":"공덕동"}""");
        given(caller.call(RtmsRhRentClient.PATH, "11110", OCTOBER, 1))
                .willReturn(new RtmsPage<>("000", 1, List.of(otherSigungu)));

        // when
        Throwable thrown = catchThrowable(() -> client.fetch("11110", OCTOBER, 1));

        // then
        assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("11140");
    }
}
