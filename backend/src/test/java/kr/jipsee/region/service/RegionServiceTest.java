package kr.jipsee.region.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import kr.jipsee.region.dto.LegalDongKey;
import kr.jipsee.region.dto.LegalDongRow;
import kr.jipsee.region.repository.LegalDongCsvRepository;
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
    @DisplayName("CSV는 생성할 때 한 번만 읽음")
    void CSV는_생성할_때_한_번만_읽음() {
        given(repository.findAll()).willReturn(List.of(new LegalDongRow("1111000000", "서울특별시", "종로구", "", "")));
        RegionService service = new RegionService(repository);

        service.sigunguCodes();
        service.sigunguCodes();

        then(repository).should(times(1)).findAll();
    }

    @Test
    @DisplayName("시도와 시군구 행을 빼고 읍면동과 리를 앞 5자리와 뒤 5자리로 나눠 코드 순으로 반환함")
    void 시도와_시군구_행을_빼고_읍면동과_리를_앞_5자리와_뒤_5자리로_나눠_코드_순으로_반환함() {
        // given
        given(repository.findAll())
                .willReturn(List.of(
                        new LegalDongRow("1100000000", "서울특별시", "", "", ""),
                        new LegalDongRow("1111000000", "서울특별시", "종로구", "", ""),
                        new LegalDongRow("1111010200", "서울특별시", "종로구", "신교동", ""),
                        new LegalDongRow("1111010100", "서울특별시", "종로구", "청운동", ""),
                        new LegalDongRow("4111000000", "경기도", "수원시", "", ""),
                        new LegalDongRow("4111110100", "경기도", "수원시 장안구", "파장동", "")));

        // when
        List<LegalDongKey> keys = new RegionService(repository).legalDongKeys();

        // then
        assertThat(keys)
                .containsExactly(
                        new LegalDongKey("11110", "10100"),
                        new LegalDongKey("11110", "10200"),
                        new LegalDongKey("41111", "10100"));
    }

    @Test
    @DisplayName("실제 법정동 CSV에서 키가 중복 없이 오름차순이고 10자리 숫자이며 뒤 5자리가 00000이 아님")
    void 실제_법정동_CSV에서_키가_중복_없이_오름차순이고_10자리_숫자이며_뒤_5자리가_00000이_아님() {
        // given
        RegionService service = new RegionService(new LegalDongCsvRepository());

        // when
        List<LegalDongKey> keys = service.legalDongKeys();

        // then
        assertThat(keys)
                .isNotEmpty()
                .allMatch(key -> key.code().matches("\\d{10}"))
                .noneMatch(key -> key.legalDongCode().equals("00000"))
                .doesNotHaveDuplicates()
                .isSortedAccordingTo(Comparator.comparing(LegalDongKey::code));
    }

    @Test
    @DisplayName("읍면동명이 같으면 시군구 코드와 이름으로 법정동 키를 찾음")
    void 읍면동명이_같으면_시군구_코드와_이름으로_법정동_키를_찾음() {
        // given
        given(repository.findAll()).willReturn(List.of(new LegalDongRow("1126010100", "서울특별시", "중랑구", "면목동", "")));

        // when
        Optional<LegalDongKey> key = new RegionService(repository).find("11260", "면목동");

        // then
        assertThat(key).contains(new LegalDongKey("11260", "10100"));
    }

    @Test
    @DisplayName("리가 있으면 읍면동명과 리명을 공백으로 이은 이름으로 찾음")
    void 리가_있으면_읍면동명과_리명을_공백으로_이은_이름으로_찾음() {
        // given
        given(repository.findAll())
                .willReturn(List.of(new LegalDongRow("1213025021", "전남광주통합특별시", "여수시", "돌산읍", "군내리")));
        RegionService service = new RegionService(repository);

        // when, then
        assertThat(service.find("12130", "돌산읍 군내리")).contains(new LegalDongKey("12130", "25021"));
        assertThat(service.find("12130", "군내리")).isEmpty();
    }

    @Test
    @DisplayName("읍면동만 있는 행은 읍면동명으로 찾음")
    void 읍면동만_있는_행은_읍면동명으로_찾음() {
        // given
        given(repository.findAll()).willReturn(List.of(new LegalDongRow("1213025000", "전남광주통합특별시", "여수시", "돌산읍", "")));

        // when
        Optional<LegalDongKey> key = new RegionService(repository).find("12130", "돌산읍");

        // then
        assertThat(key).contains(new LegalDongKey("12130", "25000"));
    }

    @Test
    @DisplayName("이름이 있어도 시군구 코드가 다르면 빈 값")
    void 이름이_있어도_시군구_코드가_다르면_빈_값() {
        // given
        given(repository.findAll()).willReturn(List.of(new LegalDongRow("1126010100", "서울특별시", "중랑구", "면목동", "")));

        // when
        Optional<LegalDongKey> key = new RegionService(repository).find("11110", "면목동");

        // then
        assertThat(key).isEmpty();
    }

    @Test
    @DisplayName("시도와 시군구 행은 찾지 않음")
    void 시도와_시군구_행은_찾지_않음() {
        // given
        given(repository.findAll())
                .willReturn(List.of(
                        new LegalDongRow("1100000000", "서울특별시", "", "", ""),
                        new LegalDongRow("1126000000", "서울특별시", "중랑구", "", "")));
        RegionService service = new RegionService(repository);

        // when, then
        assertThat(service.find("11260", "")).isEmpty();
        assertThat(service.find("11260", "중랑구")).isEmpty();
    }

    @Test
    @DisplayName("실제 사전에서 노원구 하계동을 찾음")
    void 실제_사전에서_노원구_하계동을_찾음() {
        // when
        Optional<LegalDongKey> key = new RegionService(new LegalDongCsvRepository()).find("11350", "하계동");

        // then
        assertThat(key).contains(new LegalDongKey("11350", "10400"));
    }
}
