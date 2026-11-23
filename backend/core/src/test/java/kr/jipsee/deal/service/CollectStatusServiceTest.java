package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.CollectStatusRow;
import kr.jipsee.deal.dto.DataSourceStatus;
import kr.jipsee.deal.repository.CollectStatusRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CollectStatusServiceTest {

    @Mock
    CollectStatusRepository collectStatusRepository;

    @InjectMocks
    CollectStatusService collectStatusService;

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("loaded_at의 연월을 baseMonth로 변환하고 저장소 순서를 유지함")
        void loaded_at의_연월을_baseMonth로_변환하고_저장소_순서를_유지함() {
            // given
            given(collectStatusRepository.findAll())
                    .willReturn(List.of(
                            new CollectStatusRow("RENT_DEAL", LocalDateTime.of(2026, 11, 19, 4, 2)),
                            new CollectStatusRow("SALE_DEAL", LocalDateTime.of(2026, 11, 19, 4, 4))));

            // when
            List<DataSourceStatus> result = collectStatusService.findAll();

            // then
            assertThat(result)
                    .containsExactly(
                            new DataSourceStatus("RENT_DEAL", YearMonth.of(2026, 11)),
                            new DataSourceStatus("SALE_DEAL", YearMonth.of(2026, 11)));
        }

        @Test
        @DisplayName("행이 없으면 빈 목록을 반환함")
        void 행이_없으면_빈_목록을_반환함() {
            // given
            given(collectStatusRepository.findAll()).willReturn(List.of());

            // when
            List<DataSourceStatus> result = collectStatusService.findAll();

            // then
            assertThat(result).isEmpty();
        }
    }
}
