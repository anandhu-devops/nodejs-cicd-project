pipeline {
    agent any

    environment {
        IMAGE_NAME = "anandhukdevops/nodejs"
        TAG = "${BUILD_NUMBER}"
        CLUSTER = "nodejs-cluster-2"
        REGION = "ap-south-1"
    }

    stages {

        stage('Git Pull') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/anandhu-devops/nodejs-cicd-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${TAG} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker push ${IMAGE_NAME}:${TAG}
                    '''
                }
            }
        }

        stage('Configure Kubernetes') {
            steps {
                sh '''
                    aws eks update-kubeconfig --region ${REGION} --name ${CLUSTER}
                    kubectl get nodes
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sed -i "s|image:.*|image: ${IMAGE_NAME}:${TAG}|g" deployment.yaml
                    sed -i "s|image:.*|image: ${IMAGE_NAME}:${TAG}|g" canary-deployment.yaml

                    kubectl apply -f deployment.yaml
                    kubectl apply -f canary-deployment.yaml
                    kubectl apply -f service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment Successful "
        }
        failure {
            echo "Deployment Failed "
        }
    }
}
