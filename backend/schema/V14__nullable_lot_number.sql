alter table rent_deal modify lot_number varchar(20) null comment "지번 원본 값 (jibun). N, N-M이 아닌 값도 있음. 값이 없으면 null";
alter table sale_deal modify lot_number varchar(20) null comment "지번 원본 값 (jibun). N, N-M이 아닌 값도 있음. 값이 없으면 null";
