package kr.jipsee.building.dto;

/** 필지 단건 조회 결과. 값이 그대로 building_parcel_lookup.result에 저장됨 */
public enum LookupResult {
    /** 필지와 동을 저장함 */
    SAVED,
    /** 연립 또는 다세대가 아니어서 저장하지 않음 */
    EXCLUDED,
    /** 응답이 0행인 경우 */
    EMPTY
}
