pipeline {
    agent none
    environment {
        PROFILE='gov'
        GIT_REPO_URL='https://github.com/chiwoo-samples/user-react-demo.git'
        GIT_REPO_BRANCH_NAME='main'
        DOCKER_REGISTRY_PRIVATE='vcixoe45.private-ncr.gov-ntruss.com'
        DOCKER_REGISTRY='alertnow-image-repo.ncr.gov-ntruss.com'
        IMAGE_NAME='frontend-demo'
    }
    options {
        timestamps()
    }
    stages {
        stage('Checkout-bitbucket') {
            agent { label 'finops-jenkins' }
            steps {
                deleteDir()
                sh 'ls -Al'
                checkout(
                    [$class: 'GitSCM', branches: [[name: '*/' + env.GIT_REPO_BRANCH_NAME]],
                    extensions: [],
                    userRemoteConfigs: [[credentialsId: 'github-credentials', url: env.GIT_REPO_URL]]]
                )
                sh 'ls -Al'
            }
        }

        stage('Build-react') {
            agent { docker { image 'node:17' } }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('build-docker-image') {
            agent { label 'finops-jenkins' }
            steps {
                sh 'docker build -f ./cicd/docker/Dockerfile -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest .'
            }
        }

        stage('push-image') {
            agent { label 'finops-jenkins' }
            steps {
                withCredentials([
                    string(credentialsId: 'DOCKER_REGISTRY_ID', variable: 'DOCKER_REGISTRY_ID'),
                    string(credentialsId: 'DOCKER_REGISTRY_PASSWD', variable: 'DOCKER_REGISTRY_PASSWD')
                ]) {
                    sh 'echo "${DOCKER_REGISTRY_PASSWD}" | docker login --username ${DOCKER_REGISTRY_ID} --password-stdin ${DOCKER_REGISTRY}'
                }
                sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}'
                sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest'
                sh 'ls -Al'
            }
        }

        stage('argo-deploy') {
            agent {
                docker {
                    image 'quay.io/argoproj/kubectl-argo-rollouts:master'
                    args "--entrypoint=''"
                }
            }
            steps {
                sh 'ls -Al'
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'kubeconfig')]) {
                    sh 'kubectl-argo-rollouts version'
                    sh 'kubectl-argo-rollouts get rollout ${IMAGE_NAME} --kubeconfig ${kubeconfig}'
                    sh 'kubectl-argo-rollouts set image ${IMAGE_NAME} ${IMAGE_NAME}=${DOCKER_REGISTRY_PRIVATE}/${IMAGE_NAME}:${BUILD_NUMBER} --kubeconfig ${kubeconfig}'
                    sh 'sleep 10; echo "Changed BUILD_NUMBER ......... [${BUILD_NUMBER}]"'
                    sh 'kubectl-argo-rollouts promote ${IMAGE_NAME} --kubeconfig ${kubeconfig}'
                    sh 'sleep 10; echo "Promote service routing"'
                    sh 'kubectl-argo-rollouts get rollout ${IMAGE_NAME} --kubeconfig ${kubeconfig}'
                }
            }
        }
    }

    post {
        always {
            node('finops-jenkins') {
                dir("${env.WORKSPACE}") { deleteDir() }
                sh 'docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}'
                sh 'docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest'
            }
        }
    }

}