FROM python:3.8

COPY . /usr/src
ENV SETTINGS prod
ENV AWS_SECRET_KEY AKIARJHGD2JCAERH54XY
ENV AWS_SECRET_ACCESS_KEY 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

WORKDIR /usr/src

RUN pip install -r requirements.txt

CMD ["/bin/bash", "python", "manage.py", "runserver", "0.0.0.0:80"]

EXPOSE 80