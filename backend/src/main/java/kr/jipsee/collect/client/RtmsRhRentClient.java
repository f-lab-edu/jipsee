package kr.jipsee.collect.client;

import kr.jipsee.deal.dto.RentDealRow;
import org.springframework.stereotype.Component;

/** 연립다세대 전월세 실거래 공공데이터 API 클라이언트 */
@Component
public class RtmsRhRentClient extends RtmsApiClient<RentDealRow> {
    static final String PATH = "/RTMSDataSvcRHRent/getRTMSDataSvcRHRent";

    public RtmsRhRentClient(DealApiCaller caller) {
        super(caller, PATH, RtmsRhRentClient::toRow);
    }

    /** 응답 거래 1건을 rent_deal 행으로 변환 */
    static RentDealRow toRow(RtmsItem item) {
        return new RentDealRow(
                item.requiredText("sggCd"),
                item.requiredText("umdNm"),
                item.requiredText("jibun"),
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
