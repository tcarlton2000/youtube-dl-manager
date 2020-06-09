install:
	pip3 install pipenv
	pipenv install --dev
	npm install

lint:
	pipenv run flake8 ./app
	pipenv run black ./app --check
	pipenv run flake8 ./test
	pipenv run black ./test --check
	npm run lint

format:
	pipenv run black ./app
	pipenv run black ./test
	npm run format

unittest:
	PYTHONPATH=${PWD} pipenv run py.test -vv test/ --cov=app/ --cov-report term-missing --cov-fail-under 85
	make clean
	npm test

clean:
	rm -rf app/test.db
