package kr.jipsee.global.common;

import java.time.ZoneId;

/** 서비스 전체에서 쓰는 시간대 */
public final class TimeZones {

    /** 어노테이션 속성에 쓰는 한국 시간대 ID */
    public static final String SEOUL_ID = "Asia/Seoul";

    /** 날짜와 시각은 모두 한국 시간 기준 */
    public static final ZoneId SEOUL = ZoneId.of(SEOUL_ID);

    private TimeZones() {}
}
