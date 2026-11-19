create table restricted_account (
    provider varchar(30) not null comment "로그인 수단. GOOGLE, KAKAO, NAVER",
    provider_user_id varchar(200) collate utf8mb4_bin not null comment "로그인 수단이 발급한 사용자 고유 ID",
    restricted_at datetime not null comment "이용 제한 시각. 탈퇴 시점의 user.restricted_at 이 적용됨",
    created_at datetime not null default current_timestamp comment "탈퇴 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    primary key (provider, provider_user_id)
) comment "탈퇴한 이용 제한 사용자. 60일 동안 정보 보관";