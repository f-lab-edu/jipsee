create table building_parcel_lookup (
    id bigint primary key auto_increment comment "조회 기록 ID",
    sigungu_code char(5) not null comment "시군구코드 (sigunguCd). 5자리",
    legal_dong_code char(5) not null comment "법정동코드 (bjdongCd). 법정동코드 중 뒤 5자리",
    land_type_code char(1) not null comment "대지구분 (platGbCd). 0: 대지, 1: 산, 2: 블록",
    main_lot_number char(4) not null comment "지번 본번 (bun). 앞에서부터 0으로 채운 4자리",
    sub_lot_number char(4) not null comment "지번 부번 (ji). 앞에서부터 0으로 채운 4자리",
    looked_up_at datetime not null comment "마지막으로 조회한 시각",
    result varchar(30) not null comment "조회 결과. SAVED: 필지와 동을 저장, EXCLUDED: 대상이 아니어서 저장하지 않음, EMPTY: 응답이 0행",
    created_at datetime not null default current_timestamp comment "생성 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    constraint uk_building_parcel_lookup_lot unique (sigungu_code, legal_dong_code, land_type_code, main_lot_number, sub_lot_number)
) comment "필지 단건 조회 기록";
