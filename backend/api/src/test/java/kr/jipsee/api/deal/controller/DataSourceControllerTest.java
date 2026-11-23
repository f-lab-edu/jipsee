package kr.jipsee.api.deal.controller;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.DataSourceStatus;
import kr.jipsee.deal.service.CollectStatusService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(DataSourceController.class)
class DataSourceControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    CollectStatusService collectStatusService;

    @Nested
    @DisplayName("GET /data-sources")
    class GetDataSources {

        @Test
        @DisplayName("최상위가 배열이고 source는 문자열, baseMonth의 year와 month는 숫자임")
        void 최상위가_배열이고_source는_문자열_baseMonth의_year와_month는_숫자임() throws Exception {
            // given
            given(collectStatusService.findAll())
                    .willReturn(List.of(
                            new DataSourceStatus("RENT_DEAL", YearMonth.of(2026, 11)),
                            new DataSourceStatus("SALE_DEAL", YearMonth.of(2026, 12))));

            // when
            ResultActions result = mockMvc.perform(get("/data-sources"));

            // then
            result.andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].source").isString())
                    .andExpect(jsonPath("$[0].source").value("RENT_DEAL"))
                    .andExpect(jsonPath("$[0].baseMonth.year").isNumber())
                    .andExpect(jsonPath("$[0].baseMonth.year").value(2026))
                    .andExpect(jsonPath("$[0].baseMonth.month").isNumber())
                    .andExpect(jsonPath("$[0].baseMonth.month").value(11))
                    .andExpect(jsonPath("$[1].source").value("SALE_DEAL"))
                    .andExpect(jsonPath("$[1].baseMonth.year").value(2026))
                    .andExpect(jsonPath("$[1].baseMonth.month").value(12));
        }

        @Test
        @DisplayName("행이 없으면 200과 빈 배열을 반환함")
        void 행이_없으면_200과_빈_배열을_반환함() throws Exception {
            // given
            given(collectStatusService.findAll()).willReturn(List.of());

            // when
            ResultActions result = mockMvc.perform(get("/data-sources"));

            // then
            result.andExpect(status().isOk()).andExpect(content().json("[]"));
        }
    }
}
