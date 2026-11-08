package kr.jipsee.collect.application;

import java.util.List;
import java.util.function.Function;

/** API 응답 한 페이지 */
public record DealPage<T>(String resultCode, int totalCount, List<T> items) {

    /** items만 mapper로 바꾼 페이지 반환 */
    public <R> DealPage<R> map(Function<? super T, ? extends R> mapper) {
        return new DealPage<>(
                resultCode, totalCount, items.stream().<R>map(mapper).toList());
    }
}
