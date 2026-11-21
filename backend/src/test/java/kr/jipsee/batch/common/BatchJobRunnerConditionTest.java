package kr.jipsee.batch.common;

import static org.assertj.core.api.Assertions.assertThat;

import kr.jipsee.TestcontainersConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

class BatchJobRunnerConditionTest {

    @Nested
    @SpringBootTest
    @ActiveProfiles("test")
    @Import(TestcontainersConfiguration.class)
    @DisplayName("jipsee.batch.run.job이 없을 때")
    class WithoutProperty {

        @Autowired
        ApplicationContext context;

        @Test
        @DisplayName("러너 빈을 만들지 않아 웹 앱 컨텍스트가 그대로임")
        void 러너_빈을_만들지_않아_웹_앱_컨텍스트가_그대로임() {
            assertThat(context.getBeanNamesForType(BatchJobRunner.class)).isEmpty();
        }
    }

    @Nested
    @SpringBootTest(properties = BatchJobRunner.RUN_JOB_PROPERTY + "=noSuchJob")
    @ActiveProfiles("test")
    @Import(TestcontainersConfiguration.class)
    @DisplayName("jipsee.batch.run.job이 있을 때")
    class WithProperty {

        @Autowired
        BatchJobRunner runner;

        @Test
        @DisplayName("러너 빈을 만들고 컨텍스트가 시작될 때 실행해 없는 Job 이름이면 종료 코드 2를 돌려줌")
        void 러너_빈을_만들고_컨텍스트가_시작될_때_실행해_없는_Job_이름이면_종료_코드_2를_돌려줌() {
            assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.BAD_ARGS);
        }
    }

    @Nested
    @SpringBootTest(properties = BatchJobRunner.RUN_JOB_PROPERTY + "=false")
    @ActiveProfiles("test")
    @Import(TestcontainersConfiguration.class)
    @DisplayName("jipsee.batch.run.job이 false일 때")
    class WithFalseProperty {

        @Autowired
        BatchJobRunner runner;

        @Test
        @DisplayName("값과 상관없이 러너 빈을 만들고 없는 Job 이름으로 보아 종료 코드 2를 돌려줌")
        void 값과_상관없이_러너_빈을_만들고_없는_Job_이름으로_보아_종료_코드_2를_돌려줌() {
            assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.BAD_ARGS);
        }
    }
}
