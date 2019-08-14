install:
	pip3 install pipenv
	pipenv install --dev

lint:
	pipenv run flake8 ./app
	pipenv run black ./ --check

format:
	pipenv run black ./

unittest:
	PYTHONPATH=${PWD} pipenv run py.test -v test/ --cov=app/ --cov-report term-missing --cov-fail-under 90
	make clean

clean:
	rm -rf app/test.db
	rm -rf "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.mkv"
	rm -rf "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.mp4"
	rm -rf "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.webm"
