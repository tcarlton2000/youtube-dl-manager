lint:
	flake8 ./app

unittest:
	pytest -v test/ --cov=app/ --cov-report term-missing --cov-fail-under 90
	rm -rf app/test.db
	rm -rf "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.mkv"
	rm -rf "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.webm"