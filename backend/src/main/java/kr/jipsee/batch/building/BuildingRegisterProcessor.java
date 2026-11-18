package kr.jipsee.batch.building;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import kr.jipsee.building.client.BldRgstHubClient;
import kr.jipsee.building.dto.BuildingRegisterReplaceItem;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.service.BuildingRegisterService;
import kr.jipsee.global.publicdata.PublicDataApiException;
import kr.jipsee.global.publicdata.PublicDataPage;
import kr.jipsee.region.dto.LegalDongKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.infrastructure.item.ItemProcessor;

/** 법정동 하나의 표제부를 전 페이지 fetch, 응답 validation 후 BuildingRegisterReplaceItem으로 변환 */
@Slf4j
@RequiredArgsConstructor
public class BuildingRegisterProcessor implements ItemProcessor<LegalDongKey, BuildingRegisterReplaceItem> {
    private final BldRgstHubClient client;
    private final BuildingRegisterService service;

    /** validation 실패 시 PublicDataApiException throw, Step FAILED. 저장된 동이 있고 유효 행이 0건이면 return null로 write skip */
    @Override
    public BuildingRegisterReplaceItem process(LegalDongKey key) {
        PublicDataPage<BuildingRegisterRow> firstPage = client.fetch(key, 1);
        int totalCount = firstPage.totalCount();
        List<BuildingRegisterRow> rows = new ArrayList<>(firstPage.items());
        boolean previousPageHasItems = !firstPage.items().isEmpty();
        int pageNo = 1;

        while (rows.size() < totalCount && previousPageHasItems) {
            PublicDataPage<BuildingRegisterRow> page = client.fetch(key, ++pageNo);
            rows.addAll(page.items());
            previousPageHasItems = !page.items().isEmpty();
        }

        if (rows.size() != totalCount) {
            throw new PublicDataApiException("공공데이터 API 응답의 item 개수가 totalCount와 다름: 응답 item 개수 " + rows.size()
                    + ", totalCount " + totalCount + ", 법정동 " + key.code());
        }
        if (rows.isEmpty() && service.countRegisters(key) > 0) {
            log.warn("저장된 동이 이미 있는데, API 응답이 0건이라서 교체를 건너뜀: 법정동 {}", key.code());
            return null;
        }

        validateUniqueRegisterKeys(key, rows);
        validateLegalDong(key, rows);

        List<BuildingRegisterRow> completeRows = removeIncompleteRows(key, rows);
        if (completeRows.isEmpty() && totalCount > 0 && service.countRegisters(key) > 0) {
            log.warn("저장된 동이 이미 있는데, 식별 값이 있는 행이 없어서 교체를 건너뜀: 법정동 {}", key.code());
            return null;
        }

        return new BuildingRegisterReplaceItem(key, completeRows);
    }

    // managementRegisterKey 중복 검사. 중복 키는 한 행만 저장되므로 PublicDataApiException throw
    private static void validateUniqueRegisterKeys(LegalDongKey key, List<BuildingRegisterRow> rows) {
        Set<String> seen = new HashSet<>();
        for (BuildingRegisterRow row : rows) {
            if (!seen.add(row.managementRegisterKey())) {
                throw new PublicDataApiException(
                        "공공데이터 API 응답에 같은 관리 키가 겹침: 법정동 " + key.code() + ", 관리 키 " + row.managementRegisterKey());
            }
        }
    }

    // sigunguCode, legalDongCode가 요청 법정동과 다르면 PublicDataApiException throw. null 코드 행은 removeIncompleteRows에서 filter
    private static void validateLegalDong(LegalDongKey key, List<BuildingRegisterRow> rows) {
        for (BuildingRegisterRow row : rows) {
            ParcelKey parcelKey = row.parcelKey();
            if (parcelKey.sigunguCode() != null
                    && parcelKey.legalDongCode() != null
                    && !new LegalDongKey(parcelKey.sigunguCode(), parcelKey.legalDongCode()).equals(key)) {
                throw new PublicDataApiException(
                        "요청한 법정동과 다른 법정동의 행이 옴: 요청 법정동 " + key.code() + ", 관리 키 " + row.managementRegisterKey());
            }
        }
    }

    // ParcelKey.isComplete()가 false인 행 filter, warn 로그
    private static List<BuildingRegisterRow> removeIncompleteRows(LegalDongKey key, List<BuildingRegisterRow> rows) {
        List<BuildingRegisterRow> completeRows = new ArrayList<>();
        for (BuildingRegisterRow row : rows) {
            if (row.parcelKey().isComplete()) {
                completeRows.add(row);
            } else {
                log.warn("필지 식별 값이 비어 있어서 건너뜀: 법정동 {}, 관리 키 {}", key.code(), row.managementRegisterKey());
            }
        }
        return completeRows;
    }
}
