package kr.jipsee.batch.building;

import kr.jipsee.building.dto.BuildingRegisterReplaceItem;
import kr.jipsee.building.service.BuildingRegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.infrastructure.item.Chunk;
import org.springframework.batch.infrastructure.item.ItemWriter;

/** chunk 항목마다 BuildingRegisterService.replaceByLegalDong을 호출해 법정동 단위로 필지와 동을 교체 */
@RequiredArgsConstructor
public class BuildingRegisterWriter implements ItemWriter<BuildingRegisterReplaceItem> {
    private final BuildingRegisterService service;

    /** chunk 항목마다 replaceByLegalDong 호출 */
    @Override
    public void write(Chunk<? extends BuildingRegisterReplaceItem> chunk) {
        for (BuildingRegisterReplaceItem item : chunk) {
            service.replaceByLegalDong(item.key(), item.rows());
        }
    }
}
