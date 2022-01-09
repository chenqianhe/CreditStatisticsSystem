#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/14 18:01
from server.database.link_database import LinkDatabase


def change_course(id: str, coursetype: str, courseids: str, credit: float, database: LinkDatabase) -> dict:
    res1 = database.change_data("course", coursetype, {"id": id}, "course", courseids)
    res2 = database.change_data("course", coursetype, {"id": id}, "credit", credit)
    if "ok" in res1.keys() and res1["ok"] == 1 and "ok" in res2.keys() and res2["ok"] == 1:
        return {"state": 1, "content": "成功"}
    else:
        return {"state": 0, "content": "异常"}
