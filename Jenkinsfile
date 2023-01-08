/* Requires the Kubernetes Pipeline plugin */
pipeline {
    agent {
      kubernetes {
        defaultContainer 'node-16'
        yaml '''
    apiVersion: v1
    kind: Pod
    spec:
      containers:
      - image: node:16.17.1-alpine
        name: node-16
        resources: {}
        command:
        - sleep
        args:
        - infinity
      dnsPolicy: ClusterFirst
      restartPolicy: Always
    '''
      }
    }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
                sh 'npm version patch -m "Upgrade to %s commit"'
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
