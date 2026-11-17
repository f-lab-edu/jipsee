package kr.jipsee.region.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.jipsee.region.dto.LegalDongKey;
import kr.jipsee.region.dto.LegalDongRow;
import kr.jipsee.region.repository.LegalDongCsvRepository;
import org.springframework.stereotype.Service;

/** 법정동 사전 기반 지역 정보 */
@Service
public class RegionService {
    private final List<String> sigunguCodes;
    private final List<LegalDongKey> legalDongKeys;

    public RegionService(LegalDongCsvRepository repository) {
        List<LegalDongRow> rows = repository.findAll();
        Map<String, String> candidates = readCandidates(rows);
        this.sigunguCodes = candidates.keySet().stream()
                .filter(code -> !hasChildDistrict(code, candidates))
                .sorted()
                .toList();
        this.legalDongKeys = readLegalDongKeys(rows);
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

    /** 뒤 5자리가 00000이 아닌 읍면동과 리 행을 앞의 5자리와 뒤의 5자리로 분리 */
    private static List<LegalDongKey> readLegalDongKeys(List<LegalDongRow> rows) {
        return rows.stream()
                .map(LegalDongRow::code)
                .filter(code -> !code.endsWith("00000"))
                .map(code -> new LegalDongKey(code.substring(0, 5), code.substring(5)))
                .sorted(Comparator.comparing(LegalDongKey::code))
                .toList();
    }

    /** 하위 구가 있는 시를 뺀 시군구 코드 5자리를 오름차순으로 반환 */
    public List<String> sigunguCodes() {
        return sigunguCodes;
    }

    /** 읍면동과 리의 법정동 키를 코드 오름차순으로 반환 */
    public List<LegalDongKey> legalDongKeys() {
        return legalDongKeys;
    }
}
