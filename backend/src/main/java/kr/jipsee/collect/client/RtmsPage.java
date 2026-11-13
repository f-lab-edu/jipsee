package kr.jipsee.collect.client;

import java.util.List;
import java.util.function.Function;

/** API 응답 한 페이지 */
public record RtmsPage<T>(String resultCode, int totalCount, List<T> items) {

    /** items만 mapper로 바꾼 페이지 반환 */
    public <R> RtmsPage<R> map(Function<? super T, ? extends R> mapper) {
        return new RtmsPage<>(
                resultCode, totalCount, items.stream().<R>map(mapper).toList());
    }
}
