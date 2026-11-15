package kr.jipsee.collect.application;

import kr.jipsee.collect.dto.DealReplaceItem;
import kr.jipsee.deal.application.DealReplacer;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.infrastructure.item.Chunk;
import org.springframework.batch.infrastructure.item.ItemWriter;

/** 교체 항목마다 시군구와 계약 월 단위로 거래를 교체 */
@RequiredArgsConstructor
public class DealReplaceWriter<T> implements ItemWriter<DealReplaceItem<T>> {
    private final DealReplacer<T> replacer;

    /** chunk의 항목마다 기존 행을 지우고 새 행으로 교체 */
    @Override
    public void write(Chunk<? extends DealReplaceItem<T>> chunk) {
        for (DealReplaceItem<T> item : chunk) {
            replacer.replace(item.key().sigunguCode(), item.key().dealMonth(), item.rows());
        }
    }
}
