FROM continuumio/miniconda3
LABEL maintainer="Manuel Guidon <guidon@itis.ethz.ch"

RUN conda update conda
RUN conda install flask plotly pymongo numpy PyMySQL networkx
RUN conda install -c conda-forge celery
RUN pip install docker
RUN pip install redis
RUN pip install sqlalchemy-json

EXPOSE 8010

WORKDIR /work

CMD ["python", "director.py"]
