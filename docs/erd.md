# Jipsee ERD

## 개요

```mermaid
erDiagram
    rent_deal["rent_deal (전월세 거래)"] {
        bigint id PK
    }
    sale_deal["sale_deal (매매 거래)"] {
        bigint id PK
    }
    collect_status["collect_status (데이터 출처별 마지막 수집 시각)"] {
        varchar source PK
    }
```

- 모든 테이블에 created_at, updated_at을 둠. 두 컬럼은 MySQL 기본값으로 채우며, JPA 엔티티는 BaseEntity가 같은 값을 넣음

## 거래 묶음

> 같은 지번의 거래를 건물 하나로 보는 조회 단위. 테이블에 저장하지 않음

- 묶음 키는 (sigungu_code, legal_dong_name, lot_number)이며 어느 테이블에도 저장하지 않고 rent_deal과 sale_deal의 행에서 조회할 때 계산
- 묶음 id 문자열 형식은 `{sigungu_code}-{legal_dong_name}-{lot_number}`이며 예는 `11440-망원동-123-4`
- lot_number가 NULL인 거래는 묶음을 이루지 않으며 같은 법정동 주변 거래 조회에만 포함
- 묶음 이름은 묶음 안에서 계약일이 가장 늦은 거래의 house_name이며, 계약일이 같으면 rent_deal을 우선하고 그다음 id가 큰 행을 사용
- 지번 주소는 `{시군구명} {legal_dong_name} {lot_number}`이며 시군구명은 bjd.csv에서 조회
- building_parcel, building_register 테이블과 rent_deal, sale_deal의 building_parcel_id, match_status 컬럼은 스키마(`backend/schema`)에 남아 있으나 사용하지 않으며, 제거 여부는 별도 결정

## rent_deal

> 전월세 거래

```mermaid
erDiagram
    rent_deal {
        bigint id PK "거래 ID, auto_increment이며 재수집하면 다시 발급함"
        char sigungu_code "시군구코드 5자리 (sggCd)"
        varchar legal_dong_name "법정동명 (umdNm)"
        varchar lot_number "지번 원본 값, N, N-M이 아닌 값도 있음, 값이 없으면 null (jibun)"
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
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 유니크 제약을 두지 않음. 원본에 거래 ID가 없고 값이 같은 행이 있기 때문임
- INDEX(sigungu_code, deal_date)를 재수집할 때 삭제할 행을 찾는 데 사용함
- INDEX(sigungu_code, legal_dong_name, lot_number, deal_date) 추가 예정, 묶음의 거래 이력과 같은 법정동 주변 거래 조회에 사용. 새 버전 파일로 추가
- FULLTEXT(house_name) ngram 추가 예정, 연립다세대명 검색에 사용. 새 버전 파일로 추가

## sale_deal

> 매매 거래

```mermaid
erDiagram
    sale_deal {
        bigint id PK "거래 ID, auto_increment이며 재수집하면 다시 발급함"
        char sigungu_code "시군구코드 5자리 (sggCd)"
        varchar legal_dong_name "법정동명 (umdNm)"
        varchar lot_number "지번 원본 값, N, N-M이 아닌 값도 있음, 값이 없으면 null (jibun)"
        varchar house_name "단지명 (mhouseNm), 값이 없으면 NULL"
        smallint build_year "건축연도 (buildYear), 값이 없으면 NULL"
        decimal exclusive_area "전용면적, 단위 ㎡ (excluUseAr)"
        smallint floor "층, 지하 N층은 -N (floor), 값이 없으면 NULL"
        date deal_date "계약일 (dealYear, dealMonth, dealDay)"
        int deal_amount "거래금액, 단위 만원 (dealAmount)"
        varchar cancellation_type "해제 여부, 해제된 거래는 O (cdealType), 해제되지 않은 거래는 NULL"
        date cancellation_date "해제 사유 발생일, 원본 YY.MM.DD를 20YY-MM-DD로 변환 (cdealDay), 값이 없으면 NULL"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 유니크 제약을 두지 않음. 원본에 거래 ID가 없고 값이 같은 행이 있기 때문임
- INDEX(sigungu_code, deal_date)를 재수집할 때 삭제할 행을 찾는 데 사용함
- INDEX(sigungu_code, legal_dong_name, lot_number, deal_date) 추가 예정, 묶음의 거래 이력과 같은 법정동 주변 거래 조회에 사용. 새 버전 파일로 추가
- FULLTEXT(house_name) ngram 추가 예정, 단지명 검색에 사용. 새 버전 파일로 추가

## collect_status

> 데이터 출처별 마지막 수집 시각

```mermaid
erDiagram
    collect_status {
        varchar source PK "데이터 출처, 값은 RENT_DEAL, SALE_DEAL 중 하나"
        datetime loaded_at "마지막 수집 시각, 화면의 기준 월은 이 값의 월로 표시함"
        datetime created_at "행 생성 시각, MySQL 기본값 CURRENT_TIMESTAMP로 채움"
        datetime updated_at "행 수정 시각, MySQL 기본값 CURRENT_TIMESTAMP와 ON UPDATE CURRENT_TIMESTAMP로 채움"
    }
```

- 데이터명, 제공 기관, 갱신 주기, 원본 링크는 변하지 않는 값이므로 저장하지 않음
