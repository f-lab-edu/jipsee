package kr.jipsee.global.publicdata;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
                .includes(PublicDataApiTransientException.class)
                .build());
    }

    /** resultCode가 이 API의 정상 응답이면 true */
    protected abstract boolean isSuccess(String resultCode);

    /** params 순서대로 쿼리를 붙여 API를 호출하고 한 페이지로 변환. {@link PublicDataApiTransientException}이면 재시도 */
    protected final PublicDataPage<PublicDataItem> call(String path, Map<String, Object> params, String requestInfo) {
        return retryTemplate.invoke(() -> callOnce(path, params, requestInfo));
    }

    /** API를 한 번 호출하고 2xx의 빈 본문, 오류 코드, 상태 코드, 본문 순으로 검증 */
    private PublicDataPage<PublicDataItem> callOnce(String path, Map<String, Object> params, String requestInfo) {
        Response response = request(path, params, requestInfo);
        String body = response.body().strip();

        if (body.isEmpty() && response.status().is2xxSuccessful()) {
            throw new PublicDataApiTransientException(
                    "빈 응답(HTTP " + response.status().value() + "): " + requestInfo);
        }

        boolean isXml = body.startsWith("<");

        if (isXml) {
            String errorCode = findXmlErrorCode(body);
            throwIfFailed(errorCode, response.status(), requestInfo);
            throw new PublicDataApiException("오류 응답(" + errorCode + "): " + requestInfo);
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
            throw new PublicDataApiTransientException(
                    "API 연결 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        } catch (RuntimeException e) {
            throw new PublicDataApiException("API 호출 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        }
    }

    /** XML 본문의 returnReasonCode */
    private final String findXmlErrorCode(String body) {
        Matcher matcher = XML_REASON_CODE.matcher(body);
        return matcher.find() ? matcher.group(1) : null;
    }

    /** JSON 파싱. 실패 시 5xx는 PublicDataApiTransientException, 그 밖은 PublicDataApiException 반환 */
    private JsonNode readJson(String body, HttpStatusCode status, String requestInfo) {
        try {
            return jsonMapper.readTree(body);
        } catch (JacksonException e) {
            if (status.is5xxServerError()) {
                throw new PublicDataApiTransientException("서버 오류(" + status + "): " + requestInfo);
            }

            throw new PublicDataApiException("JSON이 아닌 응답: " + requestInfo);
        }
    }

    /** 오류 코드 22, 23, 상태 코드, 그 밖의 오류 코드 순으로 실패 판단 */
    private static void throwIfFailed(String errorCode, HttpStatusCode status, String requestInfo) {
        if ("22".equals(errorCode)) {
            throw new PublicDataQuotaExceededException("호출 한도 초과(22): " + requestInfo);
        }

        if ("23".equals(errorCode)) {
            throw new PublicDataApiTransientException("초당 요청 수 초과(23): " + requestInfo);
        }

        if (status.is5xxServerError()) {
            throw new PublicDataApiTransientException("서버 오류(" + status + "): " + requestInfo);
        }

        if (!status.is2xxSuccessful()) {
            throw new PublicDataApiException("HTTP " + status + ": " + requestInfo);
        }

        if (errorCode != null) {
            throw new PublicDataApiException("오류 응답(" + errorCode + "): " + requestInfo);
        }
    }

    /** exchange 내부에서 읽은 상태 코드와 본문 */
    private record Response(HttpStatusCode status, String body) {}

    /** 게이트웨이 오류 코드를 먼저 확인하고, 없으면 정상이 아닌 resultCode 반환 */
    private String findErrorCode(JsonNode root) {
        JsonNode reasonCode =
                root.path("OpenAPI_ServiceResponse").path("cmmMsgHeader").path("returnReasonCode");

        if (!reasonCode.isMissingNode()) {
            return reasonCode.asString();
        }

        JsonNode resultCode = root.path(RESPONSE).path("header").path("resultCode");

        if (!resultCode.isMissingNode() && !isSuccess(resultCode.asString())) {
            return resultCode.asString();
        }

        return null;
    }

    /**
     * 정상적인 JSON 응답을 PublicDataPage로 변환
     * - item은 2건 이상이면 배열, 1건이면 객체, 0건이면 없음
     */
    private static PublicDataPage<PublicDataItem> toPage(JsonNode root, String requestInfo) {
        JsonNode resultCode = root.path(RESPONSE).path("header").path("resultCode");

        if (resultCode.isMissingNode()) {
            throw new PublicDataApiException("resultCode 없음: " + requestInfo);
        }

        JsonNode body = root.path(RESPONSE).path("body");
        JsonNode totalCount = body.path("totalCount");

        if (totalCount.isMissingNode()) {
            throw new PublicDataApiException(
                    "totalCount 없음 (resultCode=" + resultCode.asString() + "): " + requestInfo);
        }

        List<PublicDataItem> items = new ArrayList<>();
        JsonNode item = body.path("items").path("item"); // 0건이면 items가 빈 문자열

        if (item.isArray()) {
            item.forEach(node -> items.add(PublicDataItem.of(node)));
        } else if (item.isObject()) {
            items.add(PublicDataItem.of(item)); // 1건이면 배열이 아니라 객체
        }

        return new PublicDataPage<>(resultCode.asString(), totalCount.asInt(), items);
    }
}
