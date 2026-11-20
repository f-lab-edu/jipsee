package kr.jipsee.building.service;

import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.repository.BuildingRegisterRepository;
import kr.jipsee.region.dto.LegalDongKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 건축물대장 표제부를 법정동 단위로 교체해 필지와 동을 저장함 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingRegisterService {
    private static final List<String> TARGET_KEYWORDS = List.of("연립", "다세대");

    private final BuildingRegisterRepository repository;

    /** 법정동의 응답 전체에서 대상 필지의 동을 저장하고, 응답에 없는 동을 삭제하고, 필지 이름을 다시 정함. keepRegisterKeys의 동은 삭제하지 않음 */
    @Transactional
    public void replaceByLegalDong(LegalDongKey key, List<BuildingRegisterRow> rows, Set<String> keepRegisterKeys) {
        Map<ParcelKey, Long> storedParcelIds = repository.findParcelIds(key);
        List<BuildingRegisterRow> targetRows = selectTargetRows(rows, storedParcelIds.keySet());

        Set<ParcelKey> newParcelKeys = targetRows.stream()
                .map(BuildingRegisterRow::parcelKey)
                .filter(parcelKey -> !storedParcelIds.containsKey(parcelKey))
                .collect(Collectors.toCollection(LinkedHashSet::new));
        Map<ParcelKey, Long> parcelIds = storedParcelIds;
        if (!newParcelKeys.isEmpty()) {
            repository.insertParcels(List.copyOf(newParcelKeys));
            parcelIds = repository.findParcelIds(key);
        }

        repository.upsertRegisters(targetRows, parcelIds);

        Set<String> staleKeys = new HashSet<>(repository.findRegisterKeys(key));
        targetRows.forEach(row -> staleKeys.remove(row.managementRegisterKey()));
        staleKeys.removeAll(keepRegisterKeys);
        repository.deleteRegisters(staleKeys);

        repository.refreshParcelNames(key);
    }

    // 필지별로 묶어 연립 또는 다세대 동이 있거나 이미 저장된 필지의 모든 동만 남김
    private static List<BuildingRegisterRow> selectTargetRows(List<BuildingRegisterRow> rows, Set<ParcelKey> stored) {
        Map<ParcelKey, List<BuildingRegisterRow>> rowsByParcel = rows.stream()
                .collect(
                        Collectors.groupingBy(BuildingRegisterRow::parcelKey, LinkedHashMap::new, Collectors.toList()));

        return rowsByParcel.entrySet().stream()
                .filter(entry -> stored.contains(entry.getKey())
                        || entry.getValue().stream().anyMatch(BuildingRegisterService::hasTargetKeyword))
                .flatMap(entry -> entry.getValue().stream())
                .toList();
    }

    private static boolean hasTargetKeyword(BuildingRegisterRow row) {
        String etcPurpose = row.etcPurpose();
        return etcPurpose != null && TARGET_KEYWORDS.stream().anyMatch(etcPurpose::contains);
    }

    /** 법정동의 필지에 저장된 동의 개수 반환 */
    public int countRegisters(LegalDongKey key) {
        return repository.countRegisters(key);
    }

    /** 필지가 저장된 법정동을 코드 순으로 반환 */
    public List<LegalDongKey> findStoredLegalDongs() {
        return repository.findLegalDongs();
    }

    /** 행 중 하나라도 etcPurpose에 연립 또는 다세대가 들어 있으면 true */
    static boolean hasTargetPurpose(Collection<BuildingRegisterRow> rows) {
        return rows.stream().anyMatch(BuildingRegisterService::hasTargetKeyword);
    }
}
