# Exerciser - a simple tool for practicing English or any other language!

Give it couple of words you want to practice with and service will find sentences with them.
You will need to guess the correct one.


Install and run:
```
pip install -r requirements.txt

TEXT_DB=./bases/german.sqlite FLASK_APP=exerciser/server.py flask run --host=0.0.0.0
```

Or with docker:
```
docker build -t der-trainer .

docker run -p 5000:5000 --rm -it der-trainer
```

And open [http://localhost:5000/](http://localhost:5000/)

