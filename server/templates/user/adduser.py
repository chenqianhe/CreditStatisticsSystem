#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/14 13:03
from server.database.link_database import LinkDatabase
import time
from email.mime.text import MIMEText
from email.header import Header
import smtplib
import hashlib


def add_user(name: str,
            id: str,
            grade: str,
            college: str,
            major: str,
            classtype: str,
            mailbox: str,
            password: str,
            database: LinkDatabase) -> dict:

    userdata = {"name": name,
                "id": id,
                "grade": grade,
                "college": college,
                "major": major,
                "classtype": classtype,
                "mailbox": mailbox,
                "password": password
                }

    if database.count_data("USER", "user", {"id": id}) == 0:
        database.add_data("USER", "user", userdata)
        if database.count_data("USER", "user", {"id": id}):
            database.add_data("course", "required", {"id": id, "course": "", "credit": 0.0})
            database.add_data("course", "professionalelective", {"id": id, "course": "", "credit": 0.0})
            database.add_data("course", "professionalpreparation", {"id": id, "course": "", "credit": 0.0})
            database.add_data("course", "publicelective", {"id": id, "course": "", "credit": 0.0})
            database.add_data("course", "publicpreparation", {"id": id, "course": "", "credit": 0.0})
            database.add_data("course", "outside", {"id": id, "course": "", "credit": 0.0})

            return {"state": "OK"}
        else:
            return {"state": "异常，未正常添加"}
    else:
        return {"state": "用户已存在"}


def send_email(mailbox: str) -> str:
    verification_code = hashlib.md5(str(time.time())[-10:].encode(encoding='UTF-8')).hexdigest()[:5].upper()

    addr = '1278095698@qq.com'  # 发件邮箱
    password = 'ivhbcvtjnpxjhhgg'  # 邮箱密码(或者客户端授权码)
    # 登录邮箱
    smtp_server = 'smtp.qq.com'
    server = smtplib.SMTP_SSL(smtp_server, 465)
    try:
        print('开始登录')
        server.login(addr, password)  # 登录邮箱
        print('登录成功')
    except Exception as e:
        print('Error:', e)

    print("邮件开始发送")
    msg = MIMEText("您的验证码为:\n" + verification_code + "\n (3分钟内有效，请尽快输入。)", 'plain', 'utf-8')
    msg['Subject'] = Header("学分统计系统验证码", 'utf-8')
    msg['From'] = Header(addr)

    flag = 1
    try:
        msg['To'] = Header(mailbox, 'utf-8')
        server.sendmail(addr, mailbox, msg.as_string())  # 将msg转化成string发出
        print("邮件发送成功")
    except Exception as e:
        flag = 0
        print('Error:', e)

    server.quit()

    if flag:
        return verification_code
    else:
        return "error"
