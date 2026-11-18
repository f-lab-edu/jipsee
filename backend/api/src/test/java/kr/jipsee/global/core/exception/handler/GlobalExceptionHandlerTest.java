package kr.jipsee.global.core.exception.handler;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.validation.constraints.Positive;
import kr.jipsee.global.core.exception.BusinessException;
import kr.jipsee.global.core.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@WebMvcTest(controllers = GlobalExceptionHandlerTest.TestController.class)
@Import(GlobalExceptionHandlerTest.TestController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    MockMvc mockMvc;

    @RestController
    static class TestController {

        @GetMapping("/test/param")
        String param(@RequestParam @Positive int value) {
            return "ok";
        }

        @PostMapping(value = "/test/body", consumes = MediaType.APPLICATION_JSON_VALUE)
        String body(@RequestBody String body) {
            return "ok";
        }

        @GetMapping("/test/business")
        String business() {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        @GetMapping("/test/unhandled")
        String unhandled() {
            throw new IllegalStateException("내부 정보");
        }
    }

    private static void assertErrorResponse(ResultActions result, ErrorCode errorCode) throws Exception {
        result.andExpect(status().is(errorCode.getStatus().value()))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(errorCode.getStatus().value()))
                .andExpect(jsonPath("$.code").value(errorCode.name()))
                .andExpect(jsonPath("$.detail").value(errorCode.getDetail()));
    }

    @Nested
    @DisplayName("Spring 기본 예외")
    class SpringException {

        @Test
        @DisplayName("검증에 실패하면 VALIDATION_FAILED를 반환함")
        void 검증에_실패하면_VALIDATION_FAILED를_반환함() throws Exception {
            // when
            var result = mockMvc.perform(get("/test/param").param("value", "-1"));

            // then
            assertErrorResponse(result, ErrorCode.VALIDATION_FAILED);
        }

        @Test
        @DisplayName("필수 파라미터가 없으면 INVALID_REQUEST를 반환함")
        void 필수_파라미터가_없으면_INVALID_REQUEST를_반환함() throws Exception {
            // when
            var result = mockMvc.perform(get("/test/param"));

            // then
            assertErrorResponse(result, ErrorCode.INVALID_REQUEST);
        }

        @Test
        @DisplayName("없는 경로를 요청하면 PATH_NOT_FOUND를 반환함")
        void 없는_경로를_요청하면_PATH_NOT_FOUND를_반환함() throws Exception {
            // when
            var result = mockMvc.perform(get("/test/missing"));

            // then
            assertErrorResponse(result, ErrorCode.PATH_NOT_FOUND);
        }

        @Test
        @DisplayName("지원하지 않는 요청 방식이면 METHOD_NOT_ALLOWED를 반환함")
        void 지원하지_않는_요청_방식이면_METHOD_NOT_ALLOWED를_반환함() throws Exception {
            // when
            var result = mockMvc.perform(post("/test/param"));

            // then
            assertErrorResponse(result, ErrorCode.METHOD_NOT_ALLOWED);
        }

        @Test
        @DisplayName("지원하지 않는 본문 형식이면 UNSUPPORTED_MEDIA_TYPE을 반환함")
        void 지원하지_않는_본문_형식이면_UNSUPPORTED_MEDIA_TYPE을_반환함() throws Exception {
            // when
            var result = mockMvc.perform(
                    post("/test/body").contentType(MediaType.TEXT_PLAIN).content("body"));

            // then
            assertErrorResponse(result, ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }
    }

    @Test
    @DisplayName("BusinessException이면 담긴 ErrorCode를 반환함")
    void BusinessException이면_담긴_ErrorCode를_반환함() throws Exception {
        // when
        var result = mockMvc.perform(get("/test/business"));

        // then
        assertErrorResponse(result, ErrorCode.INVALID_REQUEST);
    }

    @Test
    @DisplayName("처리하지 못한 예외면 예외 메시지를 노출하지 않고 INTERNAL_ERROR를 반환함")
    void 처리하지_못한_예외면_예외_메시지를_노출하지_않고_INTERNAL_ERROR를_반환함() throws Exception {
        // when
        var result = mockMvc.perform(get("/test/unhandled"));

        // then
        assertErrorResponse(result, ErrorCode.INTERNAL_ERROR);
    }
}
