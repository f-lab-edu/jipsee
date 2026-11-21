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
    @DisplayName("CSV는 생성할 때 한 번만 읽음")
    void CSV는_생성할_때_한_번만_읽음() {
        given(repository.findAll()).willReturn(List.of(new LegalDongRow("1111000000", "서울특별시", "종로구", "", "")));
        RegionService service = new RegionService(repository);

        service.sigunguCodes();
        service.sigunguCodes();

        then(repository).should(times(1)).findAll();
    }
}
