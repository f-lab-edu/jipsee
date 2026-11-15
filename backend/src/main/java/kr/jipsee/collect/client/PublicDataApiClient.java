package kr.jipsee.collect.client;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import kr.jipsee.collect.exception.RtmsApiException;
import kr.jipsee.collect.exception.RtmsApiTransientException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.DefaultUriBuilderFactory;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/** 공공데이터포털 API 호출, 재시도, 오류 해석, 응답 페이지 변환 */
@RequiredArgsConstructor
public abstract class PublicDataApiClient {
    private static final String RESPONSE = "response";
    private static final String SERVICE_KEY = "serviceKey";
    private static final Set<String> SUCCESS_CODES = Set.of("00", "000"); // 거래 API는 000, 건축HUB는 00
    private static final Pattern XML_REASON_CODE =
            Pattern.compile("<returnReasonCode>\\s*(\\d+)\\s*</returnReasonCode>");

    private final RestClient restClient;
    private final RetryTemplate retryTemplate;
    private final JsonMapper jsonMapper;
    private final String serviceKey;

    /**
     * RestClient
     * - 서비스 키는 이미 인코딩된 값이라 다시 인코딩하지 않음
     */
    public static RestClient restClient(RestClient.Builder restClientBuilder, String baseUrl) {
        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory(baseUrl);
        uriBuilderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);
        return restClientBuilder.uriBuilderFactory(uriBuilderFactory).build();
    }

    /**
     * RetryTemplate
     * - 일시적인 실패만 최대 3번 재시도
     */
    public static RetryTemplate retryTemplate(Duration retryDelay) {
        return new RetryTemplate(RetryPolicy.builder()
                .maxRetries(3)
                .delay(retryDelay)
                .multiplier(2.0)
                .maxDelay(Duration.ofSeconds(10))
                .includes(RtmsApiTransientException.class)
                .build());
    }

    /** params 순서대로 쿼리를 붙여 API를 호출하고 한 페이지로 변환. {@link RtmsApiTransientException}이면 재시도 */
    protected final RtmsPage<RtmsItem> call(String path, Map<String, Object> params, String requestInfo) {
        return retryTemplate.invoke(() -> callOnce(path, params, requestInfo));
    }

    /** API를 한 번 호출하고 2xx의 빈 본문, 오류 코드, 상태 코드, 본문 순으로 검증 */
    private RtmsPage<RtmsItem> callOnce(String path, Map<String, Object> params, String requestInfo) {
        Response response = request(path, params, requestInfo);
        String body = response.body().strip();

        if (body.isEmpty() && response.status().is2xxSuccessful()) {
            throw new RtmsApiTransientException("빈 응답(HTTP " + response.status().value() + "): " + requestInfo);
        }

        boolean isXml = body.startsWith("<");

        if (isXml) {
            String errorCode = findXmlErrorCode(body);
            throwIfFailed(errorCode, response.status(), requestInfo);
            throw new RtmsApiException("오류 응답(" + errorCode + "): " + requestInfo);
        }

        JsonNode root = readJson(body, response.status(), requestInfo);
        throwIfFailed(findErrorCode(root), response.status(), requestInfo);
        return toPage(root, requestInfo);
    }

    /** HTTP 호출. 쿼리는 serviceKey, params, _type=json 순서 */
    private Response request(String path, Map<String, Object> params, String requestInfo) {
        StringBuilder uriTemplate = new StringBuilder(path).append("?serviceKey={serviceKey}");
        Map<String, Object> uriVariables = new LinkedHashMap<>();
        uriVariables.put(SERVICE_KEY, serviceKey);

        params.forEach((name, value) -> {
            uriTemplate.append("&").append(name).append("={").append(name).append("}");
            uriVariables.put(name, value);
        });
        uriTemplate.append("&_type=json");

        try {
            return restClient
                    .get()
                    .uri(uriTemplate.toString(), uriVariables)
                    .exchange((req, res) -> new Response(
                            res.getStatusCode(), new String(res.getBody().readAllBytes(), StandardCharsets.UTF_8)));
        } catch (ResourceAccessException e) {
            throw new RtmsApiTransientException("API 연결 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        } catch (RuntimeException e) {
            throw new RtmsApiException("API 호출 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        }
    }

    /** XML 본문의 returnReasonCode */
    private final String findXmlErrorCode(String body) {
        Matcher matcher = XML_REASON_CODE.matcher(body);
        return matcher.find() ? matcher.group(1) : null;
    }

    /** JSON 파싱. 실패 시 5xx는 RtmsApiTransientException, 그 밖은 RtmsApiException 반환 */
    private JsonNode readJson(String body, HttpStatusCode status, String requestInfo) {
        try {
            return jsonMapper.readTree(body);
        } catch (JacksonException e) {
            if (status.is5xxServerError()) {
                throw new RtmsApiTransientException("서버 오류(" + status + "): " + requestInfo);
            }

            throw new RtmsApiException("JSON이 아닌 응답: " + requestInfo);
        }
    }

    /** 오류 코드 22, 23, 상태 코드, 그 밖의 오류 코드 순으로 실패 판단 */
    private static void throwIfFailed(String errorCode, HttpStatusCode status, String requestInfo) {
        switch (errorCode) {
            case "22" -> throw new RtmsApiException("호출 한도 초과(22): " + requestInfo);
            case "23" -> throw new RtmsApiTransientException("초당 요청 수 초과(23): " + requestInfo);
            case null, default -> {
                // 그 외 에러는 하위에서 판단
            }
        }

        if (status.is5xxServerError()) {
            throw new RtmsApiTransientException("서버 오류(" + status + "): " + requestInfo);
        }

        if (!status.is2xxSuccessful()) {
            throw new RtmsApiException("HTTP " + status + ": " + requestInfo);
        }

        if (errorCode != null) {
            throw new RtmsApiException("오류 응답(" + errorCode + "): " + requestInfo);
        }
    }

    /** exchange 내부에서 읽은 상태 코드와 본문 */
    private record Response(HttpStatusCode status, String body) {}

    /** 게이트웨이 오류 코드를 먼저 확인하고, 없으면 정상(00, 000)이 아닌 resultCode 반환 */
    private static String findErrorCode(JsonNode root) {
        JsonNode reasonCode =
                root.path("OpenAPI_ServiceResponse").path("cmmMsgHeader").path("returnReasonCode");

        if (!reasonCode.isMissingNode()) {
            return reasonCode.asString();
        }

        JsonNode resultCode = root.path(RESPONSE).path("header").path("resultCode");

        if (!resultCode.isMissingNode() && !SUCCESS_CODES.contains(resultCode.asString())) {
            return resultCode.asString();
        }

        return null;
    }

    /**
     * 정상적인 JSON 응답을 RtmsPage로 변환
     * - item은 2건 이상이면 배열, 1건이면 객체, 0건이면 없음
     */
    private static RtmsPage<RtmsItem> toPage(JsonNode root, String requestInfo) {
        JsonNode resultCode = root.path(RESPONSE).path("header").path("resultCode");

        if (resultCode.isMissingNode()) {
            throw new RtmsApiException("resultCode 없음: " + requestInfo);
        }

        JsonNode body = root.path(RESPONSE).path("body");
        JsonNode totalCount = body.path("totalCount");

        if (totalCount.isMissingNode()) {
            throw new RtmsApiException("totalCount 없음 (resultCode=" + resultCode.asString() + "): " + requestInfo);
        }

        List<RtmsItem> items = new ArrayList<>();
        JsonNode item = body.path("items").path("item"); // 0건이면 items가 빈 문자열

        if (item.isArray()) {
            item.forEach(node -> items.add(RtmsItem.of(node)));
        } else if (item.isObject()) {
            items.add(RtmsItem.of(item)); // 1건이면 배열이 아니라 객체
        }

        return new RtmsPage<>(resultCode.asString(), totalCount.asInt(), items);
    }
}
