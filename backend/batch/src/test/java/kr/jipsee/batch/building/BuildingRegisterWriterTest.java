package kr.jipsee.batch.building;

import static org.mockito.BDDMockito.then;

import java.util.List;
import kr.jipsee.building.dto.BuildingRegisterReplaceItem;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.service.BuildingRegisterService;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.infrastructure.item.Chunk;

@ExtendWith(MockitoExtension.class)
class BuildingRegisterWriterTest {

    @Mock
    BuildingRegisterService service;

    @InjectMocks
    BuildingRegisterWriter writer;

    @Test
    @DisplayName("chunk의 항목마다 법정동 단위로 교체함")
    void chunk의_항목마다_법정동_단위로_교체함() {
        // given
        LegalDongKey first = new LegalDongKey("11350", "10400");
        LegalDongKey second = new LegalDongKey("11350", "10500");
        List<BuildingRegisterRow> firstRows = List.of(emptyRow());
        List<BuildingRegisterRow> secondRows = List.of();
        Chunk<BuildingRegisterReplaceItem> chunk = new Chunk<>(
                new BuildingRegisterReplaceItem(first, firstRows), new BuildingRegisterReplaceItem(second, secondRows));

        // when
        writer.write(chunk);

        // then
        then(service).should().replaceByLegalDong(first, firstRows);
        then(service).should().replaceByLegalDong(second, secondRows);
    }

    private static BuildingRegisterRow emptyRow() {
        return new BuildingRegisterRow(
                null,
                "K1",
                "서울특별시 노원구 하계동 67-22",
                null,
                null,
                null,
                "0",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }
}
