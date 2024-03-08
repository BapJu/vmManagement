pipeline {
    agent any



    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'composer install'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'vendor/bin/phpunit'
            }
        }
        stage('Check SonarQube Connection') {
            steps {
                sh 'curl -s -f http://10.10.48.204/api/system/status'
            }
        }
        stage('SonarQube analysis 1') {
                steps {
                    sh 'mvn clean package sonar:sonar'
                }
            }
            stage("Quality Gate 1") {
                steps {
                    waitForQualityGate abortPipeline: true
                }
            }
            stage('SonarQube analysis 2') {
                steps {
                    sh 'gradle sonarqube'
                }
            }
            stage("Quality Gate 2") {
                steps {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('SonarQube analysis') {

            steps {
                  withSonarQubeEnv('sonarqube-server') {
                      sh "${env.SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectKey=simple_webapp \
                      -Dsonar.sources=. "
                  }
            }
        }
    }

    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
