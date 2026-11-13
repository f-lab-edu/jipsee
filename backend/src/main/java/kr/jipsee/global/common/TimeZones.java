package kr.jipsee.global.common;

import java.time.ZoneId;

/** 서비스 전체에서 쓰는 시간대 */
public final class TimeZones {

    /** 날짜와 시각은 모두 한국 시간 기준 */
    public static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");

    private TimeZones() {}
}
