package kr.jipsee.building.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.LookupResult;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.dto.ParcelYears;
import kr.jipsee.building.repository.BuildingRegisterRepository;
import kr.jipsee.building.repository.ParcelLookupRepository;
import kr.jipsee.region.dto.LegalDongKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** 필지 조회, 조회 시각 조회, 단건 조회 결과 저장 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingParcelService {
    private final BuildingRegisterRepository registerRepository;
    private final ParcelLookupRepository lookupRepository;

    /** 법정동의 필지별 동 행 유무와 사용승인 연도 집합 반환 */
    public Map<ParcelKey, ParcelYears> findParcelYears(LegalDongKey key) {
        return registerRepository.findParcelYears(key);
    }

    /** 필지의 마지막 조회 시각 반환. 기록이 없으면 빈 값 */
    public Optional<LocalDateTime> findLookedUpAt(ParcelKey key) {
        return lookupRepository.findLookedUpAt(key);
    }

    /**
     * 조회 결과를 기록하고, 연립 또는 다세대 필지이면 필지와 모든 동까지 저장
     * - 자체 트랜잭션이라 호출한 쪽이 롤백해도 기록과 저장이 유지됨
     * - 저장하지 않으면 빈 값 반환
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Optional<ParcelYears> storeLookedUp(
            ParcelKey key, List<BuildingRegisterRow> rows, LocalDateTime lookedUpAt) {
        LookupResult result = rows.isEmpty()
                ? LookupResult.EMPTY
                : BuildingRegisterService.hasTargetPurpose(rows) ? LookupResult.SAVED : LookupResult.EXCLUDED;
        lookupRepository.upsertLookup(key, lookedUpAt, result);

        if (!result.equals(LookupResult.SAVED)) {
            return Optional.empty();
        }

        registerRepository.insertParcels(List.of(key));
        // 필지 ID
        long parcelId = registerRepository
                .findParcelIds(new LegalDongKey(key.sigunguCode(), key.legalDongCode()))
                .get(key);
        registerRepository.upsertRegisters(rows, Map.of(key, parcelId));
        registerRepository.refreshParcelName(parcelId);

        Set<Integer> years = rows.stream()
                .map(BuildingRegisterRow::useApprovalDate)
                .filter(Objects::nonNull)
                .map(date -> Integer.valueOf(date.substring(0, 4)))
                .collect(Collectors.toSet());

        return Optional.of(new ParcelYears(parcelId, true, years));
    }
}
