pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone directly from GitHub
                //git branch: 'main',
                //    url: 'https://github.com/molekalex/ChuckNorris.git'
                echo '✅ Checkout complete.'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Use npm ci for reproducible installs
                sh 'npm ci'
                echo '✅ Dependencies installed.'
            }
        }

        stage('Run Functional Tests') {
            steps {
                // Run your test suite
                sh 'npm run functional'
                echo '✅ functional Tests finished.'
            }
        }
    }

    post {
        always {
            // Archive test results or logs if needed
            //junit 'reports/**/*.xml'
            echo '📊 Archiving test results...'
            echo '🏁 Pipeline finished.'
            echo '✅ Post-test cleanup complete.'
        }
    }
}
