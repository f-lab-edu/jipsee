package kr.jipsee.deal.repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import kr.jipsee.deal.dto.AreaRange;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.ContractType;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.DealType;
import kr.jipsee.deal.dto.GroupDeal;
import kr.jipsee.deal.dto.HouseNames;
import kr.jipsee.deal.dto.NearbyDealRow;
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
    private static final String AREA_RANGE_SQL = """
        select min(exclusive_area) as min_area, max(exclusive_area) as max_area
        from (select exclusive_area from rent_deal
              where sigungu_code = ? and legal_dong_name = ? and lot_number = ? and exclusive_area > 0
              union all
              select exclusive_area from sale_deal
              where sigungu_code = ? and legal_dong_name = ? and lot_number = ? and exclusive_area > 0) deals
        """;
    private static final String NEARBY_CONDITION = """
        from rent_deal
        where sigungu_code = ? and legal_dong_name = ?
          and deal_date between ? and ?
          and exclusive_area between ? and ?
          and (monthly_rent = 0) = ?
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
                DealType.fromCode(rs.getString("type")),
                ContractType.fromCode(rs.getString("contract")),
                rs.getBigDecimal("exclusive_area"),
                rs.getInt("amount"),
                rs.getObject("monthly_rent", Integer.class),
                rs.getBoolean("cancelled"));
        BuildingKey key = new BuildingKey(
                rs.getString("sigungu_code"), rs.getString("legal_dong_name"), rs.getString("lot_number"));

        return new Row(key, rs.getString("house_name"), deal);
    }

    /** 건물의 전월세와 매매 전용면적(0 초과) 최솟값과 최댓값 조회. 거래가 없으면 empty */
    public Optional<AreaRange> findAreaRange(BuildingKey key) {
        AreaRange range = jdbcTemplate.queryForObject(
                AREA_RANGE_SQL,
                (rs, rowNum) -> {
                    BigDecimal min = rs.getBigDecimal("min_area");
                    BigDecimal max = rs.getBigDecimal("max_area");
                    return min == null ? null : new AreaRange(min, max);
                },
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber(),
                key.sigunguCode(),
                key.legalDongName(),
                key.lotNumber());

        return Optional.ofNullable(range);
    }

    /** 같은 법정동의 전월세 거래를 최신순으로 한 페이지(20건) 조회. range는 기준 건물 면적의 최솟값 - 10㎡부터 최댓값 + 10㎡까지 */
    public List<NearbyDealRow> findNearbyDeals(
            BuildingKey key, LocalDate from, LocalDate to, AreaRange range, boolean jeonse, long offset) {
        String sql = """
            select id, deal_date, exclusive_area, house_name, sigungu_code, legal_dong_name, lot_number,
                   case when monthly_rent = 0 then 'jeonse' else 'wolse' end as type,
                   case contract_type when '신규' then 'new' when '갱신' then 'renewal' end as contract,
                   deposit as amount, nullif(monthly_rent, 0) as monthly_rent
            """ + NEARBY_CONDITION + """
            order by deal_date desc, id desc
            limit 20 offset ?
            """;

        return jdbcTemplate.query(
                sql,
                this::mapNearbyRow,
                key.sigunguCode(),
                key.legalDongName(),
                from,
                to,
                range.min(),
                range.max(),
                jeonse,
                offset);
    }

    /** findNearbyDeals와 같은 조건의 전체 건수 조회 */
    public long countNearbyDeals(BuildingKey key, LocalDate from, LocalDate to, AreaRange range, boolean jeonse) {
        Long count = jdbcTemplate.queryForObject(
                "select count(*) " + NEARBY_CONDITION,
                Long.class,
                key.sigunguCode(),
                key.legalDongName(),
                from,
                to,
                range.min(),
                range.max(),
                jeonse);

        return Objects.requireNonNull(count);
    }

    private NearbyDealRow mapNearbyRow(ResultSet rs, int rowNum) throws SQLException {
        return new NearbyDealRow(
                rs.getLong("id"),
                DealType.fromCode(rs.getString("type")),
                YearMonth.from(rs.getObject("deal_date", LocalDate.class)),
                ContractType.fromCode(rs.getString("contract")),
                rs.getBigDecimal("exclusive_area"),
                rs.getInt("amount"),
                rs.getObject("monthly_rent", Integer.class),
                HouseNames.normalize(rs.getString("house_name")),
                rs.getString("sigungu_code"),
                rs.getString("legal_dong_name"),
                rs.getString("lot_number"));
    }
}
