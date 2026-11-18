package kr.jipsee.deal.client;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;
import kr.jipsee.global.publicdata.PublicDataApiClient;
import kr.jipsee.global.publicdata.PublicDataApiException;
import kr.jipsee.global.publicdata.PublicDataItem;
import kr.jipsee.global.publicdata.PublicDataPage;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.json.JsonMapper;

/** 공공데이터 거래 API를 페이지 단위로 조회하고, 응답 거래가 요청한 시군구와 계약 월인지 검사한 뒤 행으로 변환 */
public abstract class RtmsApiClient<T> extends PublicDataApiClient {
    /** 한 페이지에 요청하는 거래 수 (numOfRows) */
    public static final int PAGE_SIZE = 1000;

    private static final DateTimeFormatter DEAL_YMD = DateTimeFormatter.ofPattern("yyyyMM");

    private final String path;
    private final Function<PublicDataItem, T> toRow;

    /** 하위 클라이언트가 요청 경로와 행 변환을 지정해 생성 */
    protected RtmsApiClient(
            RestClient restClient,
            RetryTemplate retryTemplate,
            JsonMapper jsonMapper,
            String serviceKey,
            String path,
            Function<PublicDataItem, T> toRow) {
        super(restClient, retryTemplate, jsonMapper, serviceKey);
        this.path = path;
        this.toRow = toRow;
    }

    /** 시군구와 계약 월의 거래 한 페이지를 행으로 변환해 반환 */
    public final PublicDataPage<T> fetch(String sigunguCode, YearMonth dealMonth, int pageNo) {
        String dealYmd = dealMonth.format(DEAL_YMD);
        Map<String, Object> params = new LinkedHashMap<>();
        params.put("LAWD_CD", sigunguCode);
        params.put("DEAL_YMD", dealYmd);
        params.put("pageNo", pageNo);
        params.put("numOfRows", PAGE_SIZE);
        String requestInfo = "LAWD_CD=" + sigunguCode + ", DEAL_YMD=" + dealYmd + ", pageNo=" + pageNo;

        PublicDataPage<PublicDataItem> page = call(path, params, requestInfo);
        page.items().forEach(item -> requireRequestedKey(sigunguCode, dealMonth, item));
        return page.map(toRow);
    }

    /** 거래 API의 정상 응답 코드는 000 */
    @Override
    protected boolean isSuccess(String resultCode) {
        return "000".equals(resultCode);
    }

    /** 응답 거래의 계약 연, 월, 일을 계약일로 병합 */
    protected static LocalDate dealDate(PublicDataItem item) {
        return LocalDate.of(item.requiredInt("dealYear"), item.requiredInt("dealMonth"), item.requiredInt("dealDay"));
    }

    /** 응답 거래의 시군구나 계약 월이 요청과 다르면 PublicDataApiException 예외 발생 */
    private static void requireRequestedKey(String sigunguCode, YearMonth dealMonth, PublicDataItem item) {
        String itemSigunguCode = item.requiredText("sggCd");
        LocalDate itemDealDate = dealDate(item);

        if (!sigunguCode.equals(itemSigunguCode) || !dealMonth.equals(YearMonth.from(itemDealDate))) {
            throw new PublicDataApiException(
                    "요청과 다른 거래: 요청 " + sigunguCode + " " + dealMonth + ", 응답 " + itemSigunguCode + " " + itemDealDate);
        }
    }
}
