package kr.jipsee.region;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;

class LegalDongCsvRepositoryTest {

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

    @Test
    @DisplayName("헤더를 건너뛰고 다섯 컬럼을 행으로 읽음")
    void 헤더를_건너뛰고_다섯_컬럼을_행으로_읽음() {
        List<LegalDongRow> rows = new LegalDongCsvRepository(new ByteArrayResource(CSV.getBytes(UTF_8))).findAll();

        assertThat(rows).hasSize(7);
        assertThat(rows.get(0).sigunguName()).isEmpty();
        assertThat(rows.get(2).code()).isEqualTo("1111010100");
        assertThat(rows.get(2).sigunguName()).isEqualTo("종로구");
        assertThat(rows.get(2).eupMyeonDongName()).isEqualTo("청운동");
    }

    @Test
    @DisplayName("실제 CSV에서 모든 코드가 10자리 숫자임")
    void 실제_CSV에서_모든_코드가_10자리_숫자임() {
        List<LegalDongRow> rows = new LegalDongCsvRepository().findAll();

        assertThat(rows).isNotEmpty().allMatch(row -> row.code().matches("\\d{10}"));
    }
}
