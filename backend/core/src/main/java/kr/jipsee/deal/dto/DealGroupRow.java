package kr.jipsee.deal.dto;

import java.time.LocalDate;

/** deal_group 조회 결과의 한 행. name과 latestNewJeonseDate는 null일 수 있음 */
public record DealGroupRow(
        String sigunguCode,
        String legalDongName,
        String lotNumber,
        String name,
        LocalDate lastDealDate,
        LocalDate latestNewJeonseDate) {}
