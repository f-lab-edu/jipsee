package kr.jipsee.collect.client;

import kr.jipsee.deal.dto.SaleDealRow;
import kr.jipsee.global.publicdata.PublicDataItem;
import kr.jipsee.global.publicdata.PublicDataProperties;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.json.JsonMapper;

/** 연립다세대 매매 실거래 공공데이터 API 클라이언트 */
@Component
public class RtmsRhTradeClient extends RtmsApiClient<SaleDealRow> {
    static final String PATH = "/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade";

    public RtmsRhTradeClient(
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
                RtmsRhTradeClient::toRow);
    }

    /** 응답 거래 1건을 sale_deal 행으로 변환. 컬럼이 없는 필드는 읽지 않음 */
    static SaleDealRow toRow(PublicDataItem item) {
        return new SaleDealRow(
                item.requiredText("sggCd"),
                item.requiredText("umdNm"),
                item.requiredText("jibun"),
                item.optionalText("mhouseNm"),
                item.optionalInt("buildYear"),
                item.requiredDecimal("excluUseAr"),
                item.optionalInt("floor"),
                dealDate(item),
                item.requiredInt("dealAmount"),
                item.optionalText("cdealType"),
                item.optionalShortDate("cdealDay"));
    }
}
