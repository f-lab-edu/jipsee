package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import kr.jipsee.deal.dto.BuildingInfo;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.GroupDeal;
import kr.jipsee.deal.repository.BuildingRepository;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import kr.jipsee.region.RegionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BuildingServiceTest {

    @Mock
    BuildingRepository buildingRepository;

    @Mock
    RegionService regionService;

    @InjectMocks
    BuildingService buildingService;

    private static GroupDeal deal(long id) {
        return new GroupDeal(id, YearMonth.of(2026, 9), "jeonse", null, new BigDecimal("59.99"), 30000, null, false);
    }

    @Nested
    @DisplayName("find")
    class Find {

        @Test
        @DisplayName("정상 조회하면 이력 순서 그대로 이름과 주소를 채워 반환함")
        void 정상_조회하면_이력_순서_그대로_이름과_주소를_채워_반환함() {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            List<GroupDeal> deals = List.of(deal(2), deal(1));
            given(buildingRepository.findHistory(key)).willReturn(Optional.of(new DealHistory(key, "망원 OO빌라", deals)));
            given(regionService.sigunguName("11440")).willReturn("마포구");

            // when
            BuildingInfo info = buildingService.find(key);

            // then
            assertThat(info.deals()).containsExactlyElementsOf(deals);
            assertThat(info.name()).isEqualTo("망원 OO빌라");
            assertThat(info.address()).isEqualTo("마포구 망원동 519");
        }

        @Test
        @DisplayName("요청 키가 아니라 저장소가 반환한 키를 사용함")
        void 요청_키가_아니라_저장소가_반환한_키를_사용함() {
            // given
            BuildingKey requested = new BuildingKey("11440", "망원동", "５１９");
            BuildingKey stored = new BuildingKey("11440", "망원동", "519");
            given(buildingRepository.findHistory(requested))
                    .willReturn(Optional.of(new DealHistory(stored, null, List.of(deal(1)))));
            given(regionService.sigunguName("11440")).willReturn("마포구");

            // when
            BuildingInfo info = buildingService.find(requested);

            // then
            assertThat(info.key()).isEqualTo(stored);
            assertThat(info.name()).isNull();
            assertThat(info.address()).isEqualTo("마포구 망원동 519");
        }

        @Test
        @DisplayName("이력이 없으면 BUILDING_NOT_FOUND를 던지고 시군구명을 조회하지 않음")
        void 이력이_없으면_BUILDING_NOT_FOUND를_던지고_시군구명을_조회하지_않음() {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            given(buildingRepository.findHistory(key)).willReturn(Optional.empty());

            // when
            Throwable thrown = catchThrowable(() -> buildingService.find(key));

            // then
            assertThat(thrown)
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.BUILDING_NOT_FOUND);
            then(regionService).should(never()).sigunguName(any());
        }
    }
}
