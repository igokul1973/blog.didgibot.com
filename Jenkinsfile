/* Requires the Docker Pipeline plugin */
pipeline {
    agent {
      kubernetes {
        defaultContainer 'node-16'
        yaml '''
    apiVersion: v1
    kind: Pod
    metadata:
      labels:
        app: node-16
      name: node-16
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
      failure {
        archiveArtifacts 'test-results.txt'
      }
    }
}
