package kr.jipsee;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ModuleBoundaryTest {

    @Test
    @DisplayName("api 클래스패스에 batch의 BatchJobRunner가 없음")
    void api_클래스패스에_batch의_BatchJobRunner가_없음() {
        // when
        Throwable thrown = catchThrowable(() -> Class.forName("kr.jipsee.batch.common.BatchJobRunner"));

        // then
        assertThat(thrown).isInstanceOf(ClassNotFoundException.class);
    }

    @Test
    @DisplayName("api 클래스패스에 batch의 공공데이터 API 클라이언트가 없음")
    void api_클래스패스에_batch의_공공데이터_API_클라이언트가_없음() {
        // when
        Throwable thrown = catchThrowable(() -> Class.forName("kr.jipsee.batch.publicdata.PublicDataApiClient"));

        // then
        assertThat(thrown).isInstanceOf(ClassNotFoundException.class);
    }
}
