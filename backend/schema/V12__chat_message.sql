create table chat_message (
    id bigint primary key auto_increment comment "메시지 ID. 대화 안의 순서로 사용",
    chat_id bigint not null comment "대화 ID",
    role varchar(30) not null comment "작성자. USER, ASSISTANT",
    content text not null comment "메시지 본문",
    input_token_count int comment "LLM 입력 토큰 수. 답변 1개에서 호출한 만큼 합산, ASSISTANT만 값이 있음",
    output_token_count int comment "LLM 출력 토큰 수. 답변 1개에서 호출한 만큼 합산, ASSISTANT만 값이 있음",
    created_at datetime not null default current_timestamp comment "작성 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    constraint fk_chat_message_chat foreign key (chat_id) references chat (id) on delete cascade
) comment "챗봇 대화 메시지";
