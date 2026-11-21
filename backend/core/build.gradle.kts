plugins {
    `java-library`
    `java-test-fixtures`
}

dependencies {
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("com.mysql:mysql-connector-j")

    testFixturesApi("org.springframework.boot:spring-boot-starter-test")
    testFixturesApi("org.springframework.boot:spring-boot-testcontainers")
    testFixturesApi("org.testcontainers:testcontainers-junit-jupiter")
    testFixturesApi("org.testcontainers:testcontainers-mysql")
    testFixturesApi("org.springframework.boot:spring-boot-starter-flyway")
    testFixturesRuntimeOnly("org.flywaydb:flyway-mysql")
}
