pipeline {
  agent {
    docker {
      image 'cypress/base:20.9.0'
    }
  }

  stages 
  {
    stage('Clone repository') {
      steps {
        script {
          sh 'git clone https://github.com/fannyv/vulnerabilities_cypress.git'
          sh 'cd vulnerabilities_cypress && git checkout master'
        }
      }
    }
    stage('build and test') {
      steps {
        sh 'npm install'
        sh 'npm run test:report'
      }
    }
  }
}