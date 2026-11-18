package kr.jipsee.building.dto;

/** 필지를 식별하는 다섯 개의 값. 시군구, 법정동, 대지구분 코드가 빈 값이면 null. 본번과 부번이 빈 값이면 0000 */
public record ParcelKey(
        String sigunguCode, String legalDongCode, String landTypeCode, String mainLotNumber, String subLotNumber) {

    /** 다섯 개의 값이 모두 있으면 true. 본번과 부번은 항상 있으므로 앞의 세 코드가 비어 있는지가 기준 */
    public boolean isComplete() {
        return sigunguCode != null
                && legalDongCode != null
                && landTypeCode != null
                && mainLotNumber != null
                && subLotNumber != null;
    }
}
