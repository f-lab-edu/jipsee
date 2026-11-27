# Jipsee ERD

이 문서의 스키마는 V19 적용 뒤 기준

## 개요

```mermaid
erDiagram
    rent_deal["rent_deal (전월세 거래)"] {
        bigint id PK
    }
    sale_deal["sale_deal (매매 거래)"] {
        bigint id PK
    }
    deal_group["deal_group (거래 묶음 검색용 요약)"] {
        char sigungu_code PK
        varchar legal_dong_name PK
        varchar lot_number PK
    }
    collect_status["collect_status (데이터 출처별 마지막 수집 시각)"] {
        varchar source PK
    }
```

- `rent_deal`, `sale_deal`, `collect_status`에 created_at, updated_at을 둠. 두 컬럼은 MySQL 기본값으로 채우며, JPA 엔티티는 BaseEntity가 같은 값을 넣음. `deal_group`은 매일 전체 재생성하는 파생 테이블이라 두지 않음

## 거래 묶음

> 같은 지번의 거래를 건물 하나로 보는 검색 단위. `deal_group`에 저장함

- 묶음 키는 (sigungu_code, legal_dong_name, lot_number)이며 검색 단위는 요약 테이블 `deal_group`에 저장함. `dailySaleCollectJob`의 `dealGroupRefreshStep`이 일일 수집 뒤 `deal_group_new`를 전체 재생성하고 `rename table`로 교체하므로 검색 결과는 최대 하루 늦게 반영됨(ADR 0010)
- `deal_group`의 컬럼과 인덱스는 아래 `deal_group` 절 참조
- 묶음 id 문자열 형식은 `{sigungu_code}-{legal_dong_name}-{lot_number}`이며 예는 `11440-망원동-123-4`
- lot_number가 NULL인 거래는 묶음을 이루지 않으며 같은 법정동 주변 거래 조회에만 포함
- 묶음 이름은 묶음 안에서 글자(한글, 영문)가 있는 house_name 중 계약일이 가장 늦은 거래의 값이며, 계약일이 같으면 rent_deal을 우선하고 그다음 id가 큰 행을 사용함. 글자 있는 이름이 없으면 NULL
- 지번 주소는 `{시군구명} {legal_dong_name} {lot_number}`이며 시군구명은 bjd.csv에서 조회

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
- INDEX(sigungu_code, legal_dong_name, lot_number, deal_date)를 묶음의 거래 이력, 같은 법정동 주변 거래 조회, `deal_group` 갱신 집계에 사용함(V17)
- FULLTEXT(house_name) ngram은 V17에서 추가했으나 검색이 `deal_group`으로 이동해 V19에서 삭제함

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
- INDEX(sigungu_code, legal_dong_name, lot_number, deal_date)를 묶음의 거래 이력, 같은 법정동 주변 거래 조회, `deal_group` 갱신 집계에 사용함(V17)
- FULLTEXT(house_name) ngram은 V17에서 추가했으나 검색이 `deal_group`으로 이동해 V19에서 삭제함

## deal_group

> 거래 묶음 검색용 요약. 일일 수집 뒤 전체 재생성

```mermaid
erDiagram
    deal_group {
        char sigungu_code PK "시군구코드 5자리, rent_deal, sale_deal과 같은 값"
        varchar legal_dong_name PK "법정동명"
        varchar lot_number PK "지번 원본 값, 거래 테이블은 null을 허용하나 null 거래는 묶음에서 제외하므로 NOT NULL"
        varchar name "건물명, 글자(한글, 영문)가 있는 house_name 중 가장 늦은 거래의 값, 없으면 NULL"
        date last_deal_date "전월세와 매매 전체에서 가장 늦은 계약일, 해제된 매매 포함"
        date latest_new_jeonse_date "신규 전세(monthly_rent 0, contract_type 신규) 중 가장 늦은 계약일, 없으면 NULL"
    }
```

- 외래 키를 두지 않음. 거래 테이블에서 매일 파생해 만드는 테이블이며 상세와 이력은 거래 테이블을 직접 조회함(ADR 0010)
- PRIMARY KEY(sigungu_code, legal_dong_name, lot_number)는 묶음 id의 구성 값과 같으며 지역 단독 검색에 접두사로 사용함. 별도 B-tree 인덱스는 없음
- FULLTEXT(name) ngram을 이름 단어 검색에 사용함(V18). 불용어 OFF 세션 값으로 인덱스를 생성하므로 `A동`, `in` 같은 단어도 검색됨
- 갱신은 `create table deal_group_new like deal_group`으로 만든 뒤 rent_deal과 sale_deal에서 `insert ... select`하고 `rename table`로 교체한 다음 이전 테이블을 삭제함. 이름은 테이블별 group by에서 계약일, 출처(rent_deal 우선), id를 고정 폭으로 이어 붙인 문자열의 max로 선택함

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
