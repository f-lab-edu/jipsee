create table building_parcel (
    id bigint primary key auto_increment comment "필지 ID. 서비스에서 직접 발급",
    name varchar(200) comment "건물명. bldNm이 있는 동 중에서 building_register.id가 가장 작은 동의 건물명, 해당 동이 없으면 null",
    sigungu_code char(5) not null comment "시군구코드 (sigunguCd). 5자리",
    legal_dong_code char(5) not null comment "법정동코드 (bjdongCd). 법정동코드 중 뒤 5자리",
    land_type_code char(1) not null comment "대지구분 (platGbCd). 0: 대지, 1: 산, 2: 블록",
    main_lot_number char(4) not null comment "지번 본번 (bun). 지번의 본번 중 4자리. 앞에서부터 0으로 채우며 값이 없으면 0000",
    sub_lot_number char(4) not null comment "지번 부번 (ji). 지번의 부번 중 4자리. 앞에서부터 0으로 채우며 값이 없으면 0000",
    created_at datetime not null default current_timestamp comment "생성 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    constraint uk_building_parcel_lot unique (sigungu_code, legal_dong_code, land_type_code, main_lot_number, sub_lot_number)
) comment "필지";