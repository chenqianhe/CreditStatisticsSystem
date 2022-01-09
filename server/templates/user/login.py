#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/14 14:22
from server.database.link_database import LinkDatabase
import time


def log_in(id: str, password: str, tag: str, database: LinkDatabase) -> dict:
    if database.count_data("USER", "user", {"id": id}) == 0:
        return {"state": -1, "content": "账号不存在"}
    else:
        if database.search_data("USER", "user", {"id": id})["password"] == password:
            content = {"state": 1, "content": "成功登录", "id": id,
                       "required": {
                           "course": database.search_data("course", "required", {"id": id})["course"],
                            "credit": database.search_data("course", "required", {"id": id})["credit"]},
                       "professionalelective": {
                           "course": database.search_data("course", "professionalelective", {"id": id})["course"],
                           "credit": database.search_data("course", "professionalelective", {"id": id})["credit"]},
                       "professionalpreparation": {
                           "course": database.search_data("course", "professionalpreparation", {"id": id})["course"],
                           "credit": database.search_data("course", "professionalpreparation", {"id": id})["credit"]},
                       "publicelective": {
                           "course": database.search_data("course", "publicelective", {"id": id})["course"],
                           "credit": database.search_data("course", "publicelective", {"id": id})["credit"]},
                       "publicpreparation": {
                           "course": database.search_data("course", "publicpreparation", {"id": id})["course"],
                           "credit": database.search_data("course", "publicpreparation", {"id": id})["credit"]},
                       "outside": {
                           "course": database.search_data("course", "outside", {"id": id})["course"],
                           "credit": database.search_data("course", "outside", {"id": id})["credit"]}
                       }
            database.add_data("cookie", "state", {"tag": tag, "created_time": time.time(), "label": 0, "id": id})
            return content
        else:
            return {"state": 0, "content": "密码错误"}


def chech_login_status(tag: str, database: LinkDatabase) -> dict:
    if database.count_data("cookie", "state", {"tag": tag}):
        tagdata = database.search_data("cookie", "state", {"tag": tag})
        print(tagdata)
        if time.time() - tagdata["created_time"] < 60 * 10 and tagdata["label"] == 0:
            return {"state": 1, "id": tagdata["id"]}
        else:
            return {"state": 0}
    else:
        return {"state": 0}
