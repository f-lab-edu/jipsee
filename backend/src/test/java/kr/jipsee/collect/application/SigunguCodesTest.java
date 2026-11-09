package kr.jipsee.collect.application;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;

class SigunguCodesTest {

    private static final String CSV = """
        법정동코드,시도명,시군구명,읍면동명,리명,순번,생성일자
        1100000000,서울특별시,,,,11,1988-04-23
        1111000000,서울특별시,종로구,,,1,1988-04-23
        1111010100,서울특별시,종로구,청운동,,1,1988-04-23
        4111000000,경기도,수원시,,,1,1988-04-23
        4111100000,경기도,수원시 장안구,,,1,1988-04-23
        4374000000,충청북도,영동군,,,1,1988-04-23
        4374500000,충청북도,증평군,,,1,2003-08-30
        """;

    private final List<String> codes = new SigunguCodes(new ByteArrayResource(CSV.getBytes(UTF_8))).codes();

    @Test
    @DisplayName("시도와 읍면동과 하위 구가 있는 시를 빼고 시군구 코드를 오름차순으로 도출함")
    void 시도와_읍면동과_하위_구가_있는_시를_빼고_시군구_코드를_오름차순으로_도출함() {
        assertThat(codes).containsExactly("11110", "41111", "43740", "43745");
    }

    @Test
    @DisplayName("실제 법정동 CSV에서 5자리 시군구 코드를 중복 없이 오름차순으로 도출함")
    void 실제_법정동_CSV에서_5자리_시군구_코드를_중복_없이_오름차순으로_도출함() {
        assertThat(new SigunguCodes().codes())
                .isNotEmpty()
                .allMatch(code -> code.matches("\\d{5}"))
                .doesNotHaveDuplicates()
                .isSorted();
    }
}
