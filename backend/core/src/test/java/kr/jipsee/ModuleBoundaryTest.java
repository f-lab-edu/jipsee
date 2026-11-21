package kr.jipsee;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ModuleBoundaryTest {

    @Test
    @DisplayName("core 클래스패스에 spring-web이 없음")
    void core_클래스패스에_spring_web이_없음() {
        // when
        Throwable thrown =
                catchThrowable(() -> Class.forName("org.springframework.web.bind.annotation.RestController"));

        // then
        assertThat(thrown).isInstanceOf(ClassNotFoundException.class);
    }

    @Test
    @DisplayName("core 클래스패스에 Spring Batch가 없음")
    void core_클래스패스에_Spring_Batch가_없음() {
        // when
        Throwable thrown = catchThrowable(() -> Class.forName("org.springframework.batch.core.job.Job"));

        // then
        assertThat(thrown).isInstanceOf(ClassNotFoundException.class);
    }
}
