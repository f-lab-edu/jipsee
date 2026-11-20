package kr.jipsee.matching.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.util.stream.Stream;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class LotNumbersTest {

    private static final LegalDongKey LEGAL_DONG = new LegalDongKey("11350", "10400");

    private static Arguments lot(String lotNumber, String landType, String main, String sub) {
        return Arguments.of(lotNumber, Optional.of(new ParcelKey("11350", "10400", landType, main, sub)));
    }

    private static Arguments invalid(String lotNumber) {
        return Arguments.of(lotNumber, Optional.empty());
    }

    static Stream<Arguments> lotNumbers() {
        return Stream.of(
                lot("130-69", "0", "0130", "0069"),
                lot("130", "0", "0130", "0000"),
                lot("산87-85", "1", "0087", "0085"),
                lot("산5", "1", "0005", "0000"),
                lot("130-0", "0", "0130", "0000"),
                invalid("12345"),
                invalid("1-12345"),
                invalid("산 87"),
                invalid("가-"),
                invalid("BL-31-4"),
                invalid(""),
                invalid(null));
    }

    @ParameterizedTest
    @MethodSource("lotNumbers")
    @DisplayName("N, N-M, 산N, 산N-M만 필지 키로 바꾸고 그 밖의 값은 빈 값을 반환함")
    void N_N_M_산N_산N_M만_필지_키로_바꾸고_그_밖의_값은_빈_값을_반환함(String lotNumber, Optional<ParcelKey> expected) {
        // when
        Optional<ParcelKey> key = LotNumbers.toParcelKey(LEGAL_DONG, lotNumber);

        // then
        assertThat(key).isEqualTo(expected);
    }
}
