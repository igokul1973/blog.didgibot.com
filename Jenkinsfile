/* Requires the Docker Pipeline plugin */
pipeline {
    agent {
      kubernetes {
        defaultContainer 'node'
        yaml '''apiVersion: v1
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
      restartPolicy: Always'''
      }
    }
    // agent { docker { image 'node:16.17.1-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
            }
        }
    }
}
