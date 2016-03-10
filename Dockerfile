FROM python:2

ENV PYTHONUNBUFFERED 1
ENV PROJECT_ROOT=/srv

ADD requirements.txt $PROJECT_ROOT/requirements.txt

RUN cd $PROJECT_ROOT && pip install -r requirements.txt

ADD . $PROJECT_ROOT
WORKDIR $PROJECT_ROOT

CMD ["./run.sh"]