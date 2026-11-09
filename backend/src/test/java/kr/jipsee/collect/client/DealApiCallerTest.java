package kr.jipsee.collect.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.net.SocketTimeoutException;
import java.time.Duration;
import java.time.YearMonth;
import kr.jipsee.collect.exception.DealApiException;
import kr.jipsee.collect.exception.DealApiTransientException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.json.JsonMapper;

class DealApiCallerTest {

    private static final String KEY = "abc%2Bdef%3D";
    private static final String PATH = "/RTMSDataSvcRHRent/getRTMSDataSvcRHRent";
    private static final YearMonth OCTOBER = YearMonth.of(2026, 10);

    private static final String EMPTY_BODY = "{\"response\":{\"header\":{\"resultCode\":\"000\",\"resultMsg\":\"OK\"},"
            + "\"body\":{\"items\":\"\",\"numOfRows\":1000,\"pageNo\":1,\"totalCount\":0}}}";
    private static final String ONE_ITEM_BODY =
            "{\"response\":{\"header\":{\"resultCode\":\"000\",\"resultMsg\":\"OK\"},\"body\":{\"items\":{\"item\":{\"jibun\":250,\"umdNm\":\"금천면"
                    + " 오강리\"}},\"numOfRows\":1000,\"pageNo\":1,\"totalCount\":1}}}";
    private static final String TWO_ITEMS_BODY =
            "{\"response\":{\"header\":{\"resultCode\":\"000\",\"resultMsg\":\"OK\"},"
                    + "\"body\":{\"items\":{\"item\":[{\"jibun\":\"130-69\",\"umdNm\":\"동숭동\"},{\"jibun\":\"4-2\",\"umdNm\":\"신영동\"}]},"
                    + "\"numOfRows\":1000,\"pageNo\":1,\"totalCount\":2}}}";

    private static final String JSON_LIMIT_23 = "{\"OpenAPI_ServiceResponse\":{\"cmmMsgHeader\":{"
            + "\"errMsg\":\"LIMITED_NUMBER_OF_SERVICE_REQUESTS_PER_SECOND_EXCEEDS_ERROR\","
            + "\"returnAuthMsg\":\"초당 서비스 요청제한 횟수 초과 에러\",\"returnReasonCode\":\"23\"}}}";

    private static final String JSON_LIMIT_22 = "{\"OpenAPI_ServiceResponse\":{\"cmmMsgHeader\":{"
            + "\"errMsg\":\"LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR\","
            + "\"returnAuthMsg\":\"서비스 요청제한 횟수 초과 에러\",\"returnReasonCode\":\"22\"}}}";

    private static String xmlError(int code, String message) {
        return "<OpenAPI_ServiceResponse><cmmMsgHeader><errMsg>SERVICE ERROR</errMsg><returnAuthMsg>" + message
                + "</returnAuthMsg><returnReasonCode>" + code
                + "</returnReasonCode></cmmMsgHeader></OpenAPI_ServiceResponse>";
    }

    private MockRestServiceServer server;
    private DealApiCaller caller;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        caller = new DealApiCaller(
                builder,
                "http://localhost/1613000",
                KEY,
                Duration.ofMillis(1),
                JsonMapper.builder().build());
    }

    private DealPage<DealItem> call() {
        return caller.call(PATH, "11110", OCTOBER, 1);
    }

    @Test
    @DisplayName("서비스 키를 이중 인코딩하지 않고 쿼리 파라미터로 보냄")
    void 서비스_키를_이중_인코딩하지_않고_쿼리_파라미터로_보냄() {
        // given
        server.expect(request -> {
                    assertThat(request.getURI().getRawPath()).isEqualTo("/1613000" + PATH);
                    assertThat(request.getURI().getRawQuery())
                            .isEqualTo(
                                    "serviceKey=abc%2Bdef%3D&LAWD_CD=11110&DEAL_YMD=202610&pageNo=1&numOfRows=1000&_type=json");
                })
                .andRespond(withSuccess(EMPTY_BODY, MediaType.APPLICATION_JSON));

        // when
        call();

        // then
        server.verify();
    }

    @Nested
    @DisplayName("정상 응답")
    class Success {

        @Test
        @DisplayName("거래가 여러 건이면 resultCode, totalCount, 거래 목록을 반환함")
        void 거래가_여러_건이면_resultCode_totalCount_거래_목록을_반환함() {
            server.expect(request -> {}).andRespond(withSuccess(TWO_ITEMS_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.resultCode()).isEqualTo("000");
            assertThat(page.totalCount()).isEqualTo(2);
            assertThat(page.items())
                    .extracting(item -> item.requiredText("umdNm"))
                    .containsExactly("동숭동", "신영동");
        }

        @Test
        @DisplayName("거래가 1건이라 item이 객체로 와도 목록 1개로 반환함")
        void 거래가_1건이라_item이_객체로_와도_목록_1개로_반환함() {
            server.expect(request -> {}).andRespond(withSuccess(ONE_ITEM_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.totalCount()).isEqualTo(1);
            assertThat(page.items()).hasSize(1);
            assertThat(page.items().getFirst().requiredText("jibun")).isEqualTo("250");
        }

        @Test
        @DisplayName("거래가 0건이라 items가 빈 문자열로 와도 빈 목록을 반환함")
        void 거래가_0건이라_items가_빈_문자열로_와도_빈_목록을_반환함() {
            server.expect(request -> {}).andRespond(withSuccess(EMPTY_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.resultCode()).isEqualTo("000");
            assertThat(page.totalCount()).isZero();
            assertThat(page.items()).isEmpty();
        }

        @Test
        @DisplayName("resultCode가 000이 아니어도 totalCount가 있으면 그 값을 담아 반환함")
        void resultCode가_000이_아니어도_totalCount가_있으면_그_값을_담아_반환함() {
            server.expect(request -> {})
                    .andRespond(withSuccess(
                            "{\"response\":{\"header\":{\"resultCode\":\"99\",\"resultMsg\":\"ERROR\"},\"body\":{\"totalCount\":0}}}",
                            MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.resultCode()).isEqualTo("99");
            assertThat(page.totalCount()).isZero();
            assertThat(page.items()).isEmpty();
        }
    }

    @Nested
    @DisplayName("재시도하는 실패")
    class Retry {

        @Test
        @DisplayName("5xx가 두 번 오고 이후 성공하면 결과를 반환함")
        void 서버_오류가_두_번_오고_이후_성공하면_결과를_반환함() {
            server.expect(ExpectedCount.times(2), request -> {}).andRespond(withServerError());
            server.expect(request -> {}).andRespond(withSuccess(TWO_ITEMS_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.items()).hasSize(2);
            server.verify();
        }

        @Test
        @DisplayName("JSON이 아닌 본문의 5xx가 한 번 오고 이후 성공하면 결과를 반환함")
        void JSON이_아닌_본문의_5xx가_한_번_오고_이후_성공하면_결과를_반환함() {
            server.expect(request -> {})
                    .andRespond(withStatus(HttpStatus.BAD_GATEWAY)
                            .contentType(MediaType.TEXT_PLAIN)
                            .body("Bad Gateway"));
            server.expect(request -> {}).andRespond(withSuccess(TWO_ITEMS_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.items()).hasSize(2);
            server.verify();
        }

        @Test
        @DisplayName("5xx가 계속되면 처음 한 번과 재시도 세 번 뒤에 실패함")
        void 서버_오류가_계속되면_처음_한_번과_재시도_세_번_뒤에_실패함() {
            server.expect(ExpectedCount.times(4), request -> {}).andRespond(withServerError());

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown)
                    .isInstanceOf(DealApiException.class)
                    .hasMessageContaining("11110")
                    .hasNoCause();
            assertThat(thrown.getMessage()).doesNotContain("abc");
            server.verify();
        }

        @Test
        @DisplayName("타임아웃이 계속되면 서비스 키가 없는 DealApiException으로 실패함")
        void 타임아웃이_계속되면_서비스_키가_없는_DealApiException으로_실패함() {
            server.expect(ExpectedCount.times(4), request -> {})
                    .andRespond(withException(new SocketTimeoutException("Read timed out")));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class).hasNoCause();
            assertThat(thrown.getMessage()).doesNotContain("abc").doesNotContain("serviceKey");
            server.verify();
        }

        @ParameterizedTest(name = "HTTP {0}")
        @ValueSource(ints = {200, 429})
        @DisplayName("JSON 본문의 오류 23이 한 번 오고 이후 성공하면 상태 코드와 관계없이 결과를 반환함")
        void JSON_본문의_오류_23이_한_번_오고_이후_성공하면_상태_코드와_관계없이_결과를_반환함(int status) {
            server.expect(request -> {})
                    .andRespond(withStatus(HttpStatus.valueOf(status))
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(JSON_LIMIT_23));
            server.expect(request -> {}).andRespond(withSuccess(TWO_ITEMS_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.items()).hasSize(2);
            server.verify();
        }

        @Test
        @DisplayName("XML 본문의 오류 23이 한 번 오고 이후 성공하면 결과를 반환함 (관측하지 못한 형식)")
        void XML_본문의_오류_23이_한_번_오고_이후_성공하면_결과를_반환함() {
            server.expect(request -> {})
                    .andRespond(withSuccess(
                            xmlError(23, "LIMITED_NUMBER_OF_SERVICE_REQUESTS_PER_SECOND_EXCEEDS_ERROR"),
                            MediaType.APPLICATION_XML));
            server.expect(request -> {}).andRespond(withSuccess(TWO_ITEMS_BODY, MediaType.APPLICATION_JSON));

            DealPage<DealItem> page = call();

            assertThat(page.items()).hasSize(2);
            server.verify();
        }
    }

    @Nested
    @DisplayName("바로 실패하는 오류")
    class Fail {

        @ParameterizedTest(name = "HTTP {0}")
        @ValueSource(ints = {400, 401, 403, 404})
        @DisplayName("404를 포함한 4xx는 재시도하지 않고 바로 DealApiException으로 실패함")
        void 사백사를_포함한_4xx는_재시도하지_않고_바로_DealApiException으로_실패함(int status) {
            server.expect(request -> {}).andRespond(withStatus(HttpStatus.valueOf(status)));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class).isNotInstanceOf(DealApiTransientException.class);
            server.verify();
        }

        @ParameterizedTest(name = "HTTP {0}")
        @ValueSource(ints = {200, 429, 500})
        @DisplayName("JSON 본문의 오류 코드가 22이면 상태 코드와 관계없이 코드를 담은 DealApiException으로 실패하고 재시도하지 않음 (추정한 형식)")
        void JSON_본문의_오류_코드가_22이면_상태_코드와_관계없이_코드를_담은_DealApiException으로_실패하고_재시도하지_않음(int status) {
            server.expect(request -> {})
                    .andRespond(withStatus(HttpStatus.valueOf(status))
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(JSON_LIMIT_22));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown)
                    .isInstanceOf(DealApiException.class)
                    .isNotInstanceOf(DealApiTransientException.class)
                    .hasMessageContaining("22");
            server.verify();
        }

        @ParameterizedTest(name = "HTTP {0}")
        @ValueSource(ints = {200, 429, 500})
        @DisplayName("XML 본문의 오류 코드가 22이면 상태 코드와 관계없이 코드를 담은 DealApiException으로 실패하고 재시도하지 않음 (관측하지 못한 형식)")
        void XML_본문의_오류_코드가_22이면_상태_코드와_관계없이_코드를_담은_DealApiException으로_실패하고_재시도하지_않음(int status) {
            server.expect(request -> {})
                    .andRespond(withStatus(HttpStatus.valueOf(status))
                            .contentType(MediaType.APPLICATION_XML)
                            .body(xmlError(22, "LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR")));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown)
                    .isInstanceOf(DealApiException.class)
                    .isNotInstanceOf(DealApiTransientException.class)
                    .hasMessageContaining("22");
            server.verify();
        }

        @Test
        @DisplayName("JSON 본문의 resultCode가 22여도 코드를 담은 DealApiException으로 실패함")
        void JSON_본문의_resultCode가_22여도_코드를_담은_DealApiException으로_실패함() {
            server.expect(request -> {})
                    .andRespond(withSuccess(
                            "{\"response\":{\"header\":{\"resultCode\":\"22\",\"resultMsg\":\"LIMITED\"}}}",
                            MediaType.APPLICATION_JSON));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown)
                    .isInstanceOf(DealApiException.class)
                    .isNotInstanceOf(DealApiTransientException.class)
                    .hasMessageContaining("22");
            server.verify();
        }

        @Test
        @DisplayName("오류 23이 계속되면 재시도 횟수를 다 쓴 뒤 DealApiException으로 실패함")
        void 오류_23이_계속되면_재시도_횟수를_다_쓴_뒤_DealApiException으로_실패함() {
            server.expect(ExpectedCount.times(4), request -> {})
                    .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(JSON_LIMIT_23));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class);
            server.verify();
        }

        @Test
        @DisplayName("그 밖의 오류 코드는 재시도하지 않고 바로 실패함")
        void 그_밖의_오류_코드는_재시도하지_않고_바로_실패함() {
            server.expect(request -> {})
                    .andRespond(withSuccess(xmlError(20, "SERVICE_KEY_IS_NULL"), MediaType.APPLICATION_XML));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("20");
            server.verify();
        }

        @Test
        @DisplayName("JSON이 아닌 본문이면 DealApiException으로 실패함")
        void JSON이_아닌_본문이면_DealApiException으로_실패함() {
            server.expect(request -> {}).andRespond(withSuccess("not json", MediaType.TEXT_PLAIN));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class);
        }

        @Test
        @DisplayName("응답에 resultCode가 없으면 DealApiException으로 실패함")
        void 응답에_resultCode가_없으면_DealApiException으로_실패함() {
            server.expect(request -> {})
                    .andRespond(withSuccess(
                            "{\"response\":{\"body\":{\"items\":\"\",\"totalCount\":0}}}", MediaType.APPLICATION_JSON));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("resultCode");
        }

        @Test
        @DisplayName("응답에 totalCount가 없으면 DealApiException으로 실패함")
        void 응답에_totalCount가_없으면_DealApiException으로_실패함() {
            server.expect(request -> {})
                    .andRespond(withSuccess(
                            "{\"response\":{\"header\":{\"resultCode\":\"000\"},\"body\":{\"items\":\"\"}}}",
                            MediaType.APPLICATION_JSON));

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("totalCount");
        }

        @Test
        @DisplayName("연결 실패 말고 호출 중 RuntimeException이 나면 원인과 서비스 키 없이 재시도하지 않고 실패함")
        void 연결_실패_말고_호출_중_RuntimeException이_나면_원인과_서비스_키_없이_재시도하지_않고_실패함() {
            server.expect(request -> {}).andRespond(request -> {
                throw new IllegalStateException("요청 주소 http://localhost/1613000?serviceKey=abc%2Bdef%3D");
            });

            Throwable thrown = catchThrowable(DealApiCallerTest.this::call);

            assertThat(thrown)
                    .isInstanceOf(DealApiException.class)
                    .isNotInstanceOf(DealApiTransientException.class)
                    .hasNoCause()
                    .hasMessageContaining("LAWD_CD=11110")
                    .hasMessageContaining("DEAL_YMD=202610")
                    .hasMessageContaining("pageNo=1");
            assertThat(thrown.getMessage()).doesNotContain("abc").doesNotContain("serviceKey");
            server.verify();
        }
    }
}
