package kr.jipsee.deal.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.GroupDeal;
import kr.jipsee.deal.dto.HouseNames;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** 건물 단위 rent_deal, sale_deal 조회 (JdbcTemplate) */
@Repository
@RequiredArgsConstructor
public class BuildingRepository {
    private final JdbcTemplate jdbcTemplate;
    private static final String HISTORY_SQL = """
        select sigungu_code, legal_dong_name, lot_number, house_name, 0 as source_order, id, deal_date,
               exclusive_area,
               case when monthly_rent = 0 then 'jeonse' else 'wolse' end as type,
               case contract_type when '신규' then 'new' when '갱신' then 'renewal' end as contract,
               deposit as amount, nullif(monthly_rent, 0) as monthly_rent, false as cancelled
        from rent_deal
        where sigungu_code = ? and legal_dong_name = ? and lot_number = ?
        union all
        select sigungu_code, legal_dong_name, lot_number, house_name, 1, id, deal_date,
               exclusive_area, 'sale', null, deal_amount, null, cancellation_type = 'O'
        from sale_deal
        where sigungu_code = ? and legal_dong_name = ? and lot_number = ?
        order by deal_date desc, source_order, id desc
        """;

    private record Row(BuildingKey key, String houseName, GroupDeal deal) {}

    /** 건물 키의 전월세와 매매 이력을 최신순으로 조회. 0행이면 empty */
    public Optional<DealHistory> findHistory(BuildingKey key) {
        List<Row> rows = jdbcTemplate.query(
                HISTORY_SQL,
                this::mapRow,
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber(),
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber());

        if (rows.isEmpty()) {
            return Optional.empty();
        }

        String houseName = rows.stream()
                .map(row -> HouseNames.normalize(row.houseName()))
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);

        return Optional.of(new DealHistory(
                rows.get(0).key(), houseName, rows.stream().map(Row::deal).toList()));
    }

    private Row mapRow(ResultSet rs, int rowNum) throws SQLException {
        GroupDeal deal = new GroupDeal(
                rs.getLong("id"),
                YearMonth.from(rs.getObject("deal_date", LocalDate.class)),
                rs.getString("type"),
                rs.getString("contract"),
                rs.getBigDecimal("exclusive_area"),
                rs.getInt("amount"),
                rs.getObject("monthly_rent", Integer.class),
                rs.getBoolean("cancelled"));
        BuildingKey key = new BuildingKey(
                rs.getString("sigungu_code"), rs.getString("legal_dong_name"), rs.getString("lot_number"));

        return new Row(key, rs.getString("house_name"), deal);
    }
}
