package kr.jipsee.collect.config;

import java.time.YearMonth;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** jipsee.collect 설정. 초기 적재 종료 월을 바꾸면 적재를 처음부터 다시 시작 */
@ConfigurationProperties("jipsee.collect")
public record CollectProperties(YearMonth initialLoadEndMonth) {}
