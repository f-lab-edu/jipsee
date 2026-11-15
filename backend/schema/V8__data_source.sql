create table data_source (
    source varchar(30) primary key comment "데이터 출처. RENT_DEAL, SALE_DEAL, BUILDING_REGISTER, LAW",
    loaded_at datetime not null comment "마지막 수집 시각",
    created_at datetime not null default current_timestamp comment "생성 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각"
) comment "데이터 출처별 마지막 수집 시각";
