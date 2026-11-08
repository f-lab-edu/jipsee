package kr.jipsee.collect.client;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import kr.jipsee.collect.exception.DealApiException;
import tools.jackson.databind.JsonNode;

/** 실거래 API 응답의 item 하나 */
public final class DealItem {
    private static final String BLANK = " ";
    private static final DateTimeFormatter SHORT_DATE = DateTimeFormatter.ofPattern("yy.MM.dd");

    private final JsonNode node;

    private DealItem(JsonNode node) {
        this.node = node;
    }

    /** 응답 item 노드로 생성 */
    public static DealItem of(JsonNode node) {
        return new DealItem(node);
    }

    /** 필드의 텍스트 반환. 없거나 공백 1자이면 null */
    public String optionalText(String field) {
        JsonNode value = node.get(field);

        if (value == null || value.isNull()) {
            return null;
        }

        String text = value.isNumber() ? value.decimalValue().toPlainString() : value.asString();
        return BLANK.equals(text) ? null : text;
    }

    /** 필드의 텍스트 반환. 값이 없으면 DealApiException */
    public String requiredText(String field) {
        String text = optionalText(field);

        if (text == null) {
            throw new DealApiException("필수 값이 없음: " + field);
        }

        return text;
    }

    /** 콤마를 없앤 정수 반환. 값이 없으면 null */
    public Integer optionalInt(String field) {
        String text = optionalText(field);
        if (text == null) {
            return null;
        }
        try {
            return Integer.parseInt(text.replace(",", ""));
        } catch (NumberFormatException e) {
            throw new DealApiException("정수로 읽을 수 없음: " + field + "=" + text);
        }
    }

    /** 콤마를 없앤 정수 반환. 값이 없으면 DealApiException */
    public int requiredInt(String field) {
        Integer value = optionalInt(field);
        if (value == null) {
            throw new DealApiException("필수 값이 없음: " + field);
        }
        return value;
    }

    /** BigDecimal 반환. 값이 없으면 DealApiException */
    public BigDecimal requiredDecimal(String field) {
        String text = requiredText(field);
        try {
            return new BigDecimal(text);
        } catch (NumberFormatException e) {
            throw new DealApiException("숫자로 읽을 수 없음: " + field + "=" + text);
        }
    }

    /** YY.MM.DD를 LocalDate로 반환. 값이 없으면 null */
    public LocalDate optionalShortDate(String field) {
        String text = optionalText(field);
        if (text == null) {
            return null;
        }
        try {
            return LocalDate.parse(text, SHORT_DATE);
        } catch (DateTimeParseException e) {
            throw new DealApiException("날짜로 읽을 수 없음: " + field + "=" + text);
        }
    }
}
