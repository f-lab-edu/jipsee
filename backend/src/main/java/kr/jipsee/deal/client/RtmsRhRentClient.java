package kr.jipsee.deal.client;

import kr.jipsee.deal.dto.RentDealRow;
import kr.jipsee.global.publicdata.PublicDataItem;
import kr.jipsee.global.publicdata.PublicDataProperties;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.json.JsonMapper;

/** 연립다세대 전월세 실거래 공공데이터 API 클라이언트 */
@Component
public class RtmsRhRentClient extends RtmsApiClient<RentDealRow> {
    static final String PATH = "/RTMSDataSvcRHRent/getRTMSDataSvcRHRent";

    public RtmsRhRentClient(
            RestClient publicDataRestClient,
            RetryTemplate publicDataRetryTemplate,
            JsonMapper jsonMapper,
            PublicDataProperties properties) {
        super(
                publicDataRestClient,
                publicDataRetryTemplate,
                jsonMapper,
                properties.api().serviceKey(),
                PATH,
                RtmsRhRentClient::toRow);
    }

    /** 응답 거래 1건을 rent_deal 행으로 변환 */
    static RentDealRow toRow(PublicDataItem item) {
        return new RentDealRow(
                item.requiredText("sggCd"),
                item.requiredText("umdNm"),
                item.optionalText("jibun"),
                item.optionalText("mhouseNm"),
                item.optionalInt("buildYear"),
                item.requiredDecimal("excluUseAr"),
                item.optionalInt("floor"),
                dealDate(item),
                item.requiredInt("deposit"),
                item.requiredInt("monthlyRent"),
                item.optionalInt("preDeposit"),
                item.optionalInt("preMonthlyRent"),
                item.optionalText("contractTerm"),
                item.optionalText("contractType"),
                item.optionalText("useRRRight"));
    }
}
