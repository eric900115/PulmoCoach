from flask import Flask, request
from flask_restful import Resource, Api
from flask import jsonify
from flask_cors import CORS, cross_origin

from firebase import firebase

import random
import csv

db_url = #TODO
fdb = firebase.FirebaseApplication(db_url, None)

labels = []

with open('label.csv', newline='') as csvfile:

    rows = csv.reader(csvfile)

    for row in rows:
        if row[0] == 'File Name':
            continue
        labels.append(row[0])

app = Flask(__name__)
CORS(app)
api = Api(app)

class Item(Resource):

    def get(self, num):
        label = random.sample(labels, num)
        data = {}
        for v in label:
            data[v] = (fdb.get('/metaData', v))
        return jsonify(data)

class ItemsList(Resource):

    def get(self):
        users = fdb.get('/metaData/', None)
        return jsonify(users)
    
class Result(Resource):

    def get(self, uid):
        history = fdb.get('/result/', None)
        return jsonify(history)

    def post(self, uid):
        data = request.get_json()
        
        Data = fdb.get('/result', uid)
        print(data)
        if Data == None:
            fdb.put('/result', uid, [data])
        else:
            Data += [data]
            fdb.put('/result', uid, Data)


api.add_resource(Item, '/item/<int:num>')
api.add_resource(ItemsList, '/items')
api.add_resource(Result, '/result/<string:uid>')

if __name__ == "__main__":
    app.run(port=5000, debug=True)
