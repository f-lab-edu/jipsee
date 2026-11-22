package kr.jipsee;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import kr.jipsee.batch.common.BatchJobRunner;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.env.MapPropertySource;

class JipseeBatchApplicationTest {

    private static AnnotationConfigApplicationContext context(boolean withJobProperty, int generatedExitCode) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        if (withJobProperty) {
            context.getEnvironment()
                    .getPropertySources()
                    .addFirst(new MapPropertySource("test", Map.of(BatchJobRunner.RUN_JOB_PROPERTY, "someJob")));
        }
        context.registerBean(ExitCodeGenerator.class, () -> () -> generatedExitCode);
        context.refresh();
        return context;
    }

    @Nested
    @DisplayName("종료 코드 결정")
    class ExitCode {

        @Test
        @DisplayName("Job 이름 프로퍼티가 없으면 2를 반환하고 컨텍스트를 종료함")
        void Job_이름_프로퍼티가_없으면_2를_반환하고_컨텍스트를_종료함() {
            // given
            AnnotationConfigApplicationContext context = context(false, 0);

            // when
            int exitCode = JipseeBatchApplication.exitCode(context);

            // then
            assertThat(exitCode).isEqualTo(2);
            assertThat(context.isActive()).isFalse();
        }

        @Test
        @DisplayName("Job 이름 프로퍼티가 있으면 ExitCodeGenerator의 값을 반환함")
        void Job_이름_프로퍼티가_있으면_ExitCodeGenerator의_값을_반환함() {
            // given
            AnnotationConfigApplicationContext context = context(true, 75);

            // when
            int exitCode = JipseeBatchApplication.exitCode(context);

            // then
            assertThat(exitCode).isEqualTo(75);
            assertThat(context.isActive()).isFalse();
        }
    }
}
