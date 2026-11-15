package kr.jipsee.collect.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.stream.Stream;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.global.publicdata.PublicDataApiClient;
import kr.jipsee.global.publicdata.PublicDataApiException;
import kr.jipsee.global.publicdata.PublicDataItem;
import kr.jipsee.global.publicdata.PublicDataPage;
import kr.jipsee.global.publicdata.PublicDataProperties;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

class BldRgstHubClientTest {

    private static final JsonMapper JSON = JsonMapper.builder().build();
    private static final LegalDongKey KEY = new LegalDongKey("11350", "10400");

    /** 2026-11-15에 11350/10400을 호출해 받은 실제 응답의 item 한 건 (노원구 하계동 67-22 한화그린빌A동) */
    private static final String REAL_ITEM = """
            {"rnum":78,"platPlc":"서울특별시 노원구 하계동 67-22번지","sigunguCd":"11350","bjdongCd":"10400",
             "platGbCd":"0","bun":"0067","ji":"0022","mgmBldrgstPk":101218426,"regstrGbCd":"2","regstrGbCdNm":"집합",
             "regstrKindCd":"3","regstrKindCdNm":"표제부","newPlatPlc":"서울특별시 노원구 공릉로58마길 45-10 (하계동)",
             "bldNm":"한화그린빌A동","splotNm":" ","block":" ","lot":" ","bylotCnt":0,"naRoadCd":"113504130034",
             "naBjdongCd":"10401","naUgrndCd":"0","naMainBun":"45","naSubBun":"10","dongNm":"한화그린빌A동",
             "mainAtchGbCd":"0","mainAtchGbCdNm":"주건축물","platArea":220,"archArea":131.95,"bcRat":59.98,
             "totArea":541.4,"vlRatEstmTotArea":541.4,"vlRat":246.09,"strctCd":"21","strctCdNm":"철근콘크리트구조",
             "etcStrct":"철근콘크리트구조","mainPurpsCd":"02000","mainPurpsCdNm":"공동주택","etcPurps":"다세대주택",
             "roofCd":"10","roofCdNm":"(철근)콘크리트","etcRoof":"(철근)콘크리트 평스라브","hhldCnt":8,"fmlyCnt":0,
             "heit":14.5,"grndFlrCnt":5,"ugrndFlrCnt":0,"rideUseElvtCnt":0,"emgenUseElvtCnt":0,"atchBldCnt":0,
             "atchBldArea":0,"totDongTotArea":541.4,"indrMechUtcnt":0,"indrMechArea":0,"oudrMechUtcnt":0,
             "oudrMechArea":0,"indrAutoUtcnt":8,"indrAutoArea":113.38,"oudrAutoUtcnt":0,"oudrAutoArea":0,
             "pmsDay":"20030401","stcnsDay":"20030627","useAprDay":"20040825","pmsnoYear":"2003",
             "pmsnoKikCd":"3100086","pmsnoKikCdNm":"건축과","pmsnoGbCd":"1101","pmsnoGbCdNm":"신축허가","hoCnt":0,
             "engrGrade":" ","engrRat":0,"engrEpi":0,"gnBldGrade":" ","gnBldCert":0,"itgBldGrade":" ","itgBldCert":0,
             "crtnDay":"20220813","rserthqkDsgnApplyYn":"0","rserthqkAblty":" "}""";

    private MockRestServiceServer server;
    private BldRgstHubClient client;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        client = new BldRgstHubClient(
                PublicDataApiClient.restClient(builder, "http://localhost/1613000"),
                PublicDataApiClient.retryTemplate(Duration.ofMillis(1)),
                JSON,
                new PublicDataProperties(new PublicDataProperties.Api("http://localhost/1613000", "abc%2Bdef%3D")));
    }

    /** 실제 응답과 같은 껍데기(resultCode 00, 문자열 totalCount)에 item들을 담은 본문 */
    private static String pageBody(String... items) {
        return "{\"response\":{\"header\":{\"resultCode\":\"00\",\"resultMsg\":\"NORMAL SERVICE\"},"
                + "\"body\":{\"items\":{\"item\":[" + String.join(",", items) + "]},\"numOfRows\":\"100\","
                + "\"pageNo\":\"1\",\"totalCount\":\"" + items.length + "\"}}}";
    }

    /** 실제 item의 필드 하나를 바꾼 PublicDataItem */
    private static PublicDataItem itemWith(String field, JsonNode value) {
        ObjectNode node = (ObjectNode) JSON.readTree(REAL_ITEM);
        node.replace(field, value);
        return PublicDataItem.of(node);
    }

    private static PublicDataItem itemWith(String field, String value) {
        return itemWith(field, JSON.getNodeFactory().stringNode(value));
    }

    @Test
    @DisplayName("법정동 하나의 표제부를 100건 단위 쿼리로 요청함")
    void 법정동_하나의_표제부를_100건_단위_쿼리로_요청함() {
        // given
        server.expect(request -> {
                    assertThat(request.getURI().getRawPath()).isEqualTo("/1613000/BldRgstHubService/getBrTitleInfo");
                    assertThat(request.getURI().getRawQuery())
                            .isEqualTo(
                                    "serviceKey=abc%2Bdef%3D&sigunguCd=11350&bjdongCd=10400&pageNo=1&numOfRows=100&_type=json");
                })
                .andRespond(withSuccess(pageBody(REAL_ITEM), MediaType.APPLICATION_JSON));

        // when
        client.fetch(KEY, 1);

        // then
        server.verify();
    }

    @Test
    @DisplayName("응답을 totalCount와 행 목록의 페이지로 반환함")
    void 응답을_totalCount와_행_목록의_페이지로_반환함() {
        // given
        server.expect(request -> {})
                .andRespond(withSuccess(pageBody(REAL_ITEM, REAL_ITEM), MediaType.APPLICATION_JSON));

        // when
        PublicDataPage<BuildingRegisterRow> page = client.fetch(KEY, 1);

        // then
        assertThat(page.resultCode()).isEqualTo("00");
        assertThat(page.totalCount()).isEqualTo(2);
        assertThat(page.items()).hasSize(2);
    }

    @ParameterizedTest
    @ValueSource(
            strings = {
                "{\"item\":[]}", // 2026-11-15에 4148041024를 호출해 받은 실제 형태
                "\"\""
            })
    @DisplayName("응답이 0건이면 items가 item 빈 배열이어도 빈 문자열이어도 빈 목록을 반환함")
    void 응답이_0건이면_items가_item_빈_배열이어도_빈_문자열이어도_빈_목록을_반환함(String items) {
        // given
        String body = "{\"response\":{\"header\":{\"resultCode\":\"00\",\"resultMsg\":\"NORMAL SERVICE\"},"
                + "\"body\":{\"items\":" + items + ",\"numOfRows\":\"100\",\"pageNo\":\"1\",\"totalCount\":\"0\"}}}";
        server.expect(request -> {}).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        // when
        PublicDataPage<BuildingRegisterRow> page = client.fetch(KEY, 1);

        // then
        assertThat(page.totalCount()).isZero();
        assertThat(page.items()).isEmpty();
    }

    @Test
    @DisplayName("정상이 아닌 resultCode 000은 건축HUB에서는 코드를 담은 PublicDataApiException으로 실패함")
    void 정상이_아닌_resultCode_000은_건축HUB에서는_코드를_담은_PublicDataApiException으로_실패함() {
        // given
        String body = pageBody(REAL_ITEM).replace("\"resultCode\":\"00\"", "\"resultCode\":\"000\"");
        server.expect(request -> {}).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        // when
        Throwable thrown = catchThrowable(() -> client.fetch(KEY, 1));

        // then
        assertThat(thrown).isInstanceOf(PublicDataApiException.class).hasMessageContaining("000");
        server.verify();
    }

    @Test
    @DisplayName("응답 한 건을 컬럼에 맞는 행으로 바꿈")
    void 응답_한_건을_컬럼에_맞는_행으로_바꿈() {
        // given
        PublicDataItem item = PublicDataItem.of(JSON.readTree(REAL_ITEM));

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(item);

        // then
        assertThat(row)
                .isEqualTo(new BuildingRegisterRow(
                        new ParcelKey("11350", "10400", "0", "0067", "0022"),
                        "101218426",
                        "서울특별시 노원구 하계동 67-22번지",
                        "서울특별시 노원구 공릉로58마길 45-10 (하계동)",
                        "한화그린빌A동",
                        "한화그린빌A동",
                        "0",
                        "20040825",
                        8,
                        5,
                        0,
                        0,
                        "철근콘크리트구조",
                        "0",
                        new BigDecimal("541.4"),
                        "다세대주택",
                        0,
                        0,
                        8,
                        0));
    }

    @Test
    @DisplayName("숫자로 온 22자리 관리 키도 자릿수를 잃지 않고 읽음")
    void 숫자로_온_22자리_관리_키도_자릿수를_잃지_않고_읽음() {
        // given
        PublicDataItem item = itemWith("mgmBldrgstPk", JSON.readTree("1000000000000000454433"));

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(item);

        // then
        assertThat(row.managementRegisterKey()).isEqualTo("1000000000000000454433");
    }

    @Test
    @DisplayName("문자열은 앞뒤 공백을 지우고 비면 null로 바꿈")
    void 문자열은_앞뒤_공백을_지우고_비면_null로_바꿈() {
        // given
        ObjectNode node = (ObjectNode) JSON.readTree(REAL_ITEM);
        node.put("platPlc", "  서울특별시 노원구 하계동 130-69  ");
        node.put("bldNm", "   ");
        node.put("dongNm", "");
        node.put("newPlatPlc", " ");

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(PublicDataItem.of(node));

        // then
        assertThat(row.lotAddress()).isEqualTo("서울특별시 노원구 하계동 130-69");
        assertThat(row.name()).isNull();
        assertThat(row.dongName()).isNull();
        assertThat(row.roadAddress()).isNull();
    }

    @Test
    @DisplayName("수치 0은 0으로 저장함")
    void 수치_0은_0으로_저장함() {
        // given
        ObjectNode node = (ObjectNode) JSON.readTree(REAL_ITEM);
        node.put("hhldCnt", 0);
        node.put("totArea", 0);
        node.put("indrAutoUtcnt", 0);

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(PublicDataItem.of(node));

        // then
        assertThat(row.householdCount()).isZero();
        assertThat(row.totalFloorArea()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(row.indoorSelfPropelledParkingCount()).isZero();
    }

    @Test
    @DisplayName("연면적은 소수 4자리를 잃지 않음")
    void 연면적은_소수_4자리를_잃지_않음() {
        // given
        PublicDataItem item = itemWith("totArea", JSON.readTree("176783.0394"));

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(item);

        // then
        assertThat(row.totalFloorArea()).isEqualTo(new BigDecimal("176783.0394"));
    }

    static Stream<Arguments> useApprovalDates() {
        return Stream.of(
                Arguments.of("20040312", "20040312"),
                Arguments.of("2004", "2004"),
                Arguments.of("20040300", "20040300"),
                Arguments.of("18750101", "18750101"),
                Arguments.of("0010319", "0010319"),
                Arguments.of("", null),
                Arguments.of(" ", null),
                Arguments.of("86  6 18", null));
    }

    @ParameterizedTest(name = "[{index}] \"{0}\" -> {1}")
    @MethodSource("useApprovalDates")
    @DisplayName("사용승인일은 앞 4자가 숫자일 때만 원본 그대로 저장함")
    void 사용승인일은_앞_4자가_숫자일_때만_원본_그대로_저장함(String useAprDay, String expected) {
        // given
        PublicDataItem item = itemWith("useAprDay", useAprDay);

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(item);

        // then
        assertThat(row.useApprovalDate()).isEqualTo(expected);
    }

    static Stream<Arguments> earthquakeFlags() {
        return Stream.of(Arguments.of("", null), Arguments.of("0", "0"), Arguments.of("1", "1"));
    }

    @ParameterizedTest(name = "[{index}] \"{0}\" -> {1}")
    @MethodSource("earthquakeFlags")
    @DisplayName("내진설계 적용 여부가 비면 null이고 0과 1은 그대로 저장함")
    void 내진설계_적용_여부가_비면_null이고_0과_1은_그대로_저장함(String flag, String expected) {
        // given
        PublicDataItem item = itemWith("rserthqkDsgnApplyYn", flag);

        // when
        BuildingRegisterRow row = BldRgstHubClient.toRow(item);

        // then
        assertThat(row.earthquakeDesignApplied()).isEqualTo(expected);
    }

    @ParameterizedTest
    @ValueSource(strings = {"mgmBldrgstPk", "platPlc", "mainAtchGbCd"})
    @DisplayName("필수 값이 비면 필드 이름을 담은 PublicDataApiException으로 실패함")
    void 필수_값이_비면_필드_이름을_담은_PublicDataApiException으로_실패함(String field) {
        // given
        PublicDataItem item = itemWith(field, " ");

        // when
        Throwable thrown = catchThrowable(() -> BldRgstHubClient.toRow(item));

        // then
        assertThat(thrown).isInstanceOf(PublicDataApiException.class).hasMessageContaining(field);
    }

    @ParameterizedTest(name = "[{index}] {0}=\"{1}\"")
    @MethodSource("blankParcelKeyValues")
    @DisplayName("시군구, 법정동, 대지구분 코드가 비어 있으면 예외 없이 null로 읽고 필지 키는 완전하지 않음")
    void 시군구_법정동_대지구분_코드가_비어_있으면_예외_없이_null로_읽고_필지_키는_완전하지_않음(String field, String value) {
        // given
        PublicDataItem item = itemWith(field, value);

        // when
        ParcelKey parcelKey = BldRgstHubClient.toRow(item).parcelKey();

        // then
        assertThat(parcelKey.isComplete()).isFalse();
        assertThat(keyValue(parcelKey, field)).isNull();
    }

    static Stream<Arguments> blankParcelKeyValues() {
        return Stream.of("sigunguCd", "bjdongCd", "platGbCd")
                .flatMap(field -> Stream.of(Arguments.of(field, ""), Arguments.of(field, "  ")));
    }

    static Stream<Arguments> blankLotNumberValues() {
        return Stream.of("bun", "ji").flatMap(field -> Stream.of(Arguments.of(field, ""), Arguments.of(field, "  ")));
    }

    @ParameterizedTest(name = "[{index}] {0}=\"{1}\"")
    @MethodSource("blankLotNumberValues")
    @DisplayName("본번이나 부번이 비어 있으면 0000으로 읽고 필지 키는 완전함")
    void 본번이나_부번이_비어_있으면_0000으로_읽고_필지_키는_완전함(String field, String value) {
        // given
        PublicDataItem item = itemWith(field, value);

        // when
        ParcelKey parcelKey = BldRgstHubClient.toRow(item).parcelKey();

        // then
        assertThat(parcelKey.isComplete()).isTrue();
        assertThat(keyValue(parcelKey, field)).isEqualTo("0000");
    }

    @Test
    @DisplayName("필지 식별 값은 앞뒤 공백을 지우고 다섯 값이 모두 있으면 필지 키가 완전함")
    void 필지_식별_값은_앞뒤_공백을_지우고_다섯_값이_모두_있으면_필지_키가_완전함() {
        // given
        ObjectNode node = (ObjectNode) JSON.readTree(REAL_ITEM);
        node.put("sigunguCd", " 11350 ");
        node.put("bjdongCd", " 10400 ");
        node.put("platGbCd", " 0 ");
        node.put("bun", " 0067 ");
        node.put("ji", " 0022 ");

        // when
        ParcelKey parcelKey = BldRgstHubClient.toRow(PublicDataItem.of(node)).parcelKey();

        // then
        assertThat(parcelKey).isEqualTo(new ParcelKey("11350", "10400", "0", "0067", "0022"));
        assertThat(parcelKey.isComplete()).isTrue();
    }

    private static String keyValue(ParcelKey parcelKey, String field) {
        return switch (field) {
            case "sigunguCd" -> parcelKey.sigunguCode();
            case "bjdongCd" -> parcelKey.legalDongCode();
            case "platGbCd" -> parcelKey.landTypeCode();
            case "bun" -> parcelKey.mainLotNumber();
            case "ji" -> parcelKey.subLotNumber();
            default -> throw new IllegalArgumentException(field);
        };
    }
}
