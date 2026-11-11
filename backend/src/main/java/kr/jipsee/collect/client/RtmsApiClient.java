package kr.jipsee.collect.client;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import kr.jipsee.collect.exception.RtmsApiException;
import kr.jipsee.collect.exception.RtmsApiTransientException;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
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

/** 공공데이터 거래 API를 페이지 단위로 조회하고, 응답 거래가 요청한 시군구와 계약 월인지 검사한 뒤 행으로 변환 */
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class RtmsApiClient<T> {
    /** 한 페이지에 요청하는 거래 수 (numOfRows) */
    public static final int PAGE_SIZE = 1000;

    private static final String RESPONSE = "response";
    private static final DateTimeFormatter DEAL_YMD = DateTimeFormatter.ofPattern("yyyyMM");
    private static final Pattern XML_REASON_CODE =
            Pattern.compile("<returnReasonCode>\\s*(\\d+)\\s*</returnReasonCode>");
    private static final String QUERY =
            "?serviceKey={serviceKey}&LAWD_CD={lawdCd}&DEAL_YMD={dealYmd}&pageNo={pageNo}&numOfRows={numOfRows}&_type=json";

    private final RestClient restClient;
    private final RetryTemplate retryTemplate;
    private final JsonMapper jsonMapper;
    private final String serviceKey;
    private final String path;
    private final Function<RtmsItem, T> toRow;

    /** 서비스 키는 이미 인코딩된 값이라 다시 인코딩하지 않는 RestClient 생성 */
    public static RestClient restClient(RestClient.Builder restClientBuilder, String baseUrl) {
        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory(baseUrl);
        uriBuilderFactory.setEncodingMode(EncodingMode.NONE);
        return restClientBuilder.uriBuilderFactory(uriBuilderFactory).build();
    }

    /** 일시적인 실패만 최대 3번 재시도하는 RetryTemplate 생성 */
    public static RetryTemplate retryTemplate(Duration retryDelay) {
        return new RetryTemplate(RetryPolicy.builder()
                .maxRetries(3)
                .delay(retryDelay)
                .multiplier(2.0)
                .maxDelay(Duration.ofSeconds(10))
                .includes(RtmsApiTransientException.class)
                .build());
    }

    /** 시군구와 계약 월의 거래 한 페이지를 행으로 변환해 반환. {@link RtmsApiTransientException}이면 재시도 */
    public final RtmsPage<T> fetch(String sigunguCode, YearMonth dealMonth, int pageNo) {
        RtmsPage<RtmsItem> page = retryTemplate.invoke(() -> fetchOnce(sigunguCode, dealMonth, pageNo));
        page.items().forEach(item -> requireRequestedKey(sigunguCode, dealMonth, item));
        return page.map(toRow);
    }

    /** 응답 거래의 계약 연, 월, 일을 계약일로 병합 */
    protected static LocalDate dealDate(RtmsItem item) {
        return LocalDate.of(item.requiredInt("dealYear"), item.requiredInt("dealMonth"), item.requiredInt("dealDay"));
    }

    /** API를 한 번 호출하고 오류 코드, 상태 코드, 본문 순으로 검증 */
    private RtmsPage<RtmsItem> fetchOnce(String sigunguCode, YearMonth dealMonth, int pageNo) {
        String dealYmd = dealMonth.format(DEAL_YMD);
        String requestInfo = "LAWD_CD=" + sigunguCode + ", DEAL_YMD=" + dealYmd + ", pageNo=" + pageNo;
        Response response = request(sigunguCode, dealYmd, pageNo, requestInfo);
        String body = response.body().strip();
        boolean isXml = body.startsWith("<");

        if (isXml) {
            String errorCode = findXmlErrorCode(body);
            throwIfFailed(errorCode, response.status(), requestInfo);
            throw new RtmsApiException("오류 응답(" + errorCode + "): " + requestInfo); // 정상 응답은 JSON만 옴
        }

        JsonNode root = readJson(body, response.status(), requestInfo);
        throwIfFailed(findErrorCode(root), response.status(), requestInfo);
        return toPage(root, requestInfo);
    }

    /** HTTP 호출 */
    private Response request(String sigunguCode, String dealYmd, int pageNo, String requestInfo) {
        try {
            return restClient
                    .get()
                    .uri(path + QUERY, serviceKey, sigunguCode, dealYmd, pageNo, PAGE_SIZE)
                    .exchange((req, res) -> new Response(
                            res.getStatusCode(), new String(res.getBody().readAllBytes(), StandardCharsets.UTF_8)));
        } catch (ResourceAccessException e) {
            throw new RtmsApiTransientException("API 연결 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        } catch (RuntimeException e) {
            throw new RtmsApiException("API 호출 실패(" + e.getClass().getSimpleName() + "): " + requestInfo);
        }
    }

    /** XML 본문의 returnReasonCode. 없으면 null */
    private static String findXmlErrorCode(String body) {
        Matcher matcher = XML_REASON_CODE.matcher(body);
        return matcher.find() ? matcher.group(1) : null;
    }

    /** JSON 파싱. 실패하면 5xx는 RtmsApiTransientException, 그 밖은 RtmsApiException */
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
                // 22, 23이 아니면 아래에서 판단
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

    /** 응답 거래의 시군구나 계약 월이 요청과 다르면 RtmsApiException 예외 발생 */
    private static void requireRequestedKey(String sigunguCode, YearMonth dealMonth, RtmsItem item) {
        String itemSigunguCode = item.requiredText("sggCd");
        LocalDate itemDealDate = dealDate(item);

        if (!sigunguCode.equals(itemSigunguCode) || !dealMonth.equals(YearMonth.from(itemDealDate))) {
            throw new RtmsApiException(
                    "요청과 다른 거래: 요청 " + sigunguCode + " " + dealMonth + ", 응답 " + itemSigunguCode + " " + itemDealDate);
        }
    }
}
