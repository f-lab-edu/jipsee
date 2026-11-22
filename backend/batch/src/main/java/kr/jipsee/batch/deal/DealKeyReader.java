package kr.jipsee.batch.deal;

import java.util.List;
import org.springframework.batch.infrastructure.item.support.AbstractItemCountingItemStreamItemReader;

/**
 * 수집 키 목록에서 다음 키를 하나씩 반환
 */
public class DealKeyReader extends AbstractItemCountingItemStreamItemReader<DealKey> {
    private final List<DealKey> dealKeys;

    public DealKeyReader(List<DealKey> dealKeys) {
        this.dealKeys = dealKeys;
        // ExecutionContext에 상태를 저장할 때 쓰는 이름 접두사 지정
        setName("dealKeyReader");
    }

    @Override
    protected DealKey doRead() {
        int index = getCurrentItemCount() - 1;
        return index < dealKeys.size() ? dealKeys.get(index) : null;
    }

    @Override
    protected void doOpen() {
        // 메모리 목록만 읽으므로 열어야 할 자원이 없음
    }

    @Override
    protected void doClose() {
        // 메모리 목록만 읽으므로 닫을 자원이 없음
    }
}
