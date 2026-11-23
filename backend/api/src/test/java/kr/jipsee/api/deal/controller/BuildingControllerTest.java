package kr.jipsee.api.deal.controller;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.BuildingInfo;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealType;
import kr.jipsee.deal.dto.GroupDeal;
import kr.jipsee.deal.dto.NearbyDealItem;
import kr.jipsee.deal.dto.NearbyDeals;
import kr.jipsee.deal.service.BuildingService;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(BuildingController.class)
class BuildingControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    BuildingService buildingService;

    private static BuildingInfo info(BuildingKey key, String name) {
        GroupDeal deal = new GroupDeal(
                7, YearMonth.of(2026, 9), DealType.JEONSE, null, new BigDecimal("59.99"), 30000, null, false);
        return new BuildingInfo(key, name, "마포구 " + key.legalDongName() + " " + key.lotNumber(), List.of(deal));
    }

    private static void assertBuildingNotFound(ResultActions result) throws Exception {
        result.andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.code").value("BUILDING_NOT_FOUND"))
                .andExpect(jsonPath("$.detail").value("요청한 건물을 찾을 수 없습니다."));
    }

    @Nested
    @DisplayName("GET /buildings/{id}")
    class GetBuilding {

        @Test
        @DisplayName("응답의 id와 name은 문자열, 숫자 필드는 숫자, cancelled는 boolean임")
        void 응답의_id와_name은_문자열_숫자_필드는_숫자_cancelled는_boolean임() throws Exception {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            given(buildingService.find(key)).willReturn(info(key, "망원 OO빌라"));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}", "11440-망원동-519"));

            // then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value("11440-망원동-519"))
                    .andExpect(jsonPath("$.data.name").isString())
                    .andExpect(jsonPath("$.data.deals[0].id").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].amount").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].exclusiveArea").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].month.year").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].month.month").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].cancelled").isBoolean())
                    .andExpect(jsonPath("$.data.deals[0].type").value("jeonse"));
        }

        @Test
        @DisplayName("null 필드도 키를 유지함")
        void null_필드도_키를_유지함() throws Exception {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            given(buildingService.find(key)).willReturn(info(key, null));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}", "11440-망원동-519"));

            // then
            result.andExpect(jsonPath("$.data.name").value(nullValue()))
                    .andExpect(jsonPath("$.data.deals[0].contract").value(nullValue()))
                    .andExpect(jsonPath("$.data.deals[0].monthlyRent").value(nullValue()));
        }

        @Test
        @DisplayName("id 형식이 맞지 않으면 서비스를 호출하지 않고 404를 반환함")
        void id_형식이_맞지_않으면_서비스를_호출하지_않고_404를_반환함() throws Exception {
            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}", "abc"));

            // then
            assertBuildingNotFound(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("서비스가 BUILDING_NOT_FOUND를 던지면 404를 반환함")
        void 서비스가_BUILDING_NOT_FOUND를_던지면_404를_반환함() throws Exception {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            given(buildingService.find(key)).willThrow(new BusinessException(ErrorCode.BUILDING_NOT_FOUND));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}", "11440-망원동-519"));

            // then
            assertBuildingNotFound(result);
        }
    }

    @Nested
    @DisplayName("GET /buildings/{id}/nearby-deals")
    class GetNearbyDeals {

        private static final BuildingKey KEY = new BuildingKey("11440", "망원동", "519");
        private static final String ID = "11440-망원동-519";

        private NearbyDeals nearby(String contract, Integer monthlyRent) {
            NearbyDealItem item = new NearbyDealItem(
                    5,
                    "jeonse",
                    "망원 OO빌라",
                    YearMonth.of(2026, 9),
                    contract,
                    new BigDecimal("59.99"),
                    30000,
                    monthlyRent);
            return new NearbyDeals(List.of(item), true, 45);
        }

        private void givenAnyRequest() {
            given(buildingService.findNearbyDeals(any(), anyInt(), anyBoolean(), anyInt()))
                    .willReturn(nearby(null, null));
        }

        private void assertInvalidRequest(ResultActions result) throws Exception {
            result.andExpect(status().isBadRequest())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                    .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
        }

        @Test
        @DisplayName("쿼리가 없으면 period 12, jeonse, page 0으로 서비스를 호출함")
        void 쿼리가_없으면_period_12_jeonse_page_0으로_서비스를_호출함() throws Exception {
            // given
            given(buildingService.findNearbyDeals(KEY, 12, true, 0)).willReturn(nearby(null, null));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}/nearby-deals", ID));

            // then
            result.andExpect(status().isOk());
            then(buildingService).should().findNearbyDeals(KEY, 12, true, 0);
        }

        @Test
        @DisplayName("값이 빈 쿼리도 기본값으로 호출하고 400이 아님")
        void 값이_빈_쿼리도_기본값으로_호출하고_400이_아님() throws Exception {
            // given
            given(buildingService.findNearbyDeals(KEY, 12, true, 0)).willReturn(nearby(null, null));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}/nearby-deals", ID)
                    .param("period", "")
                    .param("type", "")
                    .param("page", ""));

            // then
            result.andExpect(status().isOk());
            then(buildingService).should().findNearbyDeals(KEY, 12, true, 0);
        }

        @Test
        @DisplayName("period 24, wolse, page 2를 서비스에 전달함")
        void period_24_wolse_page_2를_서비스에_전달함() throws Exception {
            // given
            given(buildingService.findNearbyDeals(KEY, 24, false, 2)).willReturn(nearby(null, 50));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}/nearby-deals", ID)
                    .param("period", "24")
                    .param("type", "wolse")
                    .param("page", "2"));

            // then
            result.andExpect(status().isOk());
            then(buildingService).should().findNearbyDeals(KEY, 24, false, 2);
        }

        @Test
        @DisplayName("응답의 숫자 필드는 숫자, hasNext는 boolean, buildingName은 문자열이고 areaConditionApplied는 없음")
        void 응답의_숫자_필드는_숫자_hasNext는_boolean_buildingName은_문자열이고_areaConditionApplied는_없음() throws Exception {
            // given
            given(buildingService.findNearbyDeals(KEY, 12, true, 0)).willReturn(nearby(null, null));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}/nearby-deals", ID));

            // then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.hasNext").isBoolean())
                    .andExpect(jsonPath("$.data.areaConditionApplied").doesNotExist())
                    .andExpect(jsonPath("$.data.totalCount").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].id").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].amount").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].month.year").isNumber())
                    .andExpect(jsonPath("$.data.deals[0].buildingName").isString())
                    .andExpect(jsonPath("$.data.deals[0].contract").value(nullValue()))
                    .andExpect(jsonPath("$.data.deals[0].monthlyRent").value(nullValue()));
        }

        @Test
        @DisplayName("page가 정수가 아니면 서비스를 호출하지 않고 400을 반환함")
        void page가_정수가_아니면_서비스를_호출하지_않고_400을_반환함() throws Exception {
            // when
            ResultActions result =
                    mockMvc.perform(get("/buildings/{id}/nearby-deals", ID).param("page", "a"));

            // then
            assertInvalidRequest(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @ParameterizedTest
        @ValueSource(strings = {"0", "13"})
        @DisplayName("period가 6, 12, 24가 아니면 서비스를 호출하지 않고 400을 반환함")
        void period가_6_12_24가_아니면_서비스를_호출하지_않고_400을_반환함(String period) throws Exception {
            // when
            ResultActions result =
                    mockMvc.perform(get("/buildings/{id}/nearby-deals", ID).param("period", period));

            // then
            assertInvalidRequest(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @ParameterizedTest
        @ValueSource(strings = {"6"})
        @DisplayName("period 6, 12, 24는 통과함")
        void period_6_12_24는_통과함(String period) throws Exception {
            // given
            givenAnyRequest();

            // when
            ResultActions result =
                    mockMvc.perform(get("/buildings/{id}/nearby-deals", ID).param("period", period));

            // then
            result.andExpect(status().isOk());
        }

        @ParameterizedTest
        @ValueSource(strings = {"sale", "JEONSE"})
        @DisplayName("type이 jeonse, wolse가 아니면 서비스를 호출하지 않고 400을 반환함")
        void type이_jeonse_wolse가_아니면_서비스를_호출하지_않고_400을_반환함(String type) throws Exception {
            // when
            ResultActions result =
                    mockMvc.perform(get("/buildings/{id}/nearby-deals", ID).param("type", type));

            // then
            assertInvalidRequest(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("page가 음수면 서비스를 호출하지 않고 400을 반환함")
        void page가_음수면_서비스를_호출하지_않고_400을_반환함() throws Exception {
            // when
            ResultActions result =
                    mockMvc.perform(get("/buildings/{id}/nearby-deals", ID).param("page", "-1"));

            // then
            assertInvalidRequest(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("잘못된 period와 형식이 틀린 id가 함께 오면 400이 우선함")
        void 잘못된_period와_형식이_틀린_id가_함께_오면_400이_우선함() throws Exception {
            // when
            ResultActions result =
                    mockMvc.perform(get("/buildings/{id}/nearby-deals", "abc").param("period", "3"));

            // then
            assertInvalidRequest(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("id 형식이 맞지 않으면 서비스를 호출하지 않고 404를 반환함")
        void id_형식이_맞지_않으면_서비스를_호출하지_않고_404를_반환함() throws Exception {
            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}/nearby-deals", "abc"));

            // then
            assertBuildingNotFound(result);
            then(buildingService).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("서비스가 BUILDING_NOT_FOUND를 던지면 404를 반환함")
        void 서비스가_BUILDING_NOT_FOUND를_던지면_404를_반환함() throws Exception {
            // given
            given(buildingService.findNearbyDeals(KEY, 12, true, 0))
                    .willThrow(new BusinessException(ErrorCode.BUILDING_NOT_FOUND));

            // when
            ResultActions result = mockMvc.perform(get("/buildings/{id}/nearby-deals", ID));

            // then
            assertBuildingNotFound(result);
        }
    }
}
