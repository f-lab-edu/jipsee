package kr.jipsee.api.cors;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@WebMvcTest(controllers = CorsConfigTest.TestController.class)
@Import({CorsConfig.class, CorsConfigTest.TestController.class})
@TestPropertySource(properties = "jipsee.cors.allowed-origins=https://jipsee.link,https://www.jipsee.link")
class CorsConfigTest {

    private static final String ALLOWED_ORIGIN = "https://jipsee.link";
    private static final String DENIED_ORIGIN = "https://evil.example";

    @Autowired
    MockMvc mockMvc;

    @RestController
    static class TestController {

        @GetMapping("/test/cors")
        String cors() {
            return "ok";
        }
    }

    @Test
    @DisplayName("허용 Origin의 GET 요청은 200과 Access-Control-Allow-Origin 응답")
    void 허용_Origin의_GET_요청은_200과_Access_Control_Allow_Origin_응답() throws Exception {
        // when
        var result = mockMvc.perform(get("/test/cors").header("Origin", ALLOWED_ORIGIN));

        // then
        result.andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", ALLOWED_ORIGIN));
    }

    @Test
    @DisplayName("허용 Origin의 preflight는 200과 Allow-Origin, Allow-Methods GET 응답")
    void 허용_Origin의_preflight는_200과_Allow_Origin_Allow_Methods_GET_응답() throws Exception {
        // when
        var result = mockMvc.perform(
                options("/test/cors").header("Origin", ALLOWED_ORIGIN).header("Access-Control-Request-Method", "GET"));

        // then
        result.andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", ALLOWED_ORIGIN))
                .andExpect(header().string("Access-Control-Allow-Methods", "GET"));
    }

    @Test
    @DisplayName("비허용 Origin 요청은 403과 Access-Control-Allow-Origin 없음")
    void 비허용_Origin_요청은_403과_Access_Control_Allow_Origin_없음() throws Exception {
        // when
        var result = mockMvc.perform(get("/test/cors").header("Origin", DENIED_ORIGIN));

        // then
        result.andExpect(status().isForbidden()).andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("허용 Origin의 POST preflight는 200과 Access-Control-Allow-Origin 응답")
    void 허용_Origin의_POST_preflight는_200과_Access_Control_Allow_Origin_응답() throws Exception {
        // when
        var result = mockMvc.perform(
                options("/test/cors").header("Origin", ALLOWED_ORIGIN).header("Access-Control-Request-Method", "POST"));

        // then
        result.andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", ALLOWED_ORIGIN));
    }
}
