#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/14 16:08
from server.database.link_database import LinkDatabase


def change_password(id: str, password: str, databse: LinkDatabase) -> dict:
    if databse.count_data("USER", "user", {"id": id}):
        res = databse.change_data("USER", "user", {"id": id}, "password", password)
        # print(res)
        if "ok" in res.keys() and res["ok"] == 1:
            return {"state": 1, "content": "成功"}
        else:
            return {"state": 0, "content": "异常"}
    else:
        return {"state": -1, "content": "用户不存在"}
