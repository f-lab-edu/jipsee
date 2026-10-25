# Jipsee ERD

## 개요

```mermaid
erDiagram
    user {
        bigint id PK
    }
    building_parcel ||--o{ building_register : "필지 1개에 동 N개"
    building_parcel {
        bigint id PK
    }
    building_register {
        bigint id PK
        bigint building_parcel_id FK
    }
    building_parcel ||--o| building_location : "필지 1개에 좌표 0 또는 1개"
    building_location {
        bigint building_parcel_id PK, FK
    }
    building_parcel |o--o{ rent_deal : "필지 1개에 거래 N건"
    rent_deal {
        bigint id PK
        bigint building_parcel_id FK
    }
    building_parcel |o--o{ sale_deal : "필지 1개에 거래 N건"
    sale_deal {
        bigint id PK
        bigint building_parcel_id FK
    }
```

## user

> 사용자 정보

```mermaid
erDiagram
    user {
        bigint id PK "사용자 ID, 자동 증가"
        varchar provider "로그인 수단: GOOGLE, KAKAO, NAVER"
        varchar provider_user_id "로그인 수단이 발급한 사용자 고유 ID"
        timestamp created_at "가입 시각"
    }
```

- UNIQUE(provider, provider_user_id): 로그인 수단별 별도 계정, provider_user_id는 대소문자 구분
- 탈퇴 시 행 삭제 (하드 삭제)

## building_parcel

> 필지

```mermaid
erDiagram
    building_parcel {
        bigint id PK "필지 ID, 자체 발급"
        varchar name "건물명, bldNm이 있는 동 중 management_register_key가 가장 앞선 동의 값, 없으면 NULL"
        char sigungu_code "시군구코드 5자리 (sigunguCd)"
        char legal_dong_code "법정동코드 뒤 5자리 (bjdongCd)"
        char land_type_code "대지구분, 대지:0, 산:1, 블록:2 (platGbCd)"
        char main_lot_number "지번의 번, 4자리 0 채움, 없으면 0000"
        char sub_lot_number "지번의 지, 4자리, 없으면 0000"
    }
```

- UNIQUE(sigungu_code, legal_dong_code, land_type_code, main_lot_number, sub_lot_number): 필지 식별을 위한 유니크 제약조건
- 예: 서울 종로구 부암동 208-13 = `11110`, `18400`, `0`, `0208`, `0013`

## building_register

> 건축물대장 표제부 동

```mermaid
erDiagram
    building_parcel ||--o{ building_register : "필지 1개에 동 N개"
    building_register {
        bigint id PK "동 ID, 자동 증가"
        bigint building_parcel_id FK "필지 ID"
        varchar management_register_key "관리건축물대장PK (mgmBldrgstPk)"
        varchar lot_address "지번주소 (platPlc)"
        varchar road_address "도로명주소 (newPlatPlc), 없으면 NULL"
        varchar name "건물명 (bldNm), 없으면 NULL"
        varchar dong_name "동 명칭 (dongNm), 없으면 NULL"
        char main_annex_type_code "주부속구분, 주건축물:0, 부속건축물:1 (mainAtchGbCd)"
        char use_approval_date "사용승인일 YYYYMMDD 원본 그대로 (useAprDay), 없으면 NULL"
        int household_count "세대 수 (hhldCnt)"
        int above_ground_floor_count "지상 층수 (grndFlrCnt)"
        int underground_floor_count "지하 층수 (ugrndFlrCnt)"
        int passenger_elevator_count "승용 승강기 수 (rideUseElvtCnt)"
        varchar structure_name "구조 코드명 (strctCdNm)"
        char earthquake_design_applied "내진설계 적용 여부, 미적용:0, 적용:1 (rserthqkDsgnApplyYn), 없으면 NULL"
        decimal total_floor_area "연면적 ㎡ (totArea)"
        varchar etc_purpose "기타용도 (etcPurps), 없으면 NULL"
        int indoor_mechanical_parking_count "옥내 기계식 주차 대수 (indrMechUtcnt)"
        int outdoor_mechanical_parking_count "옥외 기계식 주차 대수 (oudrMechUtcnt)"
        int indoor_self_propelled_parking_count "옥내 자주식 주차 대수 (indrAutoUtcnt)"
        int outdoor_self_propelled_parking_count "옥외 자주식 주차 대수 (oudrAutoUtcnt)"
    }
```

- 필지 1개(building_parcel)에 동 N개(building_register): 1:N, 동은 원본 그대로 나열
- UNIQUE(management_register_key): 동 식별, 월 적재의 기준 키
- 적재 범위: 연립 또는 다세대 동이 있는 필지의 동 전부, 총괄표제부 제외
- FULLTEXT(name, lot_address, road_address) ngram: 건물명, 지번주소, 도로명주소 통합 검색
- 원본이 0인 수치 필드는 0으로 저장, 화면에서 숨김 (승강기는 0이면 "없음" 표시)

## building_location

> 필지 좌표

```mermaid
erDiagram
    building_parcel ||--o| building_location : "필지 1개에 좌표 0 또는 1개"
    building_location {
        bigint building_parcel_id PK, FK "필지 ID"
        point location "좌표, 위도 경도 순서, SRID 4326, 지오코딩 결과"
    }
```

- PK가 FK: 필지당 좌표 1개
- 지오코딩에 성공한 필지만 행 생성
- SPATIAL INDEX(location): 주변 거래 반경 검색

## rent_deal

> 전월세 거래

```mermaid
erDiagram
    building_parcel |o--o{ rent_deal : "필지 1개에 거래 N건"
    rent_deal {
        bigint id PK "거래 ID, 자체 발급, 재수집 시 재발급"
        char sigungu_code "시군구코드 5자리 (sggCd)"
        varchar legal_dong_name "법정동 (umdNm)"
        varchar lot_number "지번 원본, N 또는 N-M (jibun)"
        varchar house_name "연립다세대명 (mhouseNm), 없으면 NULL"
        smallint build_year "건축연도 (buildYear), 없으면 NULL"
        decimal exclusive_area "전용면적 ㎡ (excluUseAr)"
        smallint floor "층, 지하 -1 (floor), 없으면 NULL"
        date deal_date "계약일 (dealYear, dealMonth, dealDay)"
        int deposit "보증금 만원 (deposit)"
        int monthly_rent "월세 만원, 전세는 0 (monthlyRent)"
        int previous_deposit "종전 계약 보증금 만원 (preDeposit), 없으면 NULL"
        int previous_monthly_rent "종전 계약 월세 만원 (preMonthlyRent), 없으면 NULL"
        varchar contract_term "계약기간 (contractTerm), 없으면 NULL"
        varchar contract_type "계약 구분, 신규 또는 갱신 (contractType), 없으면 NULL"
        varchar renewal_right_used "갱신요구권 사용 (useRRRight), 없으면 NULL"
        bigint building_parcel_id FK "필지 ID, 매칭 실패 시 NULL"
        varchar match_status "매칭 상태: CONFIRMED, ESTIMATED, PREVIOUS, FAILED"
        timestamp collected_at "수집 시각"
    }
```

- 필지 1개(building_parcel)에 거래 N건(rent_deal): 1:N, 매칭 실패 거래는 필지 없음
- CHECK: match_status가 FAILED일 때만 building_parcel_id가 NULL
- 유니크 제약 없음: 원본에 거래 ID가 없고 값이 같은 행이 존재
- 재수집: (sigungu_code, deal_date) 월 범위 삭제 후 재적재
- INDEX(sigungu_code, deal_date): 재수집 삭제
- INDEX(building_parcel_id, deal_date): 거래 이력, 주변 거래 조회

## sale_deal

> 매매 거래

```mermaid
erDiagram
    building_parcel |o--o{ sale_deal : "필지 1개에 거래 N건"
    sale_deal {
        bigint id PK "거래 ID, 자체 발급, 재수집 시 재발급"
        char sigungu_code "시군구코드 5자리 (sggCd)"
        varchar legal_dong_name "법정동 (umdNm)"
        varchar lot_number "지번 원본, N 또는 N-M (jibun)"
        varchar house_name "단지명 (mhouseNm), 없으면 NULL"
        smallint build_year "건축연도 (buildYear), 없으면 NULL"
        decimal exclusive_area "전용면적 ㎡ (excluUseAr)"
        smallint floor "층, 지하 -1 (floor), 없으면 NULL"
        date deal_date "계약일 (dealYear, dealMonth, dealDay)"
        int deal_amount "거래금액 만원 (dealAmount)"
        varchar cancellation_type "해제 여부, 해제는 O (cdealType), 해제가 아니면 NULL"
        date cancellation_date "해제 사유 발생일, YY.MM.DD를 20YY-MM-DD로 변환 (cdealDay), 없으면 NULL"
        bigint building_parcel_id FK "필지 ID, 매칭 실패 시 NULL"
        varchar match_status "매칭 상태: CONFIRMED, ESTIMATED, PREVIOUS, FAILED"
        timestamp collected_at "수집 시각"
    }
```

- 필지 1개(building_parcel)에 거래 N건(sale_deal): 1:N, 매칭 실패 거래는 필지 없음
- CHECK: match_status가 FAILED일 때만 building_parcel_id가 NULL
- 유니크 제약 없음: 원본에 거래 ID가 없고 값이 같은 행이 존재
- 재수집: (sigungu_code, deal_date) 월 범위 삭제 후 재적재
- INDEX(sigungu_code, deal_date): 재수집 삭제
- INDEX(building_parcel_id, deal_date): 거래 이력 조회

## data_source

> 데이터 출처별 기준 월

```mermaid
erDiagram
    data_source {
        varchar source PK "데이터 출처: RENT_DEAL, SALE_DEAL, BUILDING_REGISTER, LAW"
        char base_year_month "현재 기준 월 YYYYMM"
        timestamp loaded_at "마지막 적재 시각"
    }
```

- 다른 테이블과 관계 없음
- 화면의 기준일 표시와 데이터 출처 카드의 현재 기준 월에 사용
- 데이터명, 제공 기관, 갱신 주기, 원본 링크는 고정 값이라 저장하지 않음
