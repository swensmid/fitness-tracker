# SonarQube

## Pipeline

SonarQube is configured in the GitHub workflow "sonarqube.yml"

## Locally

1. Start docker
2. Run sonar-scanner.bat -D"sonar.projectKey=sonar.projectKey" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9001" -D"sonar.login=sonar.login"
