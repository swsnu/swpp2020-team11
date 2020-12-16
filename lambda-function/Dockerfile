FROM amazonlinux:latest

WORKDIR /usr
RUN yum -y groupinstall "Development tools" && \
    yum -y install gcc-c++ libcurl-devel cmake3 git && \
    pip3 install awscli

RUN git clone https://github.com/awslabs/aws-lambda-cpp.git && \
    cd aws-lambda-cpp && \
    mkdir build && \
    cd build && \
    cmake3 .. -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF \
    -DCMAKE_INSTALL_PREFIX=/out -DCMAKE_CXX_COMPILER=g++ && \
    make && make install

COPY ../../../CLionProjects/aws-lambda-cpp /usr

ENV PROJECT_NAME "asapgo-suggest"

RUN cd asapgo-suggest && mkdir build && cd build && \
    cmake3 .. -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF \
    -DCMAKE_PREFIX_PATH=/out -DCMAKE_CXX_COMPILER=g++  && \
    make && make aws-lambda-package-asapgo-suggest

CMD ['/bin/sh', 'aws', 'lambda', 'update-function-code', \
     '--function-name', 'asapgo-suggest', \
     '--zip-file', 'fileb://asapgo-suggest/build/asapgo-suggest.zip']


# docker run

#docker run -it
# -e AWS_DEFAULT_REGION=ap-northeast-2
# -e AWS_ACCESS_KEY_ID=AKIARBJSVL2VQUOMMS2A
# -e AWS_SECRET_ACCESS_KEY=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
# aws_lambda_cpp /bin/bash

# deploy
# aws lambda update-function-code --function-name asapgo-suggest --zip-file fileb://asapgo-suggest/build/asapgo-suggest.zip


# invoke with log
# aws lambda invoke --function-name asapgo-suggest out --log-type Tail --query 'LogResult' --output text |  base64 -d


