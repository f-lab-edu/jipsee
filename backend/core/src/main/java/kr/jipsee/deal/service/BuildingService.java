package kr.jipsee.deal.service;

import kr.jipsee.deal.dto.BuildingInfo;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.repository.BuildingRepository;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import kr.jipsee.region.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 건물 조회 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final RegionService regionService;

    /** 건물 상세 조회. 이력이 없으면 BUILDING_NOT_FOUND 예외 발생 */
    public BuildingInfo find(BuildingKey key) {
        DealHistory history = buildingRepository
                .findHistory(key)
                .orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));
        BuildingKey found = history.key();

        return new BuildingInfo(
                found,
                history.houseName(),
                address(found.sigunguCode(), found.legalDongName(), found.lotNumber()),
                history.deals());
    }

    /** 시군구명, 법정동명, 지번으로 주소 조립. 지번이 null이면 지번 제외. 시군구명이 없으면 IllegalStateException 발생 */
    private String address(String sigunguCode, String legalDongName, String lotNumber) {
        String sigunguName = regionService.sigunguName(sigunguCode);
        if (sigunguName == null) {
            throw new IllegalStateException("시군구명을 찾을 수 없음: " + sigunguCode);
        }
        String base = sigunguName + " " + legalDongName;

        return lotNumber == null ? base : base + " " + lotNumber;
    }
}
