lint:
	flake8 ./app

unittest:
	pytest -v test/ --cov=app/ --cov-report term-missing
	rm -rf app/test.db
	rm -rf "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.mkv"