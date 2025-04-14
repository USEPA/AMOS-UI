pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'docker.sciencedataexperts.com'

        VUE_APP_NAME = 'AMOS'
        VUE_APP_VERSION = 'DEV'
        VUE_APP_BUILD_DATE = "${BUILD_TIMESTAMP}"

        IMAGE_NAME = 'amos-ui'
        IMAGE_TAG = 'latest'

        VITE_INTERNAL_DEPLOYMENT=true
    }

    stages {
        stage('Setup Environment') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'jenkins', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh "docker login -u $USERNAME -p $PASSWORD $DOCKER_REGISTRY"
                }
            }
        }

        stage('SCM') {
            steps {
                git poll: true, branch: 'dev', credentialsId: 'valery_tkachenko',
                        url: 'https://bitbucket.org/scidataexperts/amos-ui.git'
            }
        }

        stage('Dockerize') {
            steps {
                sh "docker buildx use mybuilder"
                sh "docker buildx build --platform linux/amd64 --tag ${DOCKER_REGISTRY}/epa/${IMAGE_NAME}:${IMAGE_TAG} --push ."
            }
        }

        stage('Deploy') {
            steps {
                withKubeConfig([credentialsId: 'k8s', serverUrl: 'https://k8s.sciencedataexperts.com:6443']) {
                    sh "kubectl rollout restart deployment ${IMAGE_NAME}"
                }
            }
        }

        stage('Check') {
            steps {
                sh "sleep 5"
                // sh "curl https://amos.sciencedataexperts.com/amos/"
            }
        }
    }

    post {
        always {
            step([$class: 'Mailer', recipients: emailextrecipients([[$class: 'DevelopersRecipientProvider'], [$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']])])
        }
    }
}
