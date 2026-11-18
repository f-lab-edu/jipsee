package kr.jipsee.building.dto;

import java.util.List;
import kr.jipsee.region.dto.LegalDongKey;

/** 교체 대상 법정동과 그 법정동의 표제부 행 목록. Processor가 생성하고 Writer가 저장 */
public record BuildingRegisterReplaceItem(LegalDongKey key, List<BuildingRegisterRow> rows) {}
