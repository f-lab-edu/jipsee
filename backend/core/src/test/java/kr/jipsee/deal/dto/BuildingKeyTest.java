package kr.jipsee.deal.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

class BuildingKeyTest {

    @Nested
    @DisplayName("id")
    class Id {

        @Test
        @DisplayName("세 값을 하이픈으로 연결함")
        void 세_값을_하이픈으로_연결함() {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "123-4");

            // when
            String id = key.id();

            // then
            assertThat(id).isEqualTo("11440-망원동-123-4");
        }
    }

    @Nested
    @DisplayName("parse")
    class Parse {

        @Test
        @DisplayName("지번의 하이픈을 유지함")
        void 지번의_하이픈을_유지함() {
            // when
            Optional<BuildingKey> key = BuildingKey.parse("11440-망원동-123-4");

            // then
            assertThat(key).contains(new BuildingKey("11440", "망원동", "123-4"));
        }

        @Test
        @DisplayName("산 지번을 해석함")
        void 산_지번을_해석함() {
            // when
            Optional<BuildingKey> key = BuildingKey.parse("11380-증산동-산10-22");

            // then
            assertThat(key).contains(new BuildingKey("11380", "증산동", "산10-22"));
        }

        @Test
        @DisplayName("한글이 앞에 오는 지번을 해석함")
        void 한글이_앞에_오는_지번을_해석함() {
            // when
            Optional<BuildingKey> key = BuildingKey.parse("11440-망원동-가-10-1");

            // then
            assertThat(key).contains(new BuildingKey("11440", "망원동", "가-10-1"));
        }

        @Test
        @DisplayName("끝의 줄바꿈이 있으면 empty")
        void 끝의_줄바꿈이_있으면_empty() {
            // when
            Optional<BuildingKey> key = BuildingKey.parse("11440-망원동-519\n");

            // then
            assertThat(key).isEmpty();
        }

        @Test
        @DisplayName("시군구가 6자리면 empty")
        void 시군구가_6자리면_empty() {
            // when
            Optional<BuildingKey> key = BuildingKey.parse("111440-망원동-1");

            // then
            assertThat(key).isEmpty();
        }

        @Test
        @DisplayName("시군구가 숫자가 아니면 empty")
        void 시군구가_숫자가_아니면_empty() {
            // when
            Optional<BuildingKey> key = BuildingKey.parse("1144a-망원동-1");

            // then
            assertThat(key).isEmpty();
        }

        @ParameterizedTest
        @NullSource
        @ValueSource(strings = {"1144-망원동-1", "11440망원동1", "11440--5", "11440-망원동-"})
        @DisplayName("그 밖의 형식 오류면 empty")
        void 그_밖의_형식_오류면_empty(String id) {
            // when
            Optional<BuildingKey> key = BuildingKey.parse(id);

            // then
            assertThat(key).isEmpty();
        }

        @Test
        @DisplayName("id를 다시 해석하면 같은 키")
        void id를_다시_해석하면_같은_키() {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "123-4");

            // when
            Optional<BuildingKey> parsed = BuildingKey.parse(key.id());

            // then
            assertThat(parsed).contains(key);
        }
    }
}
