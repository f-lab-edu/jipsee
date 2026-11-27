package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import java.util.List;
import java.util.Set;
import kr.jipsee.deal.dto.RegionFilter;
import kr.jipsee.deal.dto.SearchCondition;
import kr.jipsee.region.LegalDong;
import kr.jipsee.region.RegionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SearchKeywordParserTest {

    private static final LegalDong MANGWON = new LegalDong("11440", "망원동");
    private static final LegalDong SEOGYO = new LegalDong("11440", "서교동");

    @Mock
    RegionService regionService;

    @InjectMocks
    SearchKeywordParser parser;

    @Nested
    @DisplayName("지번 단어")
    class Lot {

        @Test
        @DisplayName("숫자 지번과 산 지번을 지번 단어로 분류함")
        void 숫자_지번과_산_지번을_지번_단어로_분류함() {
            // when
            SearchCondition condition = parser.parse("5 12-5 산10-22");

            // then
            assertThat(condition.lotWords()).containsExactly("5", "12-5", "산10-22");
            assertThat(condition.nameWords()).isEmpty();
            assertThat(condition.region()).isEqualTo(RegionFilter.absent());
        }

        @Test
        @DisplayName("홀로 있는 산이 숫자 지번 바로 앞에 있으면 합쳐서 지번 단어로 분류함")
        void 홀로_있는_산이_숫자_지번_바로_앞에_있으면_합쳐서_지번_단어로_분류함() {
            // given
            LegalDong jeungsan = new LegalDong("11440", "증산동");
            given(regionService.legalDongsByName("증산동")).willReturn(List.of(jeungsan));

            // when
            SearchCondition condition = parser.parse("증산동 산 10-22");

            // then
            assertThat(condition.lotWords()).containsExactly("산10-22");
            assertThat(condition.region()).isEqualTo(RegionFilter.legalDong(List.of(jeungsan)));
        }

        @Test
        @DisplayName("지번이 뒤따르지 않는 산은 1자 이름 단어로 분류함")
        void 지번이_뒤따르지_않는_산은_1자_이름_단어로_분류함() {
            // when
            SearchCondition condition = parser.parse("산 푸른빌라");

            // then
            assertThat(condition.lotWords()).isEmpty();
            assertThat(condition.nameWords()).containsExactly("산", "푸른빌라");
            assertThat(condition.fulltextWords()).containsExactly("푸른빌라");
        }
    }

    @Nested
    @DisplayName("지역 단어")
    class Region {

        @Test
        @DisplayName("시군구 단어는 시군구 코드 조건이 됨")
        void 시군구_단어는_시군구_코드_조건이_됨() {
            // given
            given(regionService.sigunguCodesByName("마포구")).willReturn(List.of("11440"));

            // when
            SearchCondition condition = parser.parse("마포구");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.sigungu(Set.of("11440")));
            assertThat(condition.nameWords()).isEmpty();
            assertThat(condition.searchable()).isTrue();
        }

        @Test
        @DisplayName("시군구 단어가 여러 개이면 코드의 교집합이 됨")
        void 시군구_단어가_여러_개이면_코드의_교집합이_됨() {
            // given
            given(regionService.sigunguCodesByName("수원시")).willReturn(List.of("41111", "41113", "41115", "41117"));
            given(regionService.sigunguCodesByName("장안구")).willReturn(List.of("41111"));

            // when
            SearchCondition condition = parser.parse("수원시 장안구");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.sigungu(Set.of("41111")));
        }

        @Test
        @DisplayName("법정동 단어는 법정동 쌍 조건이 됨")
        void 법정동_단어는_법정동_쌍_조건이_됨() {
            // given
            given(regionService.legalDongsByName("망원동")).willReturn(List.of(MANGWON));

            // when
            SearchCondition condition = parser.parse("망원동");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.legalDong(List.of(MANGWON)));
            assertThat(condition.searchable()).isTrue();
        }

        @Test
        @DisplayName("시군구와 법정동이 함께 있으면 법정동 쌍을 그 시군구 코드로 좁힘")
        void 시군구와_법정동이_함께_있으면_법정동_쌍을_그_시군구_코드로_좁힘() {
            // given
            LegalDong otherMangwon = new LegalDong("11380", "망원동");
            given(regionService.sigunguCodesByName("마포구")).willReturn(List.of("11440"));
            given(regionService.legalDongsByName("망원동")).willReturn(List.of(MANGWON, otherMangwon));

            // when
            SearchCondition condition = parser.parse("마포구 망원동");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.legalDong(List.of(MANGWON)));
        }

        @Test
        @DisplayName("시군구 단어의 교집합이 비면 NONE이고 검색할 수 없음")
        void 시군구_단어의_교집합이_비면_NONE이고_검색할_수_없음() {
            // given
            given(regionService.sigunguCodesByName("마포구")).willReturn(List.of("11440"));
            given(regionService.sigunguCodesByName("은평구")).willReturn(List.of("11380"));

            // when
            SearchCondition condition = parser.parse("마포구 은평구");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.none());
            assertThat(condition.searchable()).isFalse();
        }

        @Test
        @DisplayName("서로 다른 법정동 단어가 여러 개이면 NONE이고 검색할 수 없음")
        void 서로_다른_법정동_단어가_여러_개이면_NONE이고_검색할_수_없음() {
            // given
            given(regionService.legalDongsByName("망원동")).willReturn(List.of(MANGWON));
            given(regionService.legalDongsByName("서교동")).willReturn(List.of(SEOGYO));

            // when
            SearchCondition condition = parser.parse("망원동 서교동");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.none());
            assertThat(condition.searchable()).isFalse();
        }

        @Test
        @DisplayName("법정동이 시군구에 속하지 않으면 NONE이고 검색할 수 없음")
        void 법정동이_시군구에_속하지_않으면_NONE이고_검색할_수_없음() {
            // given
            given(regionService.sigunguCodesByName("은평구")).willReturn(List.of("11380"));
            given(regionService.legalDongsByName("망원동")).willReturn(List.of(MANGWON));

            // when
            SearchCondition condition = parser.parse("은평구 망원동");

            // then
            assertThat(condition.region()).isEqualTo(RegionFilter.none());
            assertThat(condition.searchable()).isFalse();
        }
    }

    @Nested
    @DisplayName("이름 단어")
    class Name {

        @Test
        @DisplayName("2자 이상 단어는 영문자가 있어도 FULLTEXT 단어이고 이름 단어에도 포함함")
        void 두_자_이상_단어는_영문자가_있어도_FULLTEXT_단어이고_이름_단어에도_포함함() {
            // when
            SearchCondition condition = parser.parse("래미안 A동 hill");

            // then
            assertThat(condition.fulltextWords()).containsExactly("래미안", "A동", "hill");
            assertThat(condition.nameWords()).containsExactly("래미안", "A동", "hill");
            assertThat(condition.searchable()).isTrue();
        }

        @Test
        @DisplayName("1자 단어는 이름 단어로만 분류함")
        void 한_자_단어는_이름_단어로만_분류함() {
            // when
            SearchCondition condition = parser.parse("푸른 가");

            // then
            assertThat(condition.fulltextWords()).containsExactly("푸른");
            assertThat(condition.nameWords()).containsExactly("푸른", "가");
        }

        @Test
        @DisplayName("1자 단어만 있으면 검색할 수 없음")
        void 한_자_단어만_있으면_검색할_수_없음() {
            // when
            SearchCondition condition = parser.parse("가");

            // then
            assertThat(condition.nameWords()).containsExactly("가");
            assertThat(condition.searchable()).isFalse();
        }

        @Test
        @DisplayName("지번 단어만 있으면 검색할 수 없음")
        void 지번_단어만_있으면_검색할_수_없음() {
            // when
            SearchCondition condition = parser.parse("123");

            // then
            assertThat(condition.searchable()).isFalse();
        }
    }

    @Nested
    @DisplayName("단어 정리")
    class Cleaning {

        @Test
        @DisplayName("공백이 여러 개여도 단어로 나누고 중복 단어를 제거함")
        void 공백이_여러_개여도_단어로_나누고_중복_단어를_제거함() {
            // when
            SearchCondition condition = parser.parse("  푸른빌라   하늘빌라 \t 푸른빌라 ");

            // then
            assertThat(condition.fulltextWords()).containsExactly("푸른빌라", "하늘빌라");
        }

        @Test
        @DisplayName("큰따옴표를 제거하고 문자와 숫자가 없는 단어를 삭제함")
        void 큰따옴표를_제거하고_문자와_숫자가_없는_단어를_삭제함() {
            // when
            SearchCondition condition = parser.parse("\"푸른빌라\" - () \"\" 하늘빌라");

            // then
            assertThat(condition.fulltextWords()).containsExactly("푸른빌라", "하늘빌라");
            assertThat(condition.nameWords()).containsExactly("푸른빌라", "하늘빌라");
        }
    }
}
