package kr.jipsee.building.dto;

import java.util.List;
import java.util.Set;
import kr.jipsee.region.dto.LegalDongKey;

/** 교체 대상 법정동, 표제부 행 목록, 필지 식별 값 누락으로 저장과 삭제 대상에서 제외할 관리 키. Processor가 생성하고 Writer가 저장 */
public record BuildingRegisterReplaceItem(
        LegalDongKey key, List<BuildingRegisterRow> rows, Set<String> incompleteRegisterKeys) {}
