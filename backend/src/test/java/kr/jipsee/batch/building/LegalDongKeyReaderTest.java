package kr.jipsee.batch.building;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.infrastructure.item.ExecutionContext;

class LegalDongKeyReaderTest {

    private static final String LAST_CODE_KEY = "legalDongKeyReader.lastCode";

    private final List<LegalDongKey> keys = List.of(
            new LegalDongKey("11110", "10100"), new LegalDongKey("11110", "10200"), new LegalDongKey("11110", "10300"));

    @Test
    @DisplayName("처음 열면 첫 키부터 순서대로 읽고 끝에서 null을 반환함")
    void 처음_열면_첫_키부터_순서대로_읽고_끝에서_null을_반환함() throws Exception {
        // given
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);
        reader.open(new ExecutionContext());

        // when
        List<LegalDongKey> read = List.of(reader.read(), reader.read(), reader.read());

        // then
        assertThat(read).isEqualTo(keys);
        assertThat(reader.read()).isNull();
    }

    @Test
    @DisplayName("저장된 마지막 코드 다음 키부터 이어서 읽음")
    void 저장된_마지막_코드_다음_키부터_이어서_읽음() throws Exception {
        // given
        ExecutionContext context = new ExecutionContext();
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);
        reader.open(context);
        reader.read();
        reader.update(context);
        reader.read(); // 저장하지 않은 읽기
        reader.close();

        // when
        LegalDongKeyReader restarted = new LegalDongKeyReader(keys);
        restarted.open(context);

        // then
        assertThat(restarted.read()).isEqualTo(keys.get(1));
        assertThat(restarted.read()).isEqualTo(keys.get(2));
        assertThat(restarted.read()).isNull();
    }

    @Test
    @DisplayName("저장된 코드가 목록에 없어도 그 코드보다 큰 첫 키부터 읽음")
    void 저장된_코드가_목록에_없어도_그_코드보다_큰_첫_키부터_읽음() throws Exception {
        // given
        ExecutionContext context = new ExecutionContext();
        context.putString(LAST_CODE_KEY, "1111010150");
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);

        // when
        reader.open(context);

        // then
        assertThat(reader.read()).isEqualTo(keys.get(1));
    }

    @Test
    @DisplayName("아무것도 읽기 전에 update를 호출해도 다음 열기에서 처음부터 읽음")
    void 아무것도_읽기_전에_update를_호출해도_다음_열기에서_처음부터_읽음() throws Exception {
        // given
        ExecutionContext context = new ExecutionContext();
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);
        reader.open(context);
        reader.update(context);
        reader.close();

        // when
        LegalDongKeyReader restarted = new LegalDongKeyReader(keys);
        restarted.open(context);

        // then
        assertThat(restarted.read()).isEqualTo(keys.get(0));
    }

    @Test
    @DisplayName("열 때 저장된 마지막 코드를 복원해, 읽지 않고 update해도 저장된 값이 유지됨")
    void 열_때_저장된_마지막_코드를_복원해_읽지_않고_update해도_저장된_값이_유지됨() throws Exception {
        // given
        ExecutionContext context = new ExecutionContext();
        context.putString(LAST_CODE_KEY, "1111010200");
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);
        reader.open(context);

        // when
        reader.update(context);
        reader.close();
        LegalDongKeyReader restarted = new LegalDongKeyReader(keys);
        restarted.open(context);

        // then
        assertThat(context.getString(LAST_CODE_KEY)).isEqualTo("1111010200");
        assertThat(restarted.read()).isEqualTo(keys.get(2));
    }

    @Test
    @DisplayName("끝까지 읽은 뒤에는 마지막 코드를 저장함")
    void 끝까지_읽은_뒤에는_마지막_코드를_저장함() throws Exception {
        // given
        ExecutionContext context = new ExecutionContext();
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);
        reader.open(context);
        reader.read();
        reader.read();
        reader.read();
        reader.read();

        // when
        reader.update(context);

        // then
        assertThat(context.getString(LAST_CODE_KEY)).isEqualTo("1111010300");
    }

    @Test
    @DisplayName("읽은 뒤 빈 컨텍스트로 같은 인스턴스를 다시 열면 첫 키부터 다시 읽음")
    void 읽은_뒤_빈_컨텍스트로_같은_인스턴스를_다시_열면_첫_키부터_다시_읽음() throws Exception {
        // given
        LegalDongKeyReader reader = new LegalDongKeyReader(keys);
        reader.open(new ExecutionContext());
        reader.read();
        reader.read();
        reader.close();

        // when
        reader.open(new ExecutionContext());

        // then
        assertThat(reader.read()).isEqualTo(keys.get(0));
    }

    @Test
    @DisplayName("저장된 코드가 마지막 키 이상이면 바로 null을 반환함")
    void 저장된_코드가_마지막_키_이상이면_바로_null을_반환함() throws Exception {
        // given
        ExecutionContext atLast = new ExecutionContext();
        atLast.putString(LAST_CODE_KEY, "1111010300");
        ExecutionContext afterLast = new ExecutionContext();
        afterLast.putString(LAST_CODE_KEY, "1111010400");
        LegalDongKeyReader readerAtLast = new LegalDongKeyReader(keys);
        LegalDongKeyReader readerAfterLast = new LegalDongKeyReader(keys);

        // when
        readerAtLast.open(atLast);
        readerAfterLast.open(afterLast);

        // then
        assertThat(readerAtLast.read()).isNull();
        assertThat(readerAfterLast.read()).isNull();
    }

    @Test
    @DisplayName("정렬되지 않은 목록을 받아도 코드 순서로 읽음")
    void 정렬되지_않은_목록을_받아도_코드_순서로_읽음() throws Exception {
        // given
        LegalDongKeyReader reader = new LegalDongKeyReader(List.of(keys.get(2), keys.get(0), keys.get(1)));
        reader.open(new ExecutionContext());

        // when
        List<LegalDongKey> read = List.of(reader.read(), reader.read(), reader.read());

        // then
        assertThat(read).isEqualTo(keys);
    }
}
