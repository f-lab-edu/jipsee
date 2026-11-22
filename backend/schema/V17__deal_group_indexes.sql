alter table rent_deal add index idx_rent_deal_sigungu_code_legal_dong_name_lot_number_deal_date (sigungu_code, legal_dong_name, lot_number, deal_date), algorithm = inplace, lock = none;
alter table sale_deal add index idx_sale_deal_sigungu_code_legal_dong_name_lot_number_deal_date (sigungu_code, legal_dong_name, lot_number, deal_date), algorithm = inplace, lock = none;

alter table rent_deal add fulltext index ftx_rent_deal_house_name (house_name) with parser ngram;
alter table sale_deal add fulltext index ftx_sale_deal_house_name (house_name) with parser ngram;
