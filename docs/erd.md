# Jipsee ERD

## 개요

```mermaid
erDiagram
    user["user (사용자 정보)"] {
        bigint id PK
    }
    restricted_account["restricted_account (탈퇴한 이용 제한 사용자)"] {
        varchar provider PK
        varchar provider_user_id PK
    }
    building_parcel ||--o{ building_register : "필지 1개에 동 N개"
    building_parcel["building_parcel (필지)"] {
        bigint id PK
    }
    building_register["building_register (건축물대장 표제부 동)"] {
        bigint id PK
        bigint building_parcel_id FK
    }
    building_parcel ||--o| building_location : "필지 1개에 좌표 0 또는 1개"
    building_location["building_location (필지 좌표)"] {
        bigint building_parcel_id PK, FK
    }
    building_parcel |o--o{ rent_deal : "필지 1개에 거래 N건"
    rent_deal["rent_deal (전월세 거래)"] {
        bigint id PK
        bigint building_parcel_id FK
    }
    building_parcel |o--o{ sale_deal : "필지 1개에 거래 N건"
    sale_deal["sale_deal (매매 거래)"] {
        bigint id PK
        bigint building_parcel_id FK
    }
    user ||--o{ chat : "사용자 1명에 대화 N개"
    building_parcel |o--o{ chat : "필지 1개에 대화 N개"
    chat["chat (챗봇 대화)"] {
        bigint id PK
        bigint user_id FK
        bigint building_parcel_id FK
    }
    chat ||--o{ chat_message : "대화 1개에 메시지 N개"
    chat_message["chat_message (챗봇 대화 메시지)"] {
        bigint id PK
        bigint chat_id FK
    }
    law ||--o{ law_article : "법령 1개에 조문 N개"
    law["law (법령)"] {
        char id PK
    }
    law_article["law_article (법령 조문)"] {
        char law_id PK, FK
        int article_number PK
        int branch_number PK
    }
    data_source["data_source (데이터 출처별 마지막 수집 시각)"] {
        varchar source PK
    }
```

- 모든 테이블에 created_at, updated_at을 둠. 두 컬럼은 MySQL 기본값으로 채우며, JPA 엔티티는 BaseEntity가 같은 값을 넣음

## user

> 사용자 정보

```mermaid
erDiagram
    user {
        bigint id PK "사용자 ID, 자동으로 증가함"
        varchar provider "로그인 수단, 값은 GOOGLE, KAKAO, NAVER 중 하나"
        varchar provider_user_id "로그인 수단이 발급한 사용자 고유 ID"
        datetime created_at "가입 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime restricted_at "이용 제한 시각, 제한하지 않은 사용자는 NULL"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- UNIQUE(provider, provider_user_id)이며 provider_user_id는 대소문자를 구분함
- 탈퇴하면 행을 하드 삭제함
- 운영자가 이용을 제한하면 restricted_at에 시각을 기록하고, 제한을 풀면 NULL로 되돌림. 제한 사유는 로그에 남김

## restricted_account

> 탈퇴한 이용 제한 사용자. 재가입으로 제한을 피하지 못하게 60일 동안 보관함

```mermaid
erDiagram
    restricted_account {
        varchar provider PK "로그인 수단, 값은 GOOGLE, KAKAO, NAVER 중 하나"
        varchar provider_user_id PK "로그인 수단이 발급한 사용자 고유 ID"
        datetime restricted_at "이용 제한 시각, 탈퇴 시점의 user.restricted_at을 옮김"
        datetime created_at "탈퇴 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 이용 제한된 사용자가 탈퇴하면 user 행을 삭제하기 전에 이 테이블에 행을 넣음
- 가입할 때 (provider, provider_user_id)가 이 테이블에 있으면 가입을 거부함
- 매일 한 번 created_at이 60일을 넘은 행을 삭제함

## building_parcel

> 필지

```mermaid
erDiagram
    building_parcel {
        bigint id PK "필지 ID, 서비스에서 직접 발급함"
        varchar name "건물명, bldNm이 있는 동 중 building_register.id가 가장 작은 동의 건물명, 해당 동이 없으면 NULL"
        char sigungu_code "시군구코드 5자리 (sigunguCd)"
        char legal_dong_code "법정동코드 중 뒤 5자리 (bjdongCd)"
        char land_type_code "대지구분, 0은 대지, 1은 산, 2는 블록 (platGbCd)"
        char main_lot_number "지번 본번, 앞을 0으로 채운 4자리 (bun), 값이 없으면 0000"
        char sub_lot_number "지번 부번, 앞을 0으로 채운 4자리 (ji), 값이 없으면 0000"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- UNIQUE(sigungu_code, legal_dong_code, land_type_code, main_lot_number, sub_lot_number)로 필지를 식별함
- 건축물 동이 모두 없어진 필지는 거래 FK가 참조하므로 삭제하지 않으며, 같은 지번에 동이 다시 생기면 같은 필지에 연결함
- 건축물 동이 모두 없어진 필지는 검색 결과와 S2에 나타나지 않음
- 예: 서울 종로구 부암동 208-13의 UNIQUE 컬럼 값은 `11110`, `18400`, `0`, `0208`, `0013`임

## building_register

> 건축물대장 표제부 동

```mermaid
erDiagram
    building_parcel ||--o{ building_register : "필지 1개에 동 N개"
    building_register {
        bigint id PK "동 ID, 자동으로 증가함"
        bigint building_parcel_id FK "필지 ID"
        varchar management_register_key "관리 건축물대장 PK (mgmBldrgstPk)"
        varchar lot_address "지번주소 (platPlc)"
        varchar road_address "도로명주소 (newPlatPlc), 값이 없으면 NULL"
        varchar name "건물명 (bldNm), 값이 없으면 NULL"
        varchar dong_name "건축물 동 명칭 (dongNm), 값이 없으면 NULL"
        char main_annex_type_code "주부속구분, 0은 주건축물, 1은 부속건축물 (mainAtchGbCd)"
        char use_approval_date "사용승인일, YYYYMMDD 형식의 원본 값 (useAprDay), 값이 없으면 NULL"
        int household_count "세대 수 (hhldCnt), 값이 없으면 NULL"
        int above_ground_floor_count "지상 층수 (grndFlrCnt), 값이 없으면 NULL"
        int underground_floor_count "지하 층수 (ugrndFlrCnt), 값이 없으면 NULL"
        int passenger_elevator_count "승용 승강기 수 (rideUseElvtCnt), 값이 없으면 NULL"
        varchar structure_name "구조 코드명 (strctCdNm), 값이 없으면 NULL"
        char earthquake_design_applied "내진설계 적용 여부, 0은 적용하지 않음, 1은 적용함 (rserthqkDsgnApplyYn), 값이 없으면 NULL"
        decimal total_floor_area "연면적, 단위 ㎡ (totArea), 값이 없으면 NULL"
        varchar etc_purpose "기타용도 (etcPurps), 값이 없으면 NULL"
        int indoor_mechanical_parking_count "옥내 기계식 주차 대수 (indrMechUtcnt), 값이 없으면 NULL"
        int outdoor_mechanical_parking_count "옥외 기계식 주차 대수 (oudrMechUtcnt), 값이 없으면 NULL"
        int indoor_self_propelled_parking_count "옥내 자주식 주차 대수 (indrAutoUtcnt), 값이 없으면 NULL"
        int outdoor_self_propelled_parking_count "옥외 자주식 주차 대수 (oudrAutoUtcnt), 값이 없으면 NULL"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- UNIQUE(management_register_key)이며 월 적재의 기준 키임
- FULLTEXT(name, lot_address, road_address) ngram을 건물명, 지번주소, 도로명주소 검색에 사용함
- 건물명이 없는 필지는 주소로만 검색할 수 있음
- 동은 합치지 않고 동마다 1행으로 저장함

## building_location

> 필지 좌표

```mermaid
erDiagram
    building_parcel ||--o| building_location : "필지 1개에 좌표 0 또는 1개"
    building_location {
        bigint building_parcel_id PK, FK "필지 ID"
        point location "지번주소(building_register.lot_address)를 지오코딩한 좌표, 위도 경도 순서, SRID 4326"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- SPATIAL INDEX(location)을 반경 검색에 사용함
- 지오코딩에 성공한 필지에만 행을 만들며, 행이 없는 필지는 표제부를 적재할 때마다 다시 지오코딩함

## rent_deal

> 전월세 거래

```mermaid
erDiagram
    building_parcel |o--o{ rent_deal : "필지 1개에 거래 N건"
    rent_deal {
        bigint id PK "거래 ID, 서비스에서 직접 발급하며 재수집하면 다시 발급함"
        char sigungu_code "시군구코드 5자리 (sggCd)"
        varchar legal_dong_name "법정동명 (umdNm)"
        varchar lot_number "지번 원본 값, 형식은 N 또는 N-M (jibun)"
        varchar house_name "연립다세대명 (mhouseNm), 값이 없으면 NULL"
        smallint build_year "건축연도 (buildYear), 값이 없으면 NULL"
        decimal exclusive_area "전용면적, 단위 ㎡ (excluUseAr)"
        smallint floor "층, 지하 N층은 -N (floor), 값이 없으면 NULL"
        date deal_date "계약일 (dealYear, dealMonth, dealDay)"
        int deposit "보증금, 단위 만원 (deposit)"
        int monthly_rent "월세, 단위 만원, 전세 거래는 0 (monthlyRent)"
        int previous_deposit "이전 계약 보증금, 단위 만원 (preDeposit), 값이 없으면 NULL"
        int previous_monthly_rent "이전 계약 월세, 단위 만원 (preMonthlyRent), 값이 없으면 NULL"
        varchar contract_term "계약기간 (contractTerm), 값이 없으면 NULL"
        varchar contract_type "계약 구분, 값은 신규 또는 갱신 (contractType), 값이 없으면 NULL"
        varchar renewal_right_used "갱신요구권 사용 여부 (useRRRight), 값이 없으면 NULL"
        bigint building_parcel_id FK "필지 ID, 매칭에 실패하면 NULL"
        varchar match_status "매칭 상태, 값은 CONFIRMED, ESTIMATED, PREVIOUS, FAILED 중 하나"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- CHECK: match_status가 FAILED일 때만 building_parcel_id가 NULL임
- 유니크 제약을 두지 않음. 원본에 거래 ID가 없고 값이 같은 행이 있기 때문임
- INDEX(sigungu_code, deal_date)를 재수집할 때 삭제할 행을 찾는 데 사용함
- INDEX(building_parcel_id, deal_date)를 필지의 거래 이력과 주변 거래 조회에 사용함

## sale_deal

> 매매 거래

```mermaid
erDiagram
    building_parcel |o--o{ sale_deal : "필지 1개에 거래 N건"
    sale_deal {
        bigint id PK "거래 ID, 서비스에서 직접 발급하며 재수집하면 다시 발급함"
        char sigungu_code "시군구코드 5자리 (sggCd)"
        varchar legal_dong_name "법정동명 (umdNm)"
        varchar lot_number "지번 원본 값, 형식은 N 또는 N-M (jibun)"
        varchar house_name "단지명 (mhouseNm), 값이 없으면 NULL"
        smallint build_year "건축연도 (buildYear), 값이 없으면 NULL"
        decimal exclusive_area "전용면적, 단위 ㎡ (excluUseAr)"
        smallint floor "층, 지하 N층은 -N (floor), 값이 없으면 NULL"
        date deal_date "계약일 (dealYear, dealMonth, dealDay)"
        int deal_amount "거래금액, 단위 만원 (dealAmount)"
        varchar cancellation_type "해제 여부, 해제된 거래는 O (cdealType), 해제되지 않은 거래는 NULL"
        date cancellation_date "해제 사유 발생일, 원본 YY.MM.DD를 20YY-MM-DD로 변환 (cdealDay), 값이 없으면 NULL"
        bigint building_parcel_id FK "필지 ID, 매칭에 실패하면 NULL"
        varchar match_status "매칭 상태, 값은 CONFIRMED, ESTIMATED, PREVIOUS, FAILED 중 하나"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- CHECK: match_status가 FAILED일 때만 building_parcel_id가 NULL임
- 유니크 제약을 두지 않음. 원본에 거래 ID가 없고 값이 같은 행이 있기 때문임
- INDEX(sigungu_code, deal_date)를 재수집할 때 삭제할 행을 찾는 데 사용함
- INDEX(building_parcel_id, deal_date)를 필지의 거래 이력 조회에 사용함

## chat

> 챗봇 대화

```mermaid
erDiagram
    user ||--o{ chat : "사용자 1명에 대화 N개"
    building_parcel |o--o{ chat : "필지 1개에 대화 N개"
    chat {
        bigint id PK "대화 ID, 자동으로 증가함"
        bigint user_id FK "사용자 ID"
        bigint building_parcel_id FK "필지 ID, S2에서 들어온 대화만 값이 있고 나머지는 NULL"
        varchar title "대화 제목, 첫 질문의 앞부분, 길이는 목록 화면을 정한 뒤 확정함"
        datetime created_at "대화 시작 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 사용자가 삭제하거나 탈퇴할 때까지 보관함
- user_id FK에 ON DELETE CASCADE를 걸어, 탈퇴하면 대화도 함께 삭제함
- 대화 목록은 chat_message.id 최댓값의 역순으로 정렬함. id는 작성 순서대로 증가하고 chat_id 인덱스에 함께 저장되어 있어, 테이블 행을 읽지 않고 인덱스만으로 구할 수 있음

## chat_message

> 챗봇 대화 메시지

```mermaid
erDiagram
    chat ||--o{ chat_message : "대화 1개에 메시지 N개"
    chat_message {
        bigint id PK "메시지 ID, 자동으로 증가하며 대화 안의 순서로 사용함"
        bigint chat_id FK "대화 ID"
        varchar role "작성자, 값은 USER, ASSISTANT 중 하나"
        text content "메시지 본문, 길이는 max_tokens를 정한 뒤 실측해 확정함"
        int input_token_count "LLM 입력 토큰 수, 답변 1개에서 호출한 만큼 합산함, ASSISTANT만 값이 있음"
        int output_token_count "LLM 출력 토큰 수, 답변 1개에서 호출한 만큼 합산함, ASSISTANT만 값이 있음"
        datetime created_at "작성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- chat_id FK에 ON DELETE CASCADE를 걸어, 대화를 삭제하면 메시지도 함께 삭제함
- 인덱스는 PK와 FK 인덱스만 둠. 대화의 메시지는 chat_id 인덱스로 찾고 id 순서로 정렬함

## law

> 법령

```mermaid
erDiagram
    law {
        char id PK "법령ID 6자리, 001248은 주택임대차보호법, 004950은 주택임대차보호법 시행령, 014450은 전세사기피해자 지원 및 주거안정에 관한 특별법, 001706은 민법"
        varchar name "법령명 한글, 25자 이내 (법령명_한글)"
        char law_key "법령키, 법령ID(6), 공포일자(8), 공포번호(5)를 이어 붙인 19자리 (법령키)"
        char effective_date "시행일자, YYYYMMDD 형식 (시행일자), 변경 감지와 답변 기준일 표시에 사용함"
        datetime loaded_at "적재 시각"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 법령 4건을 고정으로 저장함
- 본문 응답에 법령일련번호가 없으므로 law_key를 변경 감지에 사용함

## law_article

> 법령 조문

```mermaid
erDiagram
    law ||--o{ law_article : "법령 1개에 조문 N개"
    law_article {
        char law_id PK, FK "법령ID 6자리"
        int article_number PK "조문번호, 제N조의M에서 N (조문번호)"
        int branch_number PK "조문가지번호, 제N조의M에서 M (조문가지번호), 가지가 없으면 0"
        varchar title "조문제목, 36자 이내 (조문제목), 삭제 조문은 빈 값"
        text content "조문내용과 항, 호, 목의 본문을 줄바꿈으로 이어 붙인 원문, 최대 2,539자와 5,883바이트"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- FULLTEXT 인덱스를 두지 않음. 챗봇이 목차에서 조문을 골라 PK로 조회하기 때문임
- 조문여부가 조문인 행만 저장하며, 장과 절 같은 전문 행은 제외함
- 민법은 제618조부터 제654조까지만 저장함
- 삭제 조문은 민법 제651조처럼 원본 그대로 저장함
- API 응답의 law_key 또는 effective_date가 저장된 값과 다르면 해당 law_id의 law_article 행 전체를 삭제하고 다시 적재하며, law 갱신까지 한 트랜잭션으로 처리함
- 파싱한 조문이 0건이면 교체하지 않고 로그만 남김
- varchar 길이와 content 최대 길이는 2026-10-27 실측 최댓값 기준이며, varchar 길이를 초과하면 적재에 실패하고 로그를 남김

## data_source

> 데이터 출처별 마지막 수집 시각

```mermaid
erDiagram
    data_source {
        varchar source PK "데이터 출처, 값은 RENT_DEAL, SALE_DEAL, BUILDING_REGISTER, LAW 중 하나"
        datetime loaded_at "마지막 수집 시각, 화면의 기준 월은 이 값을 KST로 바꾼 월로 표시함"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 데이터명, 제공 기관, 갱신 주기, 원본 링크는 변하지 않는 값이므로 저장하지 않음
- LAW 행은 데이터 출처 카드에만 사용하며, 챗봇 답변의 기준일에는 law.effective_date를 사용함
