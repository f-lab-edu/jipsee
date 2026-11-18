package kr.jipsee.batch.building;

import java.util.Comparator;
import java.util.List;
import kr.jipsee.region.dto.LegalDongKey;
import org.springframework.batch.infrastructure.item.ExecutionContext;
import org.springframework.batch.infrastructure.item.support.AbstractItemStreamItemReader;

/** 법정동 키를 코드 오름차순으로 하나씩 반환하고 마지막으로 읽은 코드를 저장해 이어서 읽음 */
public class LegalDongKeyReader extends AbstractItemStreamItemReader<LegalDongKey> {
    private static final String LAST_CODE = "lastCode";

    private final List<LegalDongKey> keys;
    private int nextIndex;
    private String lastCode = "";

    public LegalDongKeyReader(List<LegalDongKey> keys) {
        this.keys =
                keys.stream().sorted(Comparator.comparing(LegalDongKey::code)).toList();
        // 저장 시 사용하는 키의 앞부분 지정
        setName("legalDongKeyReader");
    }

    /** 저장된 마지막 코드를 복원하고 그 코드보다 큰 첫 키부터 읽도록 위치를 정함 */
    @Override
    public void open(ExecutionContext executionContext) {
        lastCode = executionContext.getString(getExecutionContextKey(LAST_CODE), "");
        nextIndex = 0;
        while (nextIndex < keys.size() && keys.get(nextIndex).code().compareTo(lastCode) <= 0) {
            nextIndex++;
        }
    }

    /** 다음 키를 반환하고 끝에서 null을 반환 */
    @Override
    public LegalDongKey read() {
        if (nextIndex >= keys.size()) {
            return null;
        }
        LegalDongKey key = keys.get(nextIndex++);
        lastCode = key.code();
        return key;
    }

    /** 마지막으로 반환한 코드를 저장 */
    @Override
    public void update(ExecutionContext executionContext) {
        executionContext.putString(getExecutionContextKey(LAST_CODE), lastCode);
    }
}
