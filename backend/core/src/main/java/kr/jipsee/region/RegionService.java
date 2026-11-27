package kr.jipsee.region;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** 법정동 사전 기반 지역 정보 */
@Service
public class RegionService {
    private final List<String> sigunguCodes;
    private final Map<String, String> sigunguNames;
    private final Map<String, List<String>> sigunguCodesByName;
    private final Map<String, List<LegalDong>> legalDongsByName;

    public RegionService(LegalDongCsvRepository repository) {
        List<LegalDongRow> rows = repository.findAll();
        Map<String, String> candidates = readCandidates(rows);
        this.sigunguNames = candidates;
        this.sigunguCodes = candidates.keySet().stream()
                .filter(code -> !hasChildDistrict(code, candidates))
                .sorted()
                .toList();
        this.sigunguCodesByName = readSigunguCodesByName(sigunguCodes, candidates);
        this.legalDongsByName = readLegalDongsByName(rows, Set.copyOf(sigunguCodes));
    }

    /** 시군구 단위 행만 골라서 코드 5자리와 시군구명을 반환함 */
    private static Map<String, String> readCandidates(List<LegalDongRow> rows) {
        return rows.stream()
                .filter(row -> isSigungu(row.code()))
                .collect(Collectors.toMap(row -> row.code().substring(0, 5), LegalDongRow::sigunguName));
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

    /**
     * 수집 대상 시군구 코드를 이름별로 모아서 반환
     * - 하위 구는 전체 이름(수원시장안구)과 상위 시 이름을 뺀 이름(장안구)으로 풀리고, 상위 시 이름(수원시)은 하위 구 코드 전부로 풀림
     */
    private static Map<String, List<String>> readSigunguCodesByName(
            List<String> sigunguCodes, Map<String, String> candidates) {
        Map<String, List<String>> codesByName = new HashMap<>();

        for (String code : sigunguCodes) {
            String name = candidates.get(code);
            codesByName.computeIfAbsent(name, key -> new ArrayList<>()).add(code);
            parentName(code, candidates).ifPresent(parentName -> {
                codesByName
                        .computeIfAbsent(parentName, key -> new ArrayList<>())
                        .add(code);
                codesByName
                        .computeIfAbsent(name.substring(parentName.length()).strip(), key -> new ArrayList<>())
                        .add(code);
            });
        }

        return codesByName;
    }

    /** 같은 시도에서 이름이 앞부분과 일치하는 상위 시의 이름. 하위 구가 아니면 empty */
    private static Optional<String> parentName(String code, Map<String, String> candidates) {
        String name = candidates.get(code);

        return candidates.entrySet().stream()
                .filter(other -> !other.getKey().equals(code)
                        && other.getKey().startsWith(code.substring(0, 2))
                        && name.startsWith(other.getValue())
                        && name.length() > other.getValue().length())
                .map(Map.Entry::getValue)
                .findFirst();
    }

    /** 수집 대상 시군구의 읍면동명별 법정동 목록. 리명은 사용하지 않음 */
    private static Map<String, List<LegalDong>> readLegalDongsByName(
            List<LegalDongRow> rows, Set<String> sigunguCodes) {
        Map<String, Set<LegalDong>> legalDongs = new HashMap<>();

        for (LegalDongRow row : rows) {
            String sigunguCode = row.code().substring(0, 5);

            if (!row.eupMyeonDongName().isEmpty() && sigunguCodes.contains(sigunguCode)) {
                legalDongs
                        .computeIfAbsent(row.eupMyeonDongName(), key -> new LinkedHashSet<>())
                        .add(new LegalDong(sigunguCode, row.eupMyeonDongName()));
            }
        }

        return legalDongs.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> List.copyOf(entry.getValue())));
    }

    /** 하위 구가 있는 시를 뺀 시군구 코드 5자리를 오름차순으로 반환 */
    public List<String> sigunguCodes() {
        return sigunguCodes;
    }

    /** 시군구 코드 5자리의 시군구명을 반환. 모르는 코드는 null 반환 */
    public String sigunguName(String sigunguCode) {
        return sigunguNames.get(sigunguCode);
    }

    /** 시군구명(또는 하위 구의 짧은 이름, 상위 시 이름)에 해당하는 수집 대상 시군구 코드를 반환. 없으면 빈 목록 */
    public List<String> sigunguCodesByName(String word) {
        return sigunguCodesByName.getOrDefault(word, List.of());
    }

    /** 읍면동명에 해당하는 수집 대상 시군구의 법정동 목록을 반환. 없으면 빈 목록 */
    public List<LegalDong> legalDongsByName(String word) {
        return legalDongsByName.getOrDefault(word, List.of());
    }
}
