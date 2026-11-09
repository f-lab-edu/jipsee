package kr.jipsee.collect.application;

import java.util.ArrayList;
import java.util.List;
import kr.jipsee.collect.client.DealApiClient;
import kr.jipsee.collect.client.DealPage;
import kr.jipsee.collect.dto.DealKey;
import kr.jipsee.collect.dto.DealReplaceItem;
import kr.jipsee.collect.exception.DealApiException;
import kr.jipsee.deal.application.DealReplacer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.infrastructure.item.ItemProcessor;

/** 시군구와 계약 월 하나의 거래를 모든 페이지에서 모은 뒤, 교체 항목으로 반환 */
@Slf4j
@RequiredArgsConstructor
public class DealCollectProcessor<T> implements ItemProcessor<DealKey, DealReplaceItem<T>> {
    private final DealApiClient<T> client;
    private final DealReplacer<T> replacer;

    /** 모든 페이지를 받아 교체 항목으로 반환. 기존 행이 있는데 0건이면 null로 교체를 건너뜀 */
    @Override
    public DealReplaceItem<T> process(DealKey key) {
        DealPage<T> firstPage = client.fetch(key.sigunguCode(), key.dealMonth(), 1);
        int totalCount = firstPage.totalCount();
        List<T> rows = new ArrayList<>(firstPage.items());
        boolean previousPageHasItems = !firstPage.items().isEmpty();
        int pageNo = 1;

        while (rows.size() < totalCount && previousPageHasItems) {
            DealPage<T> page = client.fetch(key.sigunguCode(), key.dealMonth(), ++pageNo);
            rows.addAll(page.items());
            previousPageHasItems = !page.items().isEmpty();
        }

        if (rows.size() != totalCount) {
            throw new DealApiException("공공데이터 API 응답의 item 개수가 totalCount와 다름: 응답 item 개수 " + rows.size()
                    + ", totalCount " + totalCount + ", 시군구 " + key.sigunguCode() + ", 월 " + key.dealMonth());
        }

        if (rows.isEmpty() && replacer.countByMonth(key.sigunguCode(), key.dealMonth()) > 0) {
            log.warn("기존 행이 이미 있는데, API 응답이 0건이라서 교체를 건너뜀: 시군구 {}, 월 {}", key.sigunguCode(), key.dealMonth());
            return null;
        }

        return new DealReplaceItem<>(key, rows);
    }
}
