#!/usr/bin/env python
# -*- coding:utf-8 -*-
# project: credit-statistics-system
# author: Chen Qianhe
# GitHub: https://github.com/chenqianhe
# datetime: 2021/12/14 21:28
from server.database.link_database import LinkDatabase


def change_info(name: str,
                id: str,
                grade: str,
                college: str,
                major: str,
                classtype: str,
                mailbox: str,
                password: str,
                database: LinkDatabase) -> dict:

    old_info = database.search_data("USER", "user", {"id": id})
    old_college, old_major, old_classtype = old_info["college"], old_info["major"], old_info["classtype"]

    old_url = database.search_data("convert", "convert", {"college": old_college, "major": old_major, "classtype": old_classtype})
    url = database.search_data("convert", "convert", {"college": college, "major": major, "classtype": classtype})

    database.change_data("USER", "user", {"id": id}, "name", name)
    database.change_data("USER", "user", {"id": id}, "grade", grade)
    database.change_data("USER", "user", {"id": id}, "college", college)
    database.change_data("USER", "user", {"id": id}, "major", major)
    database.change_data("USER", "user", {"id": id}, "classtype", classtype)
    if password != "":
        database.change_data("USER", "user", {"id": id}, "password", password)

    if url != old_url:
        database.change_data("course", "outside", {"id": id}, "course", "")
        database.change_data("course", "outside", {"id": id}, "credit", 0)

        database.change_data("course", "professionalelective", {"id": id}, "course", "")
        database.change_data("course", "professionalelective", {"id": id}, "credit", 0)

        database.change_data("course", "professionalpreparation", {"id": id}, "course", "")
        database.change_data("course", "professionalpreparation", {"id": id}, "credit", 0)

        database.change_data("course", "required", {"id": id}, "course", "")
        database.change_data("course", "required", {"id": id}, "credit", 0)

    return {"state": 1, "content": "已修改"}
