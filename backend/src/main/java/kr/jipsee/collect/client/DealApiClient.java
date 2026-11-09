package kr.jipsee.collect.client;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.function.Function;
import kr.jipsee.collect.exception.DealApiException;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

/** 공공데이터 거래 API를 페이지 단위로 조회하고, 응답 거래가 요청한 시군구와 계약 월인지 검사한 뒤 행으로 변환 */
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class DealApiClient<T> {
    private final DealApiCaller caller;
    private final String path;
    private final Function<DealItem, T> toRow;

    /** 시군구와 계약 월의 거래 한 페이지를 행으로 변환해 반환 */
    public final DealPage<T> fetch(String sigunguCode, YearMonth dealMonth, int pageNo) {
        DealPage<DealItem> page = caller.call(path, sigunguCode, dealMonth, pageNo);
        page.items().forEach(item -> requireRequestedKey(sigunguCode, dealMonth, item));
        return page.map(toRow);
    }

    /** 응답 거래의 계약 연, 월, 일을 계약일로 병합 */
    protected static LocalDate dealDate(DealItem item) {
        return LocalDate.of(item.requiredInt("dealYear"), item.requiredInt("dealMonth"), item.requiredInt("dealDay"));
    }

    /** 응답 거래의 시군구나 계약 월이 요청과 다르면 DealApiException 예외 발생 */
    private static void requireRequestedKey(String sigunguCode, YearMonth dealMonth, DealItem item) {
        String itemSigunguCode = item.requiredText("sggCd");
        LocalDate itemDealDate = dealDate(item);

        if (!sigunguCode.equals(itemSigunguCode) || !dealMonth.equals(YearMonth.from(itemDealDate))) {
            throw new DealApiException(
                    "요청과 다른 거래: 요청 " + sigunguCode + " " + dealMonth + ", 응답 " + itemSigunguCode + " " + itemDealDate);
        }
    }
}
