FROM python:3.11.3-alpine
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV FLASK_APP=application.py
ENTRYPOINT ["./gunicorn.sh"]