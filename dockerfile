FROM python:3.8-slim-buster
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV FLASK_APP=application.py
ENTRYPOINT ["./gunicorn.sh"]