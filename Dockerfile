FROM python:3.7-alpine

COPY ./requirements.txt /

RUN pip install -r ./requirements.txt

COPY . /app

WORKDIR /app

CMD FLASK_APP=exerciser/server.py TEXT_DB=./bases/german.sqlite flask run --host=0.0.0.0
