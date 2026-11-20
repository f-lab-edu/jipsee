alter table rent_deal modify match_status varchar(30) not null comment "매칭 상태. CONFIRMED, PREVIOUS, FAILED. ESTIMATED는 1단계에서 만들지 않음";
alter table sale_deal modify match_status varchar(30) not null comment "매칭 상태. CONFIRMED, PREVIOUS, FAILED. ESTIMATED는 1단계에서 만들지 않음";
