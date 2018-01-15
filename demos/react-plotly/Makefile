# Makefile with shortcuts for most common operations with react-app
CURRDIR = $(shell pwd)
IMAGENAME = itisfoundation/sandbox:react-plotly
# TODO: image should have the name of containing directory


# Use container as nodejs installation mapped to the application
node:
	docker run -it --rm -v ${CURRDIR}/app:/home/node/app -w /home/node/app -p 4002:4002 -p 4001:4001 --dns 172.16.8.15 node:8.9.2 bash


# Builds a production image of this application
build:
	docker build -t ${IMAGENAME} ./app

# Run the docker image with those options, also run 'npm start' command and detach
run:
	docker run -itd --rm -p 4002:4002 -p 4001:4001 --dns 172.16.8.15 --name react-plotly-demo ${IMAGENAME} npm start



demo: build run
	open http:/localhost:4001

stop:
	docker stop react-plotly-demo
	docker rm react-plotly-demo
