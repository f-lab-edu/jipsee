package kr.jipsee.collect.application;

import java.util.List;
import kr.jipsee.collect.dto.DealKey;
import org.springframework.batch.infrastructure.item.support.AbstractItemCountingItemStreamItemReader;

/**
 * 수집 키 목록에서 다음 키를 하나씩 반환
 */
public class DealKeyReader extends AbstractItemCountingItemStreamItemReader<DealKey> {
    private final List<DealKey> dealKeys;

    public DealKeyReader(List<DealKey> dealKeys) {
        this.dealKeys = dealKeys;
        // 저장 시 사용하는 키의 앞부분 지정
        setName("dealKeyReader");
    }

    @Override
    protected DealKey doRead() {
        int index = getCurrentItemCount() - 1;
        return index < dealKeys.size() ? dealKeys.get(index) : null;
    }

    @Override
    protected void doOpen() {
        // 메모리 목록만 읽으므로 열 자원이 없음
    }

    @Override
    protected void doClose() {
        // 메모리 목록만 읽으므로 닫을 자원이 없음
    }
}
