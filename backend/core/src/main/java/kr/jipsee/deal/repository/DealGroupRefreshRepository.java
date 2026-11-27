package kr.jipsee.deal.repository;

import java.sql.Statement;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** deal_group 테이블 전체 재생성. deal_group_new에 채운 뒤 RENAME TABLE로 교체 */
@Repository
@RequiredArgsConstructor
public class DealGroupRefreshRepository {

    /**
     * 테이블별로 먼저 집계한 뒤 합산. name은 글자 포함 house_name 앞에 고정 폭 키를 연결한 문자열의 max로 선택
     * 키는 계약일 10자, 출처 1자(전월세 1, 매매 0), id 20자(0으로 왼쪽 채움)로 거래마다 달라 이름이 순서에 영향을 주지 않음
     * 최댓값이 계약일 내림차순, 전월세 우선, id 내림차순의 첫 행이며 키 31자 뒤가 이름
     */
    private static final String INSERT_SELECT = """
            insert into deal_group_new (sigungu_code, legal_dong_name, lot_number, name, last_deal_date, latest_new_jeonse_date)
            select sigungu_code, legal_dong_name, lot_number,
                   substring(max(packed_name), 32), max(last_deal_date), max(latest_new_jeonse_date)
            from (
                select sigungu_code, legal_dong_name, lot_number,
                       max(deal_date) as last_deal_date,
                       max(case when monthly_rent = 0 and contract_type = '신규' then deal_date end) as latest_new_jeonse_date,
                       max(case when house_name regexp '[가-힣A-Za-z]'
                                then concat(date_format(deal_date, '%Y-%m-%d'), '1', lpad(id, 20, '0'), house_name) end) as packed_name
                from rent_deal where lot_number is not null
                group by sigungu_code, legal_dong_name, lot_number
                union all
                select sigungu_code, legal_dong_name, lot_number,
                       max(deal_date), null,
                       max(case when house_name regexp '[가-힣A-Za-z]'
                                then concat(date_format(deal_date, '%Y-%m-%d'), '0', lpad(id, 20, '0'), house_name) end)
                from sale_deal where lot_number is not null
                group by sigungu_code, legal_dong_name, lot_number
            ) t
            group by sigungu_code, legal_dong_name, lot_number
            """;

    private static final List<String> REBUILD_STATEMENTS = List.of(
            "set session innodb_ft_enable_stopword = off",
            "drop table if exists deal_group_new",
            "drop table if exists deal_group_old",
            "create table deal_group_new like deal_group",
            INSERT_SELECT,
            "rename table deal_group to deal_group_old, deal_group_new to deal_group",
            "drop table deal_group_old");

    private final JdbcTemplate jdbcTemplate;

    /** 한 Connection에서 순서대로 실행. 세션 변수와 create table like가 같은 세션이어야 함 */
    public void rebuild() {
        jdbcTemplate.execute((ConnectionCallback<Void>) connection -> {
            try (Statement statement = connection.createStatement()) {
                for (String sql : REBUILD_STATEMENTS) {
                    statement.execute(sql);
                }
            }

            return null;
        });
    }
}
