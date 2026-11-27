set session innodb_ft_enable_stopword = off;

create table deal_group (
    sigungu_code char(5) not null comment "시군구코드. rent_deal, sale_deal과 같은 값",
    legal_dong_name varchar(50) not null comment "법정동명",
    lot_number varchar(20) not null comment "지번 원본 값",
    name varchar(100) comment "건물명. 글자(한글, 영문)가 있는 house_name 중 가장 늦은 거래의 값. 없으면 null",
    last_deal_date date not null comment "전월세와 매매 전체에서 가장 늦은 계약일",
    latest_new_jeonse_date date comment "신규 전세(monthly_rent = 0, contract_type = 신규) 중 가장 늦은 계약일. 없으면 null",
    primary key (sigungu_code, legal_dong_name, lot_number),
    fulltext index ftx_deal_group_name (name) with parser ngram
) comment "건물 검색용 건물 요약. 일일 수집 뒤 전체 재생성";
