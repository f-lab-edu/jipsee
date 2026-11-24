package kr.jipsee.api.deal.controller;

import static org.hamcrest.Matchers.nullValue;
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
import kr.jipsee.deal.service.BuildingService;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
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
}
