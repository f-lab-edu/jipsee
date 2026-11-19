create table law_article (
    law_id char(6) not null comment "법령ID",
    article_number int not null comment "조문번호 (조문번호). 제N조의M에서 N",
    branch_number int not null comment "조문가지번호 (조문가지번호). 제N조의M에서 M, 가지가 없으면 0",
    title varchar(36) not null comment "조문제목 (조문제목). 삭제 조문은 빈 값",
    content text not null comment "조문내용과 항, 호, 목의 본문을 줄바꿈으로 이어 붙인 원문",
    created_at datetime not null default current_timestamp comment "생성 시각",
    updated_at datetime not null default current_timestamp on update current_timestamp comment "수정 시각",
    primary key (law_id, article_number, branch_number),
    constraint fk_law_article_law foreign key (law_id) references law (id)
) comment "법령 조문";
