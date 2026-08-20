pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone directly from GitHub
                //git branch: 'main',
                //    url: 'https://github.com/molekalex/ChuckNorris.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Use npm ci for reproducible installs
                sh 'npm ci'
            }
        }

        stage('Run Functional Tests') {
            steps {
                // Run your test suite
                sh 'npm functional'
            }
        }
    }

    post {
        always {
            // Archive test results or logs if needed
            //junit 'reports/**/*.xml'
        }
    }
}
