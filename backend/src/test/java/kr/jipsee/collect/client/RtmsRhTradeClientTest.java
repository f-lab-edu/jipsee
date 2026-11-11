package kr.jipsee.collect.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.collect.exception.DealApiException;
import kr.jipsee.deal.dto.SaleDealRow;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.json.JsonMapper;

@ExtendWith(MockitoExtension.class)
class RtmsRhTradeClientTest {

    private static final JsonMapper JSON = JsonMapper.builder().build();
    private static final YearMonth OCTOBER = YearMonth.of(2026, 10);

    @Mock
    DealApiCaller caller;

    @InjectMocks
    RtmsRhTradeClient client;

    private static RtmsItem item(String json) {
        return RtmsItem.of(JSON.readTree(json));
    }

    @Test
    @DisplayName("매매 응답을 sale_deal 컬럼에 맞는 행으로 바꾸고 저장하지 않는 필드는 버림")
    void 매매_응답을_sale_deal_컬럼에_맞는_행으로_바꾸고_저장하지_않는_필드는_버림() {
        // given
        RtmsItem plain = item("""
                {"buildYear":2007,"buyerGbn":"개인","cdealDay":" ","cdealType":" ","dealAmount":"4,800","dealDay":14,
                 "dealMonth":10,"dealYear":2026,"dealingGbn":"중개거래","estateAgentSggNm":"전남광주 나주시",
                 "excluUseAr":74.89,"floor":2,"houseType":"다세대","jibun":"745-5","landAr":52.78,"mhouseNm":"골든빌B",
                 "rgstDate":" ","sggCd":12170,"slerGbn":"개인","umdNm":"이창동"}""");
        given(caller.call(RtmsRhTradeClient.PATH, "12170", OCTOBER, 1))
                .willReturn(new RtmsPage<>("000", 1, List.of(plain)));

        // when
        RtmsPage<SaleDealRow> page = client.fetch("12170", OCTOBER, 1);

        // then
        assertThat(page.items())
                .containsExactly(new SaleDealRow(
                        "12170",
                        "이창동",
                        "745-5",
                        "골든빌B",
                        2007,
                        new BigDecimal("74.89"),
                        2,
                        LocalDate.of(2026, 10, 14),
                        4800,
                        null,
                        null));
    }

    @Test
    @DisplayName("해제된 거래는 해제 구분과 20YY-MM-DD로 바꾼 해제일을 담음")
    void 해제된_거래는_해제_구분과_20YY_MM_DD로_바꾼_해제일을_담음() {
        // given
        RtmsItem cancelled = item("""
                {"buildYear":2007,"cdealDay":"26.03.15","cdealType":"O","dealAmount":4800,"dealDay":14,"dealMonth":10,
                 "dealYear":2025,"excluUseAr":74,"floor":2,"jibun":745,"mhouseNm":" ","sggCd":12170,"umdNm":"이창동"}""");

        // when
        SaleDealRow row = RtmsRhTradeClient.toRow(cancelled);

        // then
        assertThat(row.cancellationType()).isEqualTo("O");
        assertThat(row.cancellationDate()).isEqualTo(LocalDate.of(2026, 3, 15));
        assertThat(row.dealAmount()).isEqualTo(4800);
        assertThat(row.lotNumber()).isEqualTo("745");
        assertThat(row.houseName()).isNull();
    }

    @Test
    @DisplayName("응답 행의 계약 월이 요청과 다르면 DealApiException을 던짐")
    void 응답_행의_계약_월이_요청과_다르면_DealApiException을_던짐() {
        // given
        RtmsItem otherMonth = item("""
                {"dealAmount":4800,"dealDay":14,"dealMonth":9,"dealYear":2026,"excluUseAr":74,"jibun":745,
                 "sggCd":12170,"umdNm":"이창동"}""");
        given(caller.call(RtmsRhTradeClient.PATH, "12170", OCTOBER, 1))
                .willReturn(new RtmsPage<>("000", 1, List.of(otherMonth)));

        // when
        Throwable thrown = catchThrowable(() -> client.fetch("12170", OCTOBER, 1));

        // then
        assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("2026-09");
    }

    @Test
    @DisplayName("응답 행의 시군구가 요청과 다르면 DealApiException을 던짐")
    void 응답_행의_시군구가_요청과_다르면_DealApiException을_던짐() {
        // given
        RtmsItem otherSigungu = item("""
                {"dealAmount":4800,"dealDay":14,"dealMonth":10,"dealYear":2026,"excluUseAr":74,"jibun":745,
                 "sggCd":11110,"umdNm":"동숭동"}""");
        given(caller.call(RtmsRhTradeClient.PATH, "12170", OCTOBER, 1))
                .willReturn(new RtmsPage<>("000", 1, List.of(otherSigungu)));

        // when
        Throwable thrown = catchThrowable(() -> client.fetch("12170", OCTOBER, 1));

        // then
        assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("11110");
    }
}
