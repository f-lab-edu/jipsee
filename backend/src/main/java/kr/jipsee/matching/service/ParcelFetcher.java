package kr.jipsee.matching.service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import kr.jipsee.building.client.BldRgstHubClient;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.dto.ParcelYears;
import kr.jipsee.building.service.BuildingParcelService;
import kr.jipsee.global.publicdata.PublicDataPage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** 재조회 여부를 판단하고, 필요하면 필지 하나의 표제부를 조회해 저장 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ParcelFetcher {
    private final BldRgstHubClient client;
    private final BuildingParcelService parcelService;
    private final Clock clock;

    /**
     * 건축물대장 수집 기록이 있고, 필지 조회 기록이 없거나 마지막 조회 뒤에 수집이 한 번 더 끝났으면 조회해 저장하고 결과를 반환
     * - 그 밖에는 빈 값. 조회했어도 저장하지 않으면 빈 값
     * - registerLoadedAt은 건축물대장의 마지막 수집 시각이며 호출하는 쪽이 넘김
     * - 한도 초과를 포함한 API 예외는 잡지 않음
     */
    public Optional<ParcelYears> fetchIfNeeded(ParcelKey key, Optional<LocalDateTime> registerLoadedAt) {
        if (!isDue(key, registerLoadedAt)) {
            return Optional.empty();
        }

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
            log.warn(
                    "단건 조회 응답의 item 개수가 totalCount와 달라 저장하지 않음: 응답 {}건, totalCount {}, 필지 {}",
                    rows.size(),
                    totalCount,
                    key);
            return Optional.empty();
        }

        return parcelService.storeLookedUp(key, rows, LocalDateTime.now(clock));
    }

    /** 건축물대장 수집 기록이 있고, 조회 기록이 없거나 수집 시각이 조회 시각보다 늦으면 true */
    private boolean isDue(ParcelKey key, Optional<LocalDateTime> registerLoadedAt) {
        if (registerLoadedAt.isEmpty()) {
            return false;
        }

        return parcelService
                .findLookedUpAt(key)
                .map(lookedUpAt -> registerLoadedAt.get().isAfter(lookedUpAt))
                .orElse(true);
    }
}
