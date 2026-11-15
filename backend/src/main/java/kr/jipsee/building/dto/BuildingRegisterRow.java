package kr.jipsee.building.dto;

import java.math.BigDecimal;

/** 건축물대장 표제부 수집 후 building_register 테이블에 추가할 데이터 Row 하나 */
public record BuildingRegisterRow(
        ParcelKey parcelKey,
        String managementRegisterKey,
        String lotAddress,
        String roadAddress,
        String name,
        String dongName,
        String mainAnnexTypeCode,
        String useApprovalDate,
        Integer householdCount,
        Integer aboveGroundFloorCount,
        Integer undergroundFloorCount,
        Integer passengerElevatorCount,
        String structureName,
        String earthquakeDesignApplied,
        BigDecimal totalFloorArea,
        String etcPurpose,
        Integer indoorMechanicalParkingCount,
        Integer outdoorMechanicalParkingCount,
        Integer indoorSelfPropelledParkingCount,
        Integer outdoorSelfPropelledParkingCount) {}
