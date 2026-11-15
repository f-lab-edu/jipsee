create table law (
    id char(6) primary key comment "법령ID. 6자리",
    name varchar(25) not null comment "법령명 한글 (법령명_한글)",
    law_key char(19) not null comment "법령키 (법령키). 법령ID(6), 공포일자(8), 공포번호(5)를 이어 붙인 값",
    effective_date char(8) not null comment "시행일자 (시행일자). YYYYMMDD",
    loaded_at datetime not null comment "적재 시각",
    created_at datetime not null default current_timestamp comment "생성 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각"
) comment "법령";
