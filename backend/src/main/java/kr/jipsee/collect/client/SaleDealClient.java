package kr.jipsee.collect.client;

import kr.jipsee.deal.dto.SaleDealRow;
import org.springframework.stereotype.Component;

/** 연립다세대 매매 실거래 공공데이터 API 클라이언트 */
@Component
public class SaleDealClient extends DealApiClient<SaleDealRow> {
    static final String PATH = "/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade";

    public SaleDealClient(DealApiCaller caller) {
        super(caller, PATH, SaleDealClient::toRow);
    }

    /** 응답 거래 1건을 sale_deal 행으로 변환. 컬럼이 없는 필드는 읽지 않음 */
    static SaleDealRow toRow(DealItem item) {
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
