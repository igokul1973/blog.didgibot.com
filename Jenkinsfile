/* Requires the Docker Pipeline plugin */
pipeline {
    agent {
      kubernetes {
        defaultContainer 'node-16'
        yaml '''
    spec:
      containers:
      - image: node:16.17.1-alpine
        name: node-16
        resources: {}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
    '''
      }
    }
    // agent { docker { image 'node:16.17.1-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
                writeFile file: 'test-results.txt', text: 'The build is finished executing'
            }
        }
    }
    post {
      success {
        archiveArtifacts 'test-results.txt'
      }
    }
}
