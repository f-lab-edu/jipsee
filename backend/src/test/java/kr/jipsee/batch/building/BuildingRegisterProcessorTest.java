package kr.jipsee.batch.building;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import kr.jipsee.building.client.BldRgstHubClient;
import kr.jipsee.building.dto.BuildingRegisterReplaceItem;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.service.BuildingRegisterService;
import kr.jipsee.global.publicdata.PublicDataApiException;
import kr.jipsee.global.publicdata.PublicDataApiTransientException;
import kr.jipsee.global.publicdata.PublicDataPage;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BuildingRegisterProcessorTest {

    private static final LegalDongKey KEY = new LegalDongKey("11350", "10400");

    @Mock
    BldRgstHubClient client;

    @Mock
    BuildingRegisterService service;

    BuildingRegisterProcessor processor;

    @BeforeEach
    void setUp() {
        processor = new BuildingRegisterProcessor(client, service);
    }

    private static BuildingRegisterRow row(String managementKey) {
        return row(new ParcelKey("11350", "10400", "0", "0067", "0022"), managementKey);
    }

    private static BuildingRegisterRow row(ParcelKey parcelKey, String managementKey) {
        return new BuildingRegisterRow(
                parcelKey,
                managementKey,
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
                "다세대주택",
                null,
                null,
                null,
                null);
    }

    private static List<BuildingRegisterRow> rows(String prefix, int count) {
        List<BuildingRegisterRow> rows = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            rows.add(row(prefix + i));
        }
        return rows;
    }

    private static PublicDataPage<BuildingRegisterRow> page(int totalCount, List<BuildingRegisterRow> rows) {
        return new PublicDataPage<>("00", totalCount, rows);
    }

    @Nested
    @DisplayName("교체 조건을 만족하면 항목을 반환함")
    class Replace {

        @Test
        @DisplayName("totalCount가 250이면 세 페이지를 모두 받아 행 250개의 항목으로 반환함")
        void totalCount가_250이면_세_페이지를_모두_받아_행_250개의_항목으로_반환함() {
            // given
            given(client.fetch(KEY, 1)).willReturn(page(250, rows("a", 100)));
            given(client.fetch(KEY, 2)).willReturn(page(250, rows("b", 100)));
            given(client.fetch(KEY, 3)).willReturn(page(250, rows("c", 50)));

            // when
            BuildingRegisterReplaceItem result = processor.process(KEY);

            // then
            assertThat(result.key()).isEqualTo(KEY);
            assertThat(result.rows()).hasSize(250);
            then(client).should().fetch(KEY, 1);
            then(client).should().fetch(KEY, 2);
            then(client).should().fetch(KEY, 3);
            then(client).shouldHaveNoMoreInteractions();
        }

        @Test
        @DisplayName("응답이 0건이고 저장된 동이 없으면 빈 행의 항목을 반환함")
        void 응답이_0건이고_저장된_동이_없으면_빈_행의_항목을_반환함() {
            // given
            given(client.fetch(KEY, 1)).willReturn(page(0, List.of()));
            given(service.countRegisters(KEY)).willReturn(0);

            // when
            BuildingRegisterReplaceItem result = processor.process(KEY);

            // then
            assertThat(result).isNotNull();
            assertThat(result.rows()).isEmpty();
            then(client).should().fetch(KEY, 1);
            then(client).shouldHaveNoMoreInteractions();
        }

        @Test
        @DisplayName("거른 뒤에도 행이 남으면 저장된 동의 개수를 조회하지 않음")
        void 거른_뒤에도_행이_남으면_저장된_동의_개수를_조회하지_않음() {
            // given
            given(client.fetch(KEY, 1)).willReturn(page(1, List.of(row("K1"))));

            // when
            processor.process(KEY);

            // then
            then(service).should(never()).countRegisters(any());
        }

        @ParameterizedTest(name = "{0}")
        @CsvSource({"시군구 코드,,10400,0", "법정동 코드,11350,,0", "대지구분 코드,11350,10400,"})
        @DisplayName("세 코드가 빈 행은 건수 검사에는 세고 항목에서는 뺌")
        void 세_코드가_빈_행은_건수_검사에는_세고_항목에서는_뺌(String name, String sigunguCode, String legalDongCode, String landTypeCode) {
            // given
            BuildingRegisterRow complete = row("K1");
            BuildingRegisterRow incomplete =
                    row(new ParcelKey(sigunguCode, legalDongCode, landTypeCode, "0067", "0022"), "K2");
            given(client.fetch(KEY, 1)).willReturn(page(2, List.of(complete, incomplete)));

            // when
            BuildingRegisterReplaceItem result = processor.process(KEY);

            // then
            assertThat(result.rows()).containsExactly(complete);
            assertThat(result.incompleteRegisterKeys()).containsExactly("K2");
        }
    }

    @Nested
    @DisplayName("교체하지 않고 null을 반환하는 상황")
    class Skip {

        @Test
        @DisplayName("응답이 0건인데 저장된 동이 있으면 교체하지 않고 null을 반환함")
        void 응답이_0건인데_저장된_동이_있으면_교체하지_않고_null을_반환함() {
            // given
            given(client.fetch(KEY, 1)).willReturn(page(0, List.of()));
            given(service.countRegisters(KEY)).willReturn(3);

            // when
            BuildingRegisterReplaceItem result = processor.process(KEY);

            // then
            assertThat(result).isNull();
        }

        @Test
        @DisplayName("거른 뒤 행이 남지 않고 저장된 동이 있으면 교체하지 않고 null을 반환함")
        void 거른_뒤_행이_남지_않고_저장된_동이_있으면_교체하지_않고_null을_반환함() {
            // given
            BuildingRegisterRow incomplete = row(new ParcelKey("11350", null, "0", "0067", "0022"), "K1");
            given(client.fetch(KEY, 1)).willReturn(page(1, List.of(incomplete)));
            given(service.countRegisters(KEY)).willReturn(3);

            // when
            BuildingRegisterReplaceItem result = processor.process(KEY);

            // then
            assertThat(result).isNull();
        }

        @Test
        @DisplayName("거른 뒤 행이 남지 않아도 저장된 동이 없으면 빈 행의 항목을 반환함")
        void 거른_뒤_행이_남지_않아도_저장된_동이_없으면_빈_행의_항목을_반환함() {
            // given
            BuildingRegisterRow incomplete = row(new ParcelKey("11350", null, "0", "0067", "0022"), "K1");
            given(client.fetch(KEY, 1)).willReturn(page(1, List.of(incomplete)));
            given(service.countRegisters(KEY)).willReturn(0);

            // when
            BuildingRegisterReplaceItem result = processor.process(KEY);

            // then
            assertThat(result).isEqualTo(new BuildingRegisterReplaceItem(KEY, List.of(), Set.of("K1")));
        }
    }

    @Nested
    @DisplayName("Step을 실패시키는 상황")
    class Fail {

        @Test
        @DisplayName("받은 건수가 totalCount와 다르면 두 건수를 담은 PublicDataApiException으로 실패함")
        void 받은_건수가_totalCount와_다르면_두_건수를_담은_PublicDataApiException으로_실패함() {
            // given
            given(client.fetch(KEY, 1)).willReturn(page(3, List.of(row("K1"), row("K2"))));
            given(client.fetch(KEY, 2)).willReturn(page(3, List.of()));

            // when
            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            // then
            assertThat(thrown)
                    .isInstanceOf(PublicDataApiException.class)
                    .hasMessageContaining("1135010400")
                    .hasMessageContaining("응답 item 개수 2")
                    .hasMessageContaining("totalCount 3");
        }

        @Test
        @DisplayName("managementRegisterKey가 겹치면 법정동 코드와 겹친 키를 담은 PublicDataApiException으로 실패함")
        void managementRegisterKey가_겹치면_법정동_코드와_겹친_키를_담은_PublicDataApiException으로_실패함() {
            // given
            given(client.fetch(KEY, 1)).willReturn(page(2, List.of(row("K1"))));
            given(client.fetch(KEY, 2)).willReturn(page(2, List.of(row("K1"))));

            // when
            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            // then
            assertThat(thrown)
                    .isInstanceOf(PublicDataApiException.class)
                    .hasMessageContaining("1135010400")
                    .hasMessageContaining("K1");
        }

        @ParameterizedTest(name = "시군구 {0}, 법정동 {1}")
        @CsvSource({"11380,10400", "11350,10500"})
        @DisplayName("요청한 법정동과 코드가 다른 행이 있으면 요청 코드와 그 행의 관리 키를 담은 PublicDataApiException으로 실패함")
        void 요청한_법정동과_코드가_다른_행이_있으면_요청_코드와_그_행의_관리_키를_담은_PublicDataApiException으로_실패함(
                String sigunguCode, String legalDongCode) {
            // given
            BuildingRegisterRow other = row(new ParcelKey(sigunguCode, legalDongCode, "0", "0067", "0022"), "K2");
            given(client.fetch(KEY, 1)).willReturn(page(2, List.of(row("K1"), other)));

            // when
            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            // then
            assertThat(thrown)
                    .isInstanceOf(PublicDataApiException.class)
                    .hasMessageContaining("1135010400")
                    .hasMessageContaining("K2");
        }

        @Test
        @DisplayName("한도 초과 PublicDataApiException은 건너뛰지 않고 그대로 던짐")
        void 한도_초과_PublicDataApiException은_건너뛰지_않고_그대로_던짐() {
            // given
            PublicDataApiException exception = new PublicDataApiException("호출 한도 초과(22)");
            willThrow(exception).given(client).fetch(KEY, 1);

            // when
            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            // then
            assertThat(thrown).isSameAs(exception);
        }

        @Test
        @DisplayName("재시도를 다 쓴 PublicDataApiTransientException도 그대로 던짐")
        void 재시도를_다_쓴_PublicDataApiTransientException도_그대로_던짐() {
            // given
            PublicDataApiTransientException exception = new PublicDataApiTransientException("연결 실패");
            willThrow(exception).given(client).fetch(KEY, 1);

            // when
            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            // then
            assertThat(thrown).isSameAs(exception);
        }
    }
}
