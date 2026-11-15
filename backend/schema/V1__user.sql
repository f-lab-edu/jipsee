create table user (
    id bigint primary key auto_increment comment "사용자 ID",
    provider varchar(30) not null comment "로그인 수단. GOOGLE, KAKAO, NAVER",
    provider_user_id varchar(200) collate utf8mb4_bin not null comment "로그인 수단이 발급한 사용자 고유 ID",
    restricted_at datetime comment "이용 제한 시각. 정상 사용자는 null",
    created_at datetime not null default current_timestamp comment "가입 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    constraint uk_user_provider_provider_user_id unique (provider, provider_user_id)
) comment "사용자 정보";