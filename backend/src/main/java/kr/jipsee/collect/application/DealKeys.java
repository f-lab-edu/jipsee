package kr.jipsee.collect.application;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import kr.jipsee.collect.dto.DealKey;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class DealKeys {
    private static final int DAILY_MONTHS = 6;

    /** 마지막 달부터 첫 달까지 한 달씩 내려가면서, 달마다 시군구를 입력 순서대로 추가함 */
    public static List<DealKey> of(YearMonth firstMonth, YearMonth lastMonth, List<String> sigunguCodes) {
        List<DealKey> dealKeys = new ArrayList<>();
        long months = ChronoUnit.MONTHS.between(firstMonth, lastMonth);

        for (int i = 0; i <= months; i++) {
            YearMonth currentMonth = lastMonth.minusMonths(i);
            sigunguCodes.forEach(sigunguCode -> dealKeys.add(new DealKey(sigunguCode, currentMonth)));
        }

        return List.copyOf(dealKeys);
    }

    /** 수집 날짜가 속한 달을 포함해 최근 6개월의 기준 생성 */
    public static List<DealKey> recent(LocalDate collectDate, List<String> sigunguCodes) {
        YearMonth lastMonth = YearMonth.from(collectDate);
        return of(lastMonth.minusMonths(DAILY_MONTHS - 1), lastMonth, sigunguCodes);
    }
}
