from flask import Flask, render_template, request, send_from_directory, jsonify
from sympy import Matrix, symbols
from sympy.solvers.solveset import linsolve
app = Flask(__name__)

@app.route('/')
def landing():
    return render_template("calc.html")

@app.route('/elements-info')
def periodic_table():
    return send_from_directory('static', 'elements.csv')

@app.route('/solve', methods=["POST"])
def solve_equation():
    [left_side, right_side] = request.get_json()['data']
    elements = request.get_json()['present_elements']
    print(left_side)
    print(right_side)
    
    rows = []
    for element in elements:
        print('Finding', element)
        row = []
        for mol in left_side:
            try:
                row.append(-1 * mol[element])
            except:
                row.append(0)
        for mol in right_side:
            try:
                row.append(mol[element])
            except:
                row.append(0)
        row.append(0)
        rows.append(row)

    num_terms = len(left_side) + len(right_side)
    p = linsolve(Matrix((rows)), symbols("a0:%d"%num_terms))
    answer_set = tuple(*p)
    scalar = 1
    while True:
        for res in tuple(*p):
            flag = False
            if not res.subs(p.args[0][-1],scalar).is_integer:
                flag = True
                break
        if flag == True:
            scalar += 1
        else:
            break

    coeff = p.args[0]
    for i in coeff:
        if i == 0:
            print('impossible')
            return '', 204
    s = p.subs(p.args[0][-1],scalar)
    mol_count = []
    for i in range(len(left_side)):
        mol_count.append(int(answer_set[i].subs(p.args[0][-1],scalar)))
    for i in range(len(right_side)):
        mol_count.append(int(answer_set[i + len(left_side)].subs(p.args[0][-1],scalar)))
    return jsonify({'res':mol_count})
if __name__ == '__main__':
    app.run('127.0.0.1', 5000, True)
