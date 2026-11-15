package kr.jipsee.collect.dto;

import java.util.List;

/**
 * 하나의 시군구의 한 달 치 거래. Writer가 DB를 교체하기 위한 Row
 * @param key 시군구와 계약 월
 * @param rows 해당 키의 전체 거래 행
 */
public record DealReplaceItem<T>(DealKey key, List<T> rows) {}
