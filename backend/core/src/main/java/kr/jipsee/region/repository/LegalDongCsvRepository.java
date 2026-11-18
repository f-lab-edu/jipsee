package kr.jipsee.region.repository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import kr.jipsee.region.dto.LegalDongRow;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;

/** 법정동 CSV 조회 */
@Repository
public class LegalDongCsvRepository {
    private final Resource csv;

    public LegalDongCsvRepository() {
        this(new ClassPathResource("bjd/bjd.csv"));
    }

    LegalDongCsvRepository(Resource csv) {
        this.csv = csv;
    }

    /** 첫 줄의 헤더를 건너뛰고 모든 행을 읽어 반환 */
    public List<LegalDongRow> findAll() {
        try (BufferedReader reader =
                new BufferedReader(new InputStreamReader(csv.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines()
                    .skip(1)
                    .map(line -> line.split(",", -1))
                    .map(fields -> new LegalDongRow(fields[0], fields[1], fields[2], fields[3], fields[4]))
                    .toList();
        } catch (IOException e) {
            throw new IllegalStateException("법정동 CSV를 읽지 못함", e);
        }
    }
}
