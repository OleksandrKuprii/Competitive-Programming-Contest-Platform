FROM python:3.8-alpine
WORKDIR /usr/app

RUN apk add gcc g++ python3-dev libffi-dev

COPY prodAWSconfig $HOME/.aws

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN mkdir -p _storage/tests && mkdir _storage/tasks && mkdir _storage/temp && mkdir _storage/submissions

COPY . .
RUN mv toucan/env.prod.py toucan/env.py
CMD ["sh", "-c", "cd toucan && python -m api"]