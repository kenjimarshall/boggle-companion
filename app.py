from flask import Flask, jsonify, request, abort, render_template
from flask_bootstrap import Bootstrap
from flask_cors import CORS
import boggle

app = Flask(__name__)
Bootstrap(app)
CORS(app)

BOARD = {
    'solved': False,
    'size': 4,
    'symbols': [''] * 16,
    'usage_count': [0] * 16
}


def update_board(new_board):
    global BOARD
    BOARD = new_board


@app.route('/')
def index():
    return render_template('index.html', data=BOARD)


@app.route('/', methods=['POST'])
def solve_board():
    if not request.json or not 'size' in request.json or not 'symbols' in request.json:
        abort(400)

    symbols = request.json['symbols']
    size = request.json['size']
    board_obj = boggle.Boggle(symbols, size)

    solution = board_obj.find_words()
    usage_count = []
    for node in board_obj.adj_list:
        usage_count.append(node.usage_count)

    new_board = {
        'solved': True,
        'size': size,
        'symbols': symbols,
        'usage_count': usage_count
    }

    update_board(new_board)

    return jsonify({'solution': solution, 'board': new_board})


if __name__ == '__main__':
    app.run(debug=True)
