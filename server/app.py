from flask import Flask, jsonify, request
from flask_cors import CORS  # Flask的跨域问题
from server.database.link_database import LinkDatabase
from server.templates.user.adduser import add_user, send_email
from server.templates.user.login import log_in, chech_login_status
from server.templates.user.changepassword import change_password
from server.templates.course.changecourse import change_course
from server.templates.course.getcourses import get_courses
from server.templates.user.changeinfo import change_info
from server.templates.user.getcollege import get_college
from server.templates.user.getuserinfo import get_userinfo


app = Flask(__name__)
app.config['DEBUG'] = True  # 开启debug
CORS(app)  # Flask的跨域问题

database = LinkDatabase()   # 输入数据库信息

testdata = database.get_data('hello', "hello")


@app.route('/adduser', methods=['POST'])
def adduser():  # put application's code here
    name = request.values.get("name")
    id = request.values.get("id")
    grade = request.values.get("grade")
    college = request.values.get("college")
    major = request.values.get("major")
    classtype = request.values.get("classtype")
    mailbox = request.values.get("mailbox")
    password = request.values.get("password")
    # print(name, id, grade, college, major, classtype, mailbox, password)

    res = add_user(name, id, grade, college, major, classtype, mailbox, password, database)

    return jsonify(res)


@app.route('/verification', methods=['POST'])
def verification():
    res = send_email(request.values.get("mailbox"))
    return jsonify({"verificationcode": res})


@app.route('/login', methods=['POST'])
def login():
    print(request.values.get("id"), request.values.get("password"), request.values.get("tag"))
    return jsonify(log_in(request.values.get("id"), request.values.get("password"), request.values.get("tag"), database))


@app.route('/changepassword', methods=['POST'])
def changepassword():
    return jsonify(change_password(request.values.get("id"), request.values.get("newpassword"), database))


@app.route('/changecourses', methods=['POST'])
def changecourses():
    id = request.values.get("id")
    coursetype = request.values.get("coursetype")
    credit = float(request.values.get("credit"))
    courseids = request.values.get("courseids")

    return jsonify(change_course(id, coursetype, courseids, credit, database))


@app.route('/getcourses', methods=['POST'])
def getcourses():
    return jsonify(get_courses(request.values.get("id"), database))


@app.route('/changeinfo', methods=['POST'])
def changeinfo():
    name = request.values.get("name")
    id = request.values.get("id")
    grade = request.values.get("grade")
    college = request.values.get("college")
    major = request.values.get("major")
    classtype = request.values.get("classtype")
    mailbox = request.values.get("mailbox")
    password = request.values.get("password")

    return jsonify(change_info(name, id, grade, college, major, classtype, mailbox, password, database))


@app.route('/getcollege', methods=['POST'])
def getcollege():
    return jsonify(get_college(database))


@app.route('/checkstatus', methods=['POST'])
def checkstatus():
    return jsonify(chech_login_status(request.values.get("tag"), database))


@app.route('/getuserinfo', methods=['POST'])
def getuserinfo():
    return jsonify(get_userinfo(request.values.get("id"), database))
