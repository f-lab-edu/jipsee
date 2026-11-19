create table chat (
    id bigint primary key auto_increment comment "대화 ID",
    user_id bigint not null comment "사용자 ID",
    building_parcel_id bigint comment "필지 ID. S2에서 들어온 대화만 값이 있음",
    title varchar(100) not null comment "대화 제목. 첫 질문의 앞부분",
    created_at datetime not null default current_timestamp comment "대화 시작 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    constraint fk_chat_user foreign key (user_id) references user (id) on delete cascade,
    constraint fk_chat_building_parcel foreign key (building_parcel_id) references building_parcel (id)
) comment "챗봇 대화";
