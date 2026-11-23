package kr.jipsee.deal.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

class HouseNamesTest {

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"(254-301)", "373-3", "", " "})
    @DisplayName("글자가 없는 값은 null로 정규화함")
    void 글자가_없는_값은_null로_정규화함(String houseName) {
        // when
        String normalized = HouseNames.normalize(houseName);

        // then
        assertThat(normalized).isNull();
    }

    @ParameterizedTest
    @ValueSource(strings = {"망원 OO빌라", "A동", "101동"})
    @DisplayName("글자가 있는 값은 그대로 반환함")
    void 글자가_있는_값은_그대로_반환함(String houseName) {
        // when
        String normalized = HouseNames.normalize(houseName);

        // then
        assertThat(normalized).isEqualTo(houseName);
    }
}
