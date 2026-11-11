package kr.jipsee.collect.client;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import kr.jipsee.collect.exception.DealApiException;
import kr.jipsee.collect.exception.DealApiTransientException;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.DefaultUriBuilderFactory.EncodingMode;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/** 공공데이터 API를 호출하고 응답을 {@code RtmsPage<RtmsItem>}으로 변환 */
public class DealApiCaller {
    /** 한 페이지에 요청하는 거래 수 (numOfRows) */
    public static final int PAGE_SIZE = 1000;

    private static final String RESPONSE = "response";
    private static final DateTimeFormatter DEAL_YMD = DateTimeFormatter.ofPattern("yyyyMM");
    private static final Pattern XML_REASON_CODE =
            Pattern.compile("<returnReasonCode>\\s*(\\d+)\\s*</returnReasonCode>");
    private static final String QUERY =
            "?serviceKey={serviceKey}&LAWD_CD={lawdCd}&DEAL_YMD={dealYmd}&pageNo={pageNo}&numOfRows={numOfRows}&_type=json";

    private final RestClient restClient;
    private final String serviceKey;
    private final RetryTemplate retryTemplate;
    private final JsonMapper jsonMapper;

    /** 서비스 키는 이미 인코딩된 값이라 다시 인코딩하지 않음. 일시적인 실패만 최대 3번 재시도 */
    public DealApiCaller(
            RestClient.Builder restClientBuilder,
            String baseUrl,
            String serviceKey,
            Duration retryDelay,
            JsonMapper jsonMapper) {
        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory(baseUrl);
        uriBuilderFactory.setEncodingMode(EncodingMode.NONE);
        this.restClient = restClientBuilder.uriBuilderFactory(uriBuilderFactory).build();
        this.serviceKey = serviceKey;
        this.retryTemplate = new RetryTemplate(RetryPolicy.builder()
                .maxRetries(3)
                .delay(retryDelay)
                .multiplier(2.0)
                .maxDelay(Duration.ofSeconds(10))
                .includes(DealApiTransientException.class)
                .build());
        this.jsonMapper = jsonMapper;
    }

    /** 시군구와 계약 월의 거래 한 페이지 조회. {@link DealApiTransientException}이면 재시도 */
    public RtmsPage<RtmsItem> call(String path, String sigunguCode, YearMonth dealMonth, int pageNo) {
        return retryTemplate.invoke(() -> callOnce(path, sigunguCode, dealMonth, pageNo));
    }

    /** API를 한 번 호출하고 오류 코드, 상태 코드, 본문 순으로 검증 */
    private RtmsPage<RtmsItem> callOnce(String path, String sigunguCode, YearMonth dealMonth, int pageNo) {
        String dealYmd = dealMonth.format(DEAL_YMD);
        String requestInfo = "LAWD_CD=" + sigunguCode + ", DEAL_YMD=" + dealYmd + ", pageNo=" + pageNo;
        Response response = fetch(path, sigunguCode, dealYmd, pageNo, requestInfo);
        String body = response.body().strip();
        boolean isXml = body.startsWith("<");

        if (isXml) {
            String errorCode = findXmlErrorCode(body);
            throwIfFailed(errorCode, response.status(), requestInfo);
            throw new DealApiException("오류 응답(" + errorCode + "): " + requestInfo); // 정상 응답은 JSON만 옴
        }

        JsonNode root = readJson(body, response.status(), requestInfo);
        throwIfFailed(findErrorCode(root), response.status(), requestInfo);
        return toPage(root, requestInfo);
    }

    /** HTTP 호출 */
    private Response fetch(String path, String sigunguCode, String dealYmd, int pageNo, String requestInfo) {
        try {
            return restClient
                    .get()
                    .uri(path + QUERY, serviceKey, sigunguCode, dealYmd, pageNo, PAGE_SIZE)
                    .exchange((req, res) -> new Response(
                            res.getStatusCode(), new String(res.getBody().readAllBytes(), StandardCharsets.UTF_8)));
        } catch (ResourceAccessException e) {
            throw new DealApiTransientException("API 연결 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        } catch (RuntimeException e) {
            throw new DealApiException("API 호출 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        }
    }

    /** XML 본문의 returnReasonCode. 없으면 null */
    private static String findXmlErrorCode(String body) {
        Matcher matcher = XML_REASON_CODE.matcher(body);
        return matcher.find() ? matcher.group(1) : null;
    }

    /** JSON 파싱. 실패하면 5xx는 DealApiTransientException, 그 밖은 DealApiException */
    private JsonNode readJson(String body, HttpStatusCode status, String requestInfo) {
        try {
            return jsonMapper.readTree(body);
        } catch (JacksonException e) {
            if (status.is5xxServerError()) {
                throw new DealApiTransientException("서버 오류(" + status + "): " + requestInfo);
            }

            throw new DealApiException("JSON이 아닌 응답: " + requestInfo);
        }
    }

    /** 오류 코드 22, 23, 상태 코드, 그 밖의 오류 코드 순으로 실패 판단 */
    private static void throwIfFailed(String errorCode, HttpStatusCode status, String requestInfo) {
        switch (errorCode) {
            case "22" -> throw new DealApiException("호출 한도 초과(22): " + requestInfo);
            case "23" -> throw new DealApiTransientException("초당 요청 수 초과(23): " + requestInfo);
            case null, default -> {
                // 22, 23이 아니면 아래에서 판단
            }
        }

        if (status.is5xxServerError()) {
            throw new DealApiTransientException("서버 오류(" + status + "): " + requestInfo);
        }

        if (!status.is2xxSuccessful()) {
            throw new DealApiException("HTTP " + status + ": " + requestInfo);
        }

        if (errorCode != null) {
            throw new DealApiException("오류 응답(" + errorCode + "): " + requestInfo);
        }
    }

    /** exchange 내부에서 읽은 상태 코드와 본문 */
    private record Response(HttpStatusCode status, String body) {}

    /** 게이트웨이 오류 코드를 먼저 확인하고, 없으면 000(정상)이 아닌 resultCode 반환 */
    private static String findErrorCode(JsonNode root) {
        JsonNode reasonCode =
                root.path("OpenAPI_ServiceResponse").path("cmmMsgHeader").path("returnReasonCode");

        if (!reasonCode.isMissingNode()) {
            return reasonCode.asString();
        }

        JsonNode resultCode = root.path(RESPONSE).path("header").path("resultCode");

        if (!resultCode.isMissingNode() && !"000".equals(resultCode.asString())) {
            return resultCode.asString();
        }

        return null;
    }

    /** 정상 JSON 응답을 RtmsPage로 변환. item은 2건 이상이면 배열, 1건이면 객체, 0건이면 없음 */
    private static RtmsPage<RtmsItem> toPage(JsonNode root, String requestInfo) {
        JsonNode resultCode = root.path(RESPONSE).path("header").path("resultCode");

        if (resultCode.isMissingNode()) {
            throw new DealApiException("resultCode 없음: " + requestInfo);
        }

        JsonNode body = root.path(RESPONSE).path("body");
        JsonNode totalCount = body.path("totalCount");

        if (totalCount.isMissingNode()) {
            throw new DealApiException("totalCount 없음 (resultCode=" + resultCode.asString() + "): " + requestInfo);
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
