package kr.jipsee.region;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RegionServiceTest {

    @Mock
    LegalDongCsvRepository repository;

    @Test
    @DisplayName("시도와 읍면동과 하위 구가 있는 시를 빼고 시군구 코드를 오름차순으로 도출함")
    void 시도와_읍면동과_하위_구가_있는_시를_빼고_시군구_코드를_오름차순으로_도출함() {
        given(repository.findAll())
                .willReturn(List.of(
                        new LegalDongRow("1100000000", "서울특별시", "", "", ""),
                        new LegalDongRow("1111000000", "서울특별시", "종로구", "", ""),
                        new LegalDongRow("1111010100", "서울특별시", "종로구", "청운동", ""),
                        new LegalDongRow("4111000000", "경기도", "수원시", "", ""),
                        new LegalDongRow("4111100000", "경기도", "수원시 장안구", "", ""),
                        new LegalDongRow("4374000000", "충청북도", "영동군", "", ""),
                        new LegalDongRow("4374500000", "충청북도", "증평군", "", "")));

        List<String> codes = new RegionService(repository).sigunguCodes();

        assertThat(codes).containsExactly("11110", "41111", "43740", "43745");
    }

    @Test
    @DisplayName("실제 법정동 CSV에서 5자리 시군구 코드를 중복 없이 오름차순으로 도출함")
    void 실제_법정동_CSV에서_5자리_시군구_코드를_중복_없이_오름차순으로_도출함() {
        assertThat(new RegionService(new LegalDongCsvRepository()).sigunguCodes())
                .isNotEmpty()
                .allMatch(code -> code.matches("\\d{5}"))
                .doesNotHaveDuplicates()
                .isSorted();
    }

    @Test
    @DisplayName("실제 CSV의 시군구명을 반환함")
    void 실제_CSV의_시군구명을_반환함() {
        // given
        RegionService service = new RegionService(new LegalDongCsvRepository());

        // when & then
        assertThat(service.sigunguName("11440")).isEqualTo("마포구");
        assertThat(service.sigunguName("11380")).isEqualTo("은평구");
        assertThat(service.sigunguName("11620")).isEqualTo("관악구");
    }

    @Test
    @DisplayName("하위 구가 있는 시의 구는 공백 없는 표기를 반환함")
    void 하위_구가_있는_시의_구는_공백_없는_표기를_반환함() {
        // given
        RegionService service = new RegionService(new LegalDongCsvRepository());

        // when
        String name = service.sigunguName("41111");

        // then
        assertThat(name).isEqualTo("수원시장안구");
    }

    @Test
    @DisplayName("시군구 코드 목록에서 빠진 상위 시의 이름도 반환함")
    void 시군구_코드_목록에서_빠진_상위_시의_이름도_반환함() {
        // given
        given(repository.findAll())
                .willReturn(List.of(
                        new LegalDongRow("4111000000", "경기도", "수원시", "", ""),
                        new LegalDongRow("4111100000", "경기도", "수원시 장안구", "", "")));
        RegionService service = new RegionService(repository);

        // when
        String name = service.sigunguName("41110");

        // then
        assertThat(name).isEqualTo("수원시");
    }

    @Test
    @DisplayName("CSV는 생성할 때 한 번만 읽음")
    void CSV는_생성할_때_한_번만_읽음() {
        given(repository.findAll()).willReturn(List.of(new LegalDongRow("1111000000", "서울특별시", "종로구", "", "")));
        RegionService service = new RegionService(repository);

        service.sigunguCodes();
        service.sigunguCodes();

        then(repository).should(times(1)).findAll();
    }

    @Test
    @DisplayName("상위 시 이름은 하위 구 코드 전부로 풀리고 하위 구는 전체 이름과 짧은 이름 모두 같은 코드로 풀림")
    void 상위_시_이름은_하위_구_코드_전부로_풀리고_하위_구는_전체_이름과_짧은_이름_모두_같은_코드로_풀림() {
        // given
        RegionService service = new RegionService(new LegalDongCsvRepository());

        // when & then
        assertThat(service.sigunguCodesByName("수원시")).containsExactlyInAnyOrder("41111", "41113", "41115", "41117");
        assertThat(service.sigunguCodesByName("수원시장안구")).containsExactly("41111");
        assertThat(service.sigunguCodesByName("장안구")).containsExactly("41111");
        assertThat(service.sigunguCodesByName("마포구")).containsExactly("11440");
        assertThat(service.sigunguCodesByName("없는구")).isEmpty();
    }

    @Test
    @DisplayName("같은 시군구명이 여러 시도에 있으면 코드를 모두 반환함")
    void 같은_시군구명이_여러_시도에_있으면_코드를_모두_반환함() {
        // given
        RegionService service = new RegionService(new LegalDongCsvRepository());

        // when
        List<String> codes = service.sigunguCodesByName("중구");

        // then
        assertThat(codes).contains("11140", "26110", "27110").doesNotHaveDuplicates();
    }

    @Test
    @DisplayName("같은 법정동명이 여러 시군구에 있으면 쌍을 모두 반환하고 없는 이름은 빈 목록임")
    void 같은_법정동명이_여러_시군구에_있으면_쌍을_모두_반환하고_없는_이름은_빈_목록임() {
        // given
        RegionService service = new RegionService(new LegalDongCsvRepository());

        // when & then
        assertThat(service.legalDongsByName("신사동"))
                .contains(new LegalDong("11380", "신사동"), new LegalDong("11680", "신사동"));
        assertThat(service.legalDongsByName("망원동")).containsExactly(new LegalDong("11440", "망원동"));
        assertThat(service.legalDongsByName("없는동")).isEmpty();
    }

    @Test
    @DisplayName("읍면동 행만 법정동으로 풀리고 리 행이 있어도 쌍은 하나임")
    void 읍면동_행만_법정동으로_풀리고_리_행이_있어도_쌍은_하나임() {
        // given
        given(repository.findAll())
                .willReturn(List.of(
                        new LegalDongRow("1100000000", "서울특별시", "", "", ""),
                        new LegalDongRow("1111000000", "서울특별시", "종로구", "", ""),
                        new LegalDongRow("1111010100", "서울특별시", "종로구", "청운동", ""),
                        new LegalDongRow("1111010100", "서울특별시", "종로구", "청운동", "1리")));
        RegionService service = new RegionService(repository);

        // when & then
        assertThat(service.legalDongsByName("청운동")).containsExactly(new LegalDong("11110", "청운동"));
        assertThat(service.legalDongsByName("종로구")).isEmpty();
    }
}
