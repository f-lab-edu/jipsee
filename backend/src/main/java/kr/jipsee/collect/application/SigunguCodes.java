package kr.jipsee.collect.application;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class SigunguCodes {
    private final List<String> codes;

    public SigunguCodes() {
        this(new ClassPathResource("bjd/bjd.csv"));
    }

    SigunguCodes(Resource csv) {
        Map<String, String> candidates = readCandidates(csv);
        this.codes = candidates.keySet().stream()
                .filter(code -> !hasChildDistrict(code, candidates))
                .sorted()
                .toList();
    }

    // 시군구 단위 행만 골라서 코드 5자리와 시군구명을 반환함
    private static Map<String, String> readCandidates(Resource csv) {
        try (BufferedReader reader =
                new BufferedReader(new InputStreamReader(csv.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines()
                    .skip(1)
                    .map(line -> line.split(",", -1))
                    .filter(fields -> isSigungu(fields[0]))
                    .collect(Collectors.toMap(fields -> fields[0].substring(0, 5), fields -> fields[2]));
        } catch (IOException e) {
            throw new IllegalStateException("법정동 CSV를 읽지 못함", e);
        }
    }

    private static boolean isSigungu(String code) {
        return code.endsWith("00000") && !code.startsWith("000", 2);
    }

    /**
     * 같은 시도에서, 해당 시의 이름으로 시작하는 다른 시군구가 있으면 하위 구가 있는 시임
     * - 수원시는 수원시 장안구가 있으므로 하위 구가 있는 시임
     * - 시군구 코드 앞 2자리로 비교함. 시도를 비교하지 않으면 서울 중구가 부산 중구와 이름이 같아 하위 구가 있는 시로 잘못 판정됨
     */
    private static boolean hasChildDistrict(String code, Map<String, String> candidates) {
        String name = candidates.get(code);
        return candidates.entrySet().stream()
                .anyMatch(other -> !other.getKey().equals(code)
                        && other.getKey().startsWith(code.substring(0, 2))
                        && other.getValue().startsWith(name));
    }

    public List<String> codes() {
        return codes;
    }
}
