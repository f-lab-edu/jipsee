# Jipsee ERD

## 개요

```mermaid
erDiagram
    user["user (사용자 정보)"] {
        bigint id PK
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
    data_source["data_source (데이터 출처별 마지막 수집 시각)"] {
        varchar source PK
    }
```

## user

> 사용자 정보

```mermaid
erDiagram
    user {
        bigint id PK "사용자 ID, 자동으로 증가함"
        varchar provider "로그인 수단, 값은 GOOGLE, KAKAO, NAVER 중 하나"
        varchar provider_user_id "로그인 수단이 발급한 사용자 고유 ID"
        datetime created_at "가입 시각"
        datetime restricted_at "이용 제한 시각, 제한하지 않은 사용자는 NULL"
    }
```

- UNIQUE(provider, provider_user_id)이며 provider_user_id는 대소문자를 구분함
- 탈퇴하면 행을 하드 삭제함
- 운영자가 이용을 제한하면 restricted_at에 시각을 기록하고, 제한을 풀면 NULL로 되돌림. 제한 사유는 로그에 남김

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
        datetime collected_at "수집 시각"
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
        datetime collected_at "수집 시각"
    }
```

- CHECK: match_status가 FAILED일 때만 building_parcel_id가 NULL임
- 유니크 제약을 두지 않음. 원본에 거래 ID가 없고 값이 같은 행이 있기 때문임
- INDEX(sigungu_code, deal_date)를 재수집할 때 삭제할 행을 찾는 데 사용함
- INDEX(building_parcel_id, deal_date)를 필지의 거래 이력 조회에 사용함

## data_source

> 데이터 출처별 마지막 수집 시각

```mermaid
erDiagram
    data_source {
        varchar source PK "데이터 출처, 값은 RENT_DEAL, SALE_DEAL, BUILDING_REGISTER, LAW 중 하나"
        datetime loaded_at "마지막 수집 시각, 화면의 기준 월은 이 값을 KST로 바꾼 월로 표시함"
    }
```

- 데이터명, 제공 기관, 갱신 주기, 원본 링크는 변하지 않는 값이므로 저장하지 않음
