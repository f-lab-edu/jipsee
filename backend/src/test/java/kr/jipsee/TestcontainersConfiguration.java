package kr.jipsee;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.mysql.MySQLContainer;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    private static final String MYSQL_IMAGE = "mysql:8.4.11";
    private static final String MYSQL_TIME_ZONE_OPTION = "--default-time-zone=+09:00";

    @Bean
    @ServiceConnection
    MySQLContainer mysqlContainer() {
        return new MySQLContainer(MYSQL_IMAGE)
                .withCommand(MYSQL_TIME_ZONE_OPTION);
    }
}
