package kr.jipsee.building.client;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.global.publicdata.PublicDataApiClient;
import kr.jipsee.global.publicdata.PublicDataItem;
import kr.jipsee.global.publicdata.PublicDataPage;
import kr.jipsee.global.publicdata.PublicDataProperties;
import kr.jipsee.region.dto.LegalDongKey;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.json.JsonMapper;

/** 건축HUB 건축물대장 표제부 공공데이터 API 클라이언트 */
@Component
public class BldRgstHubClient extends PublicDataApiClient {
    /** 한 페이지에 요청하는 표제부 수 (numOfRows). 100을 넘는 값은 API가 100으로 줄임 */
    public static final int PAGE_SIZE = 100;

    static final String PATH = "/BldRgstHubService/getBrTitleInfo";

    private static final String NO_LOT_NUMBER = "0000";
    private static final Pattern YEAR_PREFIX = Pattern.compile("\\d{4}");

    public BldRgstHubClient(
            RestClient publicDataRestClient,
            RetryTemplate publicDataRetryTemplate,
            JsonMapper jsonMapper,
            PublicDataProperties properties) {
        super(
                publicDataRestClient,
                publicDataRetryTemplate,
                jsonMapper,
                properties.api().serviceKey());
    }

    /** 법정동의 표제부 한 페이지를 행으로 변환해 반환 */
    public PublicDataPage<BuildingRegisterRow> fetch(LegalDongKey key, int pageNo) {
        Map<String, Object> params = new LinkedHashMap<>();
        params.put("sigunguCd", key.sigunguCode());
        params.put("bjdongCd", key.legalDongCode());
        params.put("pageNo", pageNo);
        params.put("numOfRows", PAGE_SIZE);
        String requestInfo =
                "sigunguCd=" + key.sigunguCode() + ", bjdongCd=" + key.legalDongCode() + ", pageNo=" + pageNo;

        return call(PATH, params, requestInfo).map(BldRgstHubClient::toRow);
    }

    /** 필지 하나의 표제부 한 페이지를 행으로 변환해 반환 */
    public PublicDataPage<BuildingRegisterRow> fetch(ParcelKey key, int pageNo) {
        Map<String, Object> params = new LinkedHashMap<>();
        params.put("sigunguCd", key.sigunguCode());
        params.put("bjdongCd", key.legalDongCode());
        params.put("platGbCd", key.landTypeCode());
        params.put("bun", key.mainLotNumber());
        params.put("ji", key.subLotNumber());
        params.put("pageNo", pageNo);
        params.put("numOfRows", PAGE_SIZE);
        String requestInfo = "sigunguCd=" + key.sigunguCode() + ", bjdongCd=" + key.legalDongCode()
                + ", platGbCd=" + key.landTypeCode() + ", bun=" + key.mainLotNumber()
                + ", ji=" + key.subLotNumber() + ", pageNo=" + pageNo;

        return call(PATH, params, requestInfo).map(BldRgstHubClient::toRow);
    }

    /** 건축HUB의 정상 응답 코드는 00 */
    @Override
    protected boolean isSuccess(String resultCode) {
        return "00".equals(resultCode);
    }

    /** 응답 표제부 1건을 building_register 행으로 변환 */
    static BuildingRegisterRow toRow(PublicDataItem item) {
        ParcelKey parcelKey = new ParcelKey(
                item.optionalStrippedText("sigunguCd"),
                item.optionalStrippedText("bjdongCd"),
                item.optionalStrippedText("platGbCd"),
                orZeros(item.optionalStrippedText("bun")),
                orZeros(item.optionalStrippedText("ji")));

        return new BuildingRegisterRow(
                parcelKey,
                item.requiredStrippedText("mgmBldrgstPk"),
                item.requiredStrippedText("platPlc"),
                item.optionalStrippedText("newPlatPlc"),
                item.optionalStrippedText("bldNm"),
                item.optionalStrippedText("dongNm"),
                item.requiredStrippedText("mainAtchGbCd"),
                useApprovalDate(item),
                item.optionalInt("hhldCnt"),
                item.optionalInt("grndFlrCnt"),
                item.optionalInt("ugrndFlrCnt"),
                item.optionalInt("rideUseElvtCnt"),
                item.optionalStrippedText("strctCdNm"),
                item.optionalStrippedText("rserthqkDsgnApplyYn"),
                item.optionalDecimal("totArea"),
                item.optionalStrippedText("etcPurps"),
                item.optionalInt("indrMechUtcnt"),
                item.optionalInt("oudrMechUtcnt"),
                item.optionalInt("indrAutoUtcnt"),
                item.optionalInt("oudrAutoUtcnt"));
    }

    /** 본번과 부번이 비어 있으면 0000, 아니면 앞을 0으로 채운 4자리 반환 */
    private static String orZeros(String lotNumber) {
        return lotNumber == null ? NO_LOT_NUMBER : "0".repeat(4 - lotNumber.length()) + lotNumber;
    }

    /** 사용승인일은 앞 4자가 숫자일 때만 원본 그대로 반환. 아니면 null */
    private static String useApprovalDate(PublicDataItem item) {
        String text = item.optionalStrippedText("useAprDay");

        if (text == null || !YEAR_PREFIX.matcher(text).lookingAt()) {
            return null;
        }

        return text;
    }
}
