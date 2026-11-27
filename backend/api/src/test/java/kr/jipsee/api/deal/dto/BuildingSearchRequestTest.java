package kr.jipsee.api.deal.dto;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Payload;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Set;
import java.util.stream.Collectors;
import kr.jipsee.api.exception.ValidationPayload.InvalidRequest;
import kr.jipsee.api.exception.ValidationPayload.KeywordTooShort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class BuildingSearchRequestTest {

    private final Validator validator =
            Validation.buildDefaultValidatorFactory().getValidator();

    private Set<Class<? extends Payload>> payloads(BuildingSearchRequest request) {
        return validator.validate(request).stream()
                .map(ConstraintViolation::getConstraintDescriptor)
                .flatMap(descriptor -> descriptor.getPayload().stream())
                .collect(Collectors.toSet());
    }

    @Test
    @DisplayName("keyword는 앞뒤 공백을 제거하고 page가 없으면 0임")
    void keyword는_앞뒤_공백을_제거하고_page가_없으면_0임() {
        // when
        var request = new BuildingSearchRequest("  망원 빌라 ", null);

        // then
        assertThat(request.keyword()).isEqualTo("망원 빌라");
        assertThat(request.page()).isZero();
    }

    @Test
    @DisplayName("keyword가 100자이고 10단어이며 page가 0 이상이면 통과함")
    void keyword가_100자이고_10단어이며_page가_0_이상이면_통과함() {
        // when
        var chars = payloads(new BuildingSearchRequest("가".repeat(100), 0));
        var words = payloads(new BuildingSearchRequest("가 나 다 라 마 바 사 아 자 차", 0));

        // then
        assertThat(chars).isEmpty();
        assertThat(words).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "가", " 가 "})
    @DisplayName("keyword가 앞뒤 공백 제거 후 2자 미만이면 KeywordTooShort임")
    void keyword가_앞뒤_공백_제거_후_2자_미만이면_KeywordTooShort임(String keyword) {
        // when
        var payloads = payloads(new BuildingSearchRequest(keyword, 0));

        // then
        assertThat(payloads).containsExactly(KeywordTooShort.class);
    }

    @Test
    @DisplayName("keyword가 null이면 KeywordTooShort임")
    void keyword가_null이면_KeywordTooShort임() {
        // when
        var payloads = payloads(new BuildingSearchRequest(null, 0));

        // then
        assertThat(payloads).containsExactly(KeywordTooShort.class);
    }

    @Test
    @DisplayName("keyword가 100자를 넘으면 InvalidRequest임")
    void keyword가_100자를_넘으면_InvalidRequest임() {
        // when
        var payloads = payloads(new BuildingSearchRequest("가".repeat(101), 0));

        // then
        assertThat(payloads).containsExactly(InvalidRequest.class);
    }

    @Test
    @DisplayName("keyword가 11단어면 InvalidRequest임")
    void keyword가_11단어면_InvalidRequest임() {
        // when
        var payloads = payloads(new BuildingSearchRequest("가 나 다 라 마 바 사 아 자 차 카", 0));

        // then
        assertThat(payloads).containsExactly(InvalidRequest.class);
    }

    @Test
    @DisplayName("page가 음수면 InvalidRequest임")
    void page가_음수면_InvalidRequest임() {
        // when
        var payloads = payloads(new BuildingSearchRequest("망원", -1));

        // then
        assertThat(payloads).containsExactly(InvalidRequest.class);
    }

    @Test
    @DisplayName("keyword와 page가 모두 잘못되면 keyword 위반만 반환함")
    void keyword와_page가_모두_잘못되면_keyword_위반만_반환함() {
        // when
        var payloads = payloads(new BuildingSearchRequest("가", -1));

        // then
        assertThat(payloads).containsExactly(KeywordTooShort.class);
    }
}
